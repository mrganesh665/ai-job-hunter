const fs = require("fs");
const path = require("path");
const { matchResumeToJob, extractSkillsFromText } = require("./atsScorer");

const DATA_DIR = path.join(__dirname, "../data");
const STORE_FILE = path.join(DATA_DIR, "store.json");
const DEFAULT_JOBS_FILE = path.join(DATA_DIR, "defaultJobs.json");
const DEFAULT_RESUME_FILE = path.join(DATA_DIR, "defaultResume.json");

let memoryStore = {
  resume: null,
  jobs: [],
  activities: []
};

function ensureInitialized() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (fs.existsSync(STORE_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(STORE_FILE, "utf-8"));
      memoryStore = data;
      return;
    } catch (err) {
      console.warn("Failed to parse store.json, resetting to defaults", err);
    }
  }

  // Fallback to defaults
  const defaultResume = JSON.parse(fs.readFileSync(DEFAULT_RESUME_FILE, "utf-8"));
  const defaultJobs = JSON.parse(fs.readFileSync(DEFAULT_JOBS_FILE, "utf-8"));

  memoryStore = {
    resume: defaultResume,
    jobs: defaultJobs,
    activities: [
      {
        id: "act-1",
        type: "system",
        title: "AI Job Hunter initialized",
        description: "Scored 8 initial jobs against candidate resume",
        timestamp: new Date().toISOString()
      },
      {
        id: "act-2",
        type: "applied",
        title: "Applied to Linear",
        description: "Application successfully submitted for Lead Full-Stack Web Developer",
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString()
      }
    ]
  };

  saveToDisk();
}

function saveToDisk() {
  try {
    fs.writeFileSync(STORE_FILE, JSON.stringify(memoryStore, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to persist store to disk:", err);
  }
}

// Ensure store is ready
ensureInitialized();

function getResume() {
  return memoryStore.resume;
}

function updateResume(newProfile) {
  memoryStore.resume = {
    ...memoryStore.resume,
    ...newProfile
  };

  // Re-extract skills if raw text was updated
  if (newProfile.rawText && (!newProfile.skills || newProfile.skills.length === 0)) {
    memoryStore.resume.skills = extractSkillsFromText(newProfile.rawText);
  }

  logActivity({
    type: "resume",
    title: "Resume profile updated",
    description: `Updated skills list (${memoryStore.resume.skills?.length || 0} skills detected)`
  });

  saveToDisk();
  return memoryStore.resume;
}

function getJobs(filter = {}) {
  let list = [...memoryStore.jobs];

  if (filter.status && filter.status !== "all") {
    list = list.filter((j) => j.status === filter.status);
  }

  if (filter.role && filter.role !== "all") {
    list = list.filter((j) =>
      j.role?.toLowerCase().includes(filter.role.toLowerCase()) ||
      j.title?.toLowerCase().includes(filter.role.toLowerCase())
    );
  }

  if (filter.search) {
    const q = filter.search.toLowerCase();
    list = list.filter(
      (j) =>
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        j.location.toLowerCase().includes(q) ||
        (j.skills && j.skills.some((s) => s.toLowerCase().includes(q)))
    );
  }

  if (filter.minScore) {
    const min = Number(filter.minScore);
    if (!isNaN(min)) {
      list = list.filter((j) => j.matchScore >= min);
    }
  }

  // Sort by match score descending by default
  list.sort((a, b) => b.matchScore - a.matchScore);

  return list;
}

function getJobById(id) {
  return memoryStore.jobs.find((j) => j.id === id);
}

function getStats() {
  const jobs = memoryStore.jobs;
  const total = jobs.length;
  const matched = jobs.filter((j) => j.status === "matched").length;
  const approved = jobs.filter((j) => j.status === "approved").length;
  const applied = jobs.filter((j) => j.status === "applied").length;
  const interviewing = jobs.filter((j) => j.status === "interviewing").length;
  const offer = jobs.filter((j) => j.status === "offer").length;
  const skipped = jobs.filter((j) => j.status === "skipped").length;
  const failed = jobs.filter((j) => j.status === "failed").length;

  const avgScore =
    total > 0
      ? Math.round(jobs.reduce((acc, j) => acc + (j.matchScore || 0), 0) / total)
      : 0;

  return {
    total,
    matched,
    approved,
    applied,
    interviewing,
    offer,
    skipped,
    failed,
    avgScore
  };
}

function addMultipleJobs(jobsList) {
  let countAdded = 0;
  for (const newJob of jobsList) {
    const existing = memoryStore.jobs.find(
      (j) => j.url === newJob.url || (j.title === newJob.title && j.company === newJob.company)
    );
    if (!existing) {
      memoryStore.jobs.unshift(newJob);
      countAdded++;
    }
  }

  logActivity({
    type: "new_job",
    title: `Discovered ${countAdded} live jobs`,
    description: `Fetched from live tech boards and scored against your resume.`
  });

  saveToDisk();
  return countAdded;
}

async function addJob(jobData) {
  const resume = getResume();
  const rawText = resume?.rawText || resume?.summary || "";
  const matchResult = await matchResumeToJob(rawText, jobData);

  const newJob = {
    id: `job-${Date.now()}`,
    title: jobData.title,
    company: jobData.company || "Independent Tech",
    location: jobData.location || "Remote",
    experience: jobData.experience || "Not specified",
    salary: jobData.salary || "Competitive",
    role: jobData.role || "Software Engineer",
    url: jobData.url || "https://example.com/job",
    description: jobData.description || "",
    skills: matchResult.extractedJobSkills || jobData.skills || [],
    matchScore: matchResult.matchScore,
    matchedSkills: matchResult.matchedSkills,
    missingSkills: matchResult.missingSkills,
    summary: matchResult.summary,
    status: "matched",
    createdAt: new Date().toISOString(),
    appliedAt: null,
    applyError: ""
  };

  memoryStore.jobs.unshift(newJob);

  logActivity({
    type: "new_job",
    title: `Added "${newJob.title}"`,
    description: `Discovered at ${newJob.company} — AI ATS Score: ${newJob.matchScore}%`
  });

  saveToDisk();
  return newJob;
}

function updateJobStatus(id, newStatus, extra = {}) {
  const job = memoryStore.jobs.find((j) => j.id === id);
  if (!job) return null;

  const oldStatus = job.status;
  job.status = newStatus;

  if (newStatus === "applied") {
    job.appliedAt = new Date().toISOString();
  }

  if (extra.applyError) {
    job.applyError = extra.applyError;
  }

  logActivity({
    type: newStatus,
    title: `${job.title} marked as ${newStatus}`,
    description: `Company: ${job.company} (Status changed from ${oldStatus} to ${newStatus})`
  });

  saveToDisk();
  return job;
}

function deleteJob(id) {
  const index = memoryStore.jobs.findIndex((j) => j.id === id);
  if (index === -1) return false;
  const removed = memoryStore.jobs.splice(index, 1)[0];
  saveToDisk();
  return removed;
}

async function rematchAllJobs() {
  const resume = getResume();
  const rawText = resume?.rawText || "";

  for (const job of memoryStore.jobs) {
    const match = await matchResumeToJob(rawText, job);
    job.matchScore = match.matchScore;
    job.matchedSkills = match.matchedSkills;
    job.missingSkills = match.missingSkills;
    job.summary = match.summary;
  }

  logActivity({
    type: "rematch",
    title: "AI ATS Re-match executed",
    description: `Re-calculated match scores for all ${memoryStore.jobs.length} jobs based on current resume`
  });

  saveToDisk();
  return memoryStore.jobs;
}

function resetToDefaults() {
  const defaultResume = JSON.parse(fs.readFileSync(DEFAULT_RESUME_FILE, "utf-8"));
  const defaultJobs = JSON.parse(fs.readFileSync(DEFAULT_JOBS_FILE, "utf-8"));
  memoryStore.resume = defaultResume;
  memoryStore.jobs = defaultJobs;
  memoryStore.activities = [
    {
      id: `act-${Date.now()}`,
      type: "system",
      title: "Store reset to defaults",
      description: "Restored sample jobs and candidate profile",
      timestamp: new Date().toISOString()
    }
  ];
  saveToDisk();
  return true;
}

function getActivities() {
  return memoryStore.activities || [];
}

function logActivity({ type, title, description }) {
  if (!memoryStore.activities) memoryStore.activities = [];
  const item = {
    id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    type,
    title,
    description,
    timestamp: new Date().toISOString()
  };
  memoryStore.activities.unshift(item);
  // Keep last 40 activities
  if (memoryStore.activities.length > 40) {
    memoryStore.activities = memoryStore.activities.slice(0, 40);
  }
}

function clearActivities() {
  memoryStore.activities = [];
  saveToDisk();
}

module.exports = {
  getResume,
  updateResume,
  getJobs,
  getJobById,
  getStats,
  addJob,
  addMultipleJobs,
  updateJobStatus,
  deleteJob,
  rematchAllJobs,
  resetToDefaults,
  getActivities,
  logActivity,
  clearActivities
};

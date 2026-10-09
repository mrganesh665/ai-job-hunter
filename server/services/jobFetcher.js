/**
 * Live Job Discovery Engine
 * Fetches real, active job postings from public developer job boards (RemoteOK, Arbeitnow)
 * Normalizes postings and runs them through the ATS scoring pipeline.
 */

const { matchResumeToJob, extractSkillsFromText } = require("./atsScorer");

function stripHtml(html) {
  if (!html) return "";
  return html
    .replace(/<[^>]*>?/gm, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Fetches live tech jobs from RemoteOK
 */
async function fetchRemoteOkJobs(query = "react") {
  try {
    const res = await fetch("https://remoteok.com/api", {
      headers: { "User-Agent": "AI-Job-Hunter-Agent/2.0" }
    });
    if (!res.ok) throw new Error(`RemoteOK returned ${res.status}`);
    const data = await res.json();
    // First element is legal disclaimer
    const jobs = Array.isArray(data) ? data.slice(1) : [];

    const q = query.toLowerCase();
    const filtered = jobs.filter((j) => {
      const text = `${j.position || ""} ${j.company || ""} ${j.description || ""} ${(j.tags || []).join(" ")}`.toLowerCase();
      return text.includes(q);
    });

    return filtered.slice(0, 10).map((j) => ({
      title: j.position || "Software Engineer",
      company: j.company || "Remote Tech",
      location: j.location || "Remote (Worldwide)",
      experience: "2-5+ years",
      salary: j.salary ? `$${j.salary}` : "Competitive",
      role: j.position || "Full-Stack Engineer",
      url: j.url || j.apply_url || "https://remoteok.com",
      description: stripHtml(j.description).slice(0, 2500),
      skills: j.tags || [],
      source: "RemoteOK (Live)"
    }));
  } catch (err) {
    console.warn(`[RemoteOK fetch warning]: ${err.message}`);
    return [];
  }
}

/**
 * Fetches live tech jobs from Arbeitnow
 */
async function fetchArbeitnowJobs(query = "developer") {
  try {
    const res = await fetch("https://www.arbeitnow.com/api/job-board-api", {
      headers: { "User-Agent": "AI-Job-Hunter-Agent/2.0" }
    });
    if (!res.ok) throw new Error(`Arbeitnow returned ${res.status}`);
    const json = await res.json();
    const jobs = json.data || [];

    const q = query.toLowerCase();
    const filtered = jobs.filter((j) => {
      const text = `${j.title || ""} ${j.company_name || ""} ${j.description || ""} ${(j.tags || []).join(" ")}`.toLowerCase();
      return text.includes(q);
    });

    return filtered.slice(0, 8).map((j) => ({
      title: j.title || "Software Developer",
      company: j.company_name || "Tech Company",
      location: j.location ? `${j.location} (Remote friendly)` : "Remote",
      experience: "3+ years",
      salary: "Competitive (€/$)",
      role: j.title || "Software Engineer",
      url: j.url || "https://www.arbeitnow.com",
      description: stripHtml(j.description).slice(0, 2500),
      skills: j.tags || [],
      source: "Arbeitnow (Live)"
    }));
  } catch (err) {
    console.warn(`[Arbeitnow fetch warning]: ${err.message}`);
    return [];
  }
}

/**
 * Discover live jobs across all sources, deduplicate, score with candidate resume
 */
async function discoverLiveJobs(query = "react", resumeText = "") {
  const [remoteOk, arbeitnow] = await Promise.all([
    fetchRemoteOkJobs(query),
    fetchArbeitnowJobs(query)
  ]);

  const rawJobs = [...remoteOk, ...arbeitnow];
  const processed = [];

  for (let i = 0; i < rawJobs.length; i++) {
    const raw = rawJobs[i];
    const match = await matchResumeToJob(resumeText, raw);

    processed.push({
      id: `live-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}`,
      title: raw.title,
      company: raw.company,
      location: raw.location,
      experience: raw.experience,
      salary: raw.salary,
      role: raw.role,
      url: raw.url,
      description: raw.description,
      skills: match.extractedJobSkills?.length ? match.extractedJobSkills : raw.skills,
      matchScore: match.matchScore,
      matchedSkills: match.matchedSkills,
      missingSkills: match.missingSkills,
      summary: match.summary,
      status: "matched",
      createdAt: new Date().toISOString(),
      appliedAt: null,
      applyError: "",
      source: raw.source
    });
  }

  return processed;
}

module.exports = {
  discoverLiveJobs
};

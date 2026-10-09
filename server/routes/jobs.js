const express = require("express");
const storage = require("../services/storage");
const { discoverLiveJobs } = require("../services/jobFetcher");
const { generateTailoredResume, generateOutreachSuite, generateInterviewPrep } = require("../services/aiCopilot");

const router = express.Router();

// GET /api/jobs — list jobs with search & filters
router.get("/", (req, res) => {
  try {
    const { status, role, search, minScore } = req.query;
    const jobs = storage.getJobs({ status, role, search, minScore });
    res.json({ count: jobs.length, jobs });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch jobs", message: err.message });
  }
});

// GET /api/jobs/stats — KPI dashboard stats
router.get("/stats", (req, res) => {
  try {
    const stats = storage.getStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stats", message: err.message });
  }
});

// GET /api/jobs/:id — single job detail
router.get("/:id", (req, res) => {
  try {
    const job = storage.getJobById(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch job", message: err.message });
  }
});

// POST /api/jobs — add a new job and auto-score it
router.post("/", async (req, res) => {
  try {
    const { title, company, location, experience, salary, role, url, description, skills } = req.body;
    if (!title) {
      return res.status(400).json({ error: "Job title is required" });
    }

    const job = await storage.addJob({
      title,
      company,
      location,
      experience,
      salary,
      role,
      url,
      description,
      skills
    });

    res.status(201).json({ success: true, job });
  } catch (err) {
    res.status(500).json({ error: "Failed to create job", message: err.message });
  }
});

// PATCH /api/jobs/:id/approve
router.patch("/:id/approve", (req, res) => {
  try {
    const job = storage.updateJobStatus(req.params.id, "approved");
    if (!job) return res.status(404).json({ error: "Job not found" });
    res.json({ success: true, job });
  } catch (err) {
    res.status(500).json({ error: "Failed to approve job", message: err.message });
  }
});

// PATCH /api/jobs/:id/apply
router.patch("/:id/apply", (req, res) => {
  try {
    const job = storage.updateJobStatus(req.params.id, "applied");
    if (!job) return res.status(404).json({ error: "Job not found" });
    res.json({ success: true, job });
  } catch (err) {
    res.status(500).json({ error: "Failed to record application", message: err.message });
  }
});

// PATCH /api/jobs/:id/skip
router.patch("/:id/skip", (req, res) => {
  try {
    const job = storage.updateJobStatus(req.params.id, "skipped");
    if (!job) return res.status(404).json({ error: "Job not found" });
    res.json({ success: true, job });
  } catch (err) {
    res.status(500).json({ error: "Failed to skip job", message: err.message });
  }
});

// PATCH /api/jobs/:id/restore (back to matched)
router.patch("/:id/restore", (req, res) => {
  try {
    const job = storage.updateJobStatus(req.params.id, "matched");
    if (!job) return res.status(404).json({ error: "Job not found" });
    res.json({ success: true, job });
  } catch (err) {
    res.status(500).json({ error: "Failed to restore job", message: err.message });
  }
});

// DELETE /api/jobs/:id
router.delete("/:id", (req, res) => {
  try {
    const success = storage.deleteJob(req.params.id);
    if (!success) return res.status(404).json({ error: "Job not found" });
    res.json({ success: true, message: "Job deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete job", message: err.message });
  }
});

// POST /api/jobs/rematch — recalculate ATS scores for all jobs
router.post("/rematch", async (req, res) => {
  try {
    const jobs = await storage.rematchAllJobs();
    res.json({ success: true, count: jobs.length, jobs });
  } catch (err) {
    res.status(500).json({ error: "Failed to rematch jobs", message: err.message });
  }
});

// POST /api/jobs/discover-live — discover live jobs from tech boards & auto-score
router.post("/discover-live", async (req, res) => {
  try {
    const { query = "react" } = req.body;
    const resume = storage.getResume();
    const rawText = resume?.rawText || resume?.summary || "";

    const liveJobs = await discoverLiveJobs(query, rawText);
    const addedCount = storage.addMultipleJobs(liveJobs);

    res.json({
      success: true,
      message: `Successfully fetched and scored ${liveJobs.length} live postings (${addedCount} new jobs added).`,
      count: addedCount,
      jobs: liveJobs
    });
  } catch (err) {
    res.status(500).json({ error: "Live discovery failed", message: err.message });
  }
});

// POST /api/jobs/:id/tailor-resume — generate per-job ATS tailored resume bullets
router.post("/:id/tailor-resume", (req, res) => {
  try {
    const job = storage.getJobById(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });

    const resume = storage.getResume();
    const result = generateTailoredResume(resume, job);

    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ error: "Failed to tailor resume", message: err.message });
  }
});

// POST /api/jobs/:id/generate-outreach — generate cold email, LinkedIn note & cover letter
router.post("/:id/generate-outreach", (req, res) => {
  try {
    const job = storage.getJobById(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });

    const resume = storage.getResume();
    const result = generateOutreachSuite(resume, job);

    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ error: "Failed to generate outreach suite", message: err.message });
  }
});

// POST /api/jobs/:id/interview-prep — generate interview cheat sheet
router.post("/:id/interview-prep", (req, res) => {
  try {
    const job = storage.getJobById(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });

    const resume = storage.getResume();
    const result = generateInterviewPrep(resume, job);

    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ error: "Failed to generate interview prep", message: err.message });
  }
});

// PATCH /api/jobs/:id/stage — transition to any stage (e.g., interviewing, offer)
router.patch("/:id/stage", (req, res) => {
  try {
    const { stage } = req.body;
    if (!stage) return res.status(400).json({ error: "Stage is required" });

    const job = storage.updateJobStatus(req.params.id, stage);
    if (!job) return res.status(404).json({ error: "Job not found" });

    res.json({ success: true, job });
  } catch (err) {
    res.status(500).json({ error: "Failed to update stage", message: err.message });
  }
});

module.exports = router;

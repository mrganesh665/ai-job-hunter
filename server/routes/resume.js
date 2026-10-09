const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const storage = require("../services/storage");
const { extractSkillsFromText } = require("../services/atsScorer");

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// GET /api/resume — get current active resume
router.get("/", (req, res) => {
  try {
    const resume = storage.getResume();
    res.json(resume);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch resume", message: err.message });
  }
});

// PUT /api/resume — update resume manually
router.put("/", async (req, res) => {
  try {
    const { name, title, email, summary, rawText, skills, location, experienceYears } = req.body;
    const updated = storage.updateResume({
      name,
      title,
      email,
      summary,
      rawText,
      skills,
      location,
      experienceYears: Number(experienceYears) || 0
    });

    // Optionally auto-rematch
    if (req.body.autoRematch) {
      await storage.rematchAllJobs();
    }

    res.json({ success: true, resume: updated });
  } catch (err) {
    res.status(500).json({ error: "Failed to update resume", message: err.message });
  }
});

// POST /api/resume/upload — upload PDF or text file
router.post("/upload", upload.single("resumeFile"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    let extractedText = "";

    if (
      req.file.mimetype === "application/pdf" ||
      req.file.originalname.toLowerCase().endsWith(".pdf")
    ) {
      const pdfData = await pdfParse(req.file.buffer);
      extractedText = pdfData.text || "";
    } else {
      // Plain text or markdown
      extractedText = req.file.buffer.toString("utf-8");
    }

    if (!extractedText.trim()) {
      return res.status(400).json({ error: "Could not extract text from uploaded document." });
    }

    const detectedSkills = extractSkillsFromText(extractedText);

    // Parse simple heuristics
    const lines = extractedText.split("\n").map((l) => l.trim()).filter(Boolean);
    const candidateName = lines[0] || "Candidate";
    const candidateTitle = lines[1] || "Software Engineer";

    const updatedProfile = storage.updateResume({
      name: candidateName,
      title: candidateTitle,
      rawText: extractedText,
      skills: detectedSkills,
      summary: extractedText.slice(0, 320) + "..."
    });

    // Re-match all jobs with new resume
    await storage.rematchAllJobs();

    res.json({
      success: true,
      message: `Resume parsed successfully. Detected ${detectedSkills.length} tech skills. All jobs re-matched.`,
      resume: updatedProfile
    });
  } catch (err) {
    console.error("Resume upload error:", err);
    res.status(500).json({ error: "Failed to parse resume document", message: err.message });
  }
});

module.exports = router;

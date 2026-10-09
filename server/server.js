const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const jobsRouter = require("./routes/jobs");
const resumeRouter = require("./routes/resume");
const activityRouter = require("./routes/activity");

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

// API routes
app.use("/api/jobs", jobsRouter);
app.use("/api/resume", resumeRouter);
app.use("/api/activity", activityRouter);

// Root & API welcome directory
app.get(["/", "/api"], (req, res) => {
  res.json({
    message: "🚀 AI Job Hunter Backend API is Live!",
    status: "ok",
    version: "2.0.0",
    docs: "https://github.com/mrganesh665/ai-job-hunter",
    availableEndpoints: {
      health: "/api/health",
      jobs: "/api/jobs",
      stats: "/api/jobs/stats",
      resume: "/api/resume",
      activity: "/api/activity"
    }
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    app: "AI Job Hunter API",
    version: "2.0.0",
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`\n🚀 AI Job Hunter API running on http://localhost:${PORT}`);
  console.log(`   Endpoints:`);
  console.log(`   • GET  /api/jobs (with filters: ?status=&minScore=&search=)`);
  console.log(`   • GET  /api/jobs/stats`);
  console.log(`   • GET  /api/resume`);
  console.log(`   • POST /api/resume/upload (PDF/Text)`);
  console.log(`   • GET  /api/activity\n`);
});

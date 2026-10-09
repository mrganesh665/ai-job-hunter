const express = require("express");
const storage = require("../services/storage");

const router = express.Router();

// GET /api/activity — list recent activity
router.get("/", (req, res) => {
  try {
    const activities = storage.getActivities();
    res.json({ activities });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch activities", message: err.message });
  }
});

// DELETE /api/activity — clear activity history
router.delete("/", (req, res) => {
  try {
    storage.clearActivities();
    res.json({ success: true, message: "Activity history cleared" });
  } catch (err) {
    res.status(500).json({ error: "Failed to clear activities", message: err.message });
  }
});

module.exports = router;

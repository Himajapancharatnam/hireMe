const express = require("express");
const router = express.Router();
const Job = require("../models/Job");

// GET /api/jobs — Fetch all jobs
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;

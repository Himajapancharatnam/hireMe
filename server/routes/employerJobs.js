const express = require("express");
const router = express.Router();
const Job = require("../models/Job");
const { protect, authorizeRoles } = require("../middlewares/authMiddleware");

// POST: Create a job (Employer only)
router.post("/", protect, authorizeRoles("employer"), async (req, res) => {
  try {
    const { title, company, location, description, requirements, salary } = req.body;

    // Basic validation
    if (!title || !company || !description) {
      return res.status(400).json({ message: "Please fill all required fields." });
    }

    const newJob = new Job({
      title,
      company,
      location,
      description,
      requirements,
      salary,
      postedBy: req.user._id,
    });

    await newJob.save();
    res.status(201).json({ message: "✅ Job created successfully", job: newJob });
  } catch (err) {
    console.error("❌ Create Job Error:", err);
    res.status(500).json({ error: "Failed to create job." });
  }
});

// GET: Get all jobs posted by the logged-in employer
router.get("/", protect, authorizeRoles("employer"), async (req, res) => {
  console.log("🔐 User role:", req.user.role); // Debug log

  try {
    const jobs = await Job.find({ postedBy: req.user._id });
    res.json(jobs);
  } catch (err) {
    console.error("❌ Fetch Jobs Error:", err);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

// DELETE: Delete a job by ID
router.delete("/:id", protect, authorizeRoles("employer"), async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({ _id: req.params.id, postedBy: req.user._id });

    if (!job) {
      return res.status(404).json({ message: "Job not found or unauthorized" });
    }

    res.json({ message: "🗑️ Job deleted successfully" });
  } catch (err) {
    console.error("❌ Delete Job Error:", err);
    res.status(500).json({ error: "Failed to delete job" });
  }
});

module.exports = router;

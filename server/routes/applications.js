const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const Application = require("../models/Application");
const Job = require("../models/Job");
const { protect } = require("../middlewares/authMiddleware");

// ✅ Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  if (extname) {
    return cb(null, true);
  }
  cb("Error: Only .pdf, .doc, or .docx files are allowed!");
};

const upload = multer({ storage, fileFilter });

/**
 * ✅ Apply to job (with resume upload)
 */
router.post("/", protect, upload.single("resume"), async (req, res) => {
  try {
    const { jobId } = req.body;
    const resumePath = req.file ? req.file.path : null;

    console.log("📥 jobId:", jobId);
    console.log("📎 Uploaded file:", req.file);

    // Check for missing jobId
    if (!jobId) {
      return res.status(400).json({ message: "❌ jobId is missing in the request" });
    }

    // Check for missing resume file
    if (!resumePath) {
      return res.status(400).json({ message: "❌ Resume file is missing or invalid" });
    }

    // Check if already applied
    const exists = await Application.findOne({
      jobId,
      applicantId: req.user._id,
    });

    if (exists) {
      return res.status(400).json({ message: "Already applied" });
    }

    // Save application
    const app = new Application({
      jobId,
      applicantId: req.user._id,
      resume: resumePath,
    });

    await app.save();
    res.status(201).json({ message: "✅ Applied successfully with resume" });
  } catch (err) {
    console.error("❌ Error in application POST:", err);
    res.status(500).json({ message: "Server error while applying to job" });
  }
});

/**
 * ✅ Get applications for logged-in applicant
 */
router.get("/me", protect, async (req, res) => {
  try {
    const applications = await Application.find({ applicantId: req.user._id }).populate("jobId");
    res.json(applications);
  } catch (err) {
    console.error("❌ Error in GET /me:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * ✅ Update application status (Employer only)
 */
router.put("/:id/status", protect, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id).populate("jobId");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    const job = await Job.findById(application.jobId._id);

    // Ensure only the employer who posted can update status
    if (!job || job.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to update this application" });
    }

    const { status } = req.body;

    if (!["pending", "accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    application.status = status;
    await application.save();

    res.json({ message: "✅ Status updated successfully", application });
  } catch (err) {
    console.error("❌ Error updating application status:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

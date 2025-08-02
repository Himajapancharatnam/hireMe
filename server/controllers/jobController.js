const Job = require('../models/Job');

// CREATE a new job (Employer only)
const createJob = async (req, res) => {
  try {
    const { title, company, location, description } = req.body;
    const job = new Job({
      title,
      company,
      location,
      description,
      createdBy: req.user._id
    });
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET all jobs (Public)
const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate('createdBy', 'name email role');
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE a job (only the employer who posted it)
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only delete your own jobs' });
    }

    await job.remove();
    res.status(200).json({ message: 'Job deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createJob, getAllJobs, deleteJob };

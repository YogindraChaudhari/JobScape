const express = require("express");
const Job = require("../models/Job"); // Import the Job model
const router = express.Router();

// Create a new job
router.post("/jobs", async (req, res) => {
  const { title, type, description, location, salary, company } = req.body;

  const job = new Job({
    title,
    type,
    description,
    location,
    salary,
    company,
  });

  try {
    const newJob = await job.save();
    res.status(201).json(newJob);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all jobs
router.get("/jobs", async (req, res) => {
  const limit = parseInt(req.query._limit) || 0;
  try {
    const jobs = await Job.find().limit(limit);
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a job by ID
router.get("/jobs/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (job) {
      res.json(job);
    } else {
      res.status(404).json({ message: "Job not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a job by ID
router.put("/jobs/:jobId", async (req, res) => {
  try {
    const updatedJob = await Job.findByIdAndUpdate(req.params.jobId, req.body, {
      new: true,
    });
    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.status(200).json(updatedJob);
  } catch (error) {
    console.error("Backend error:", error);
    res.status(500).json({ message: "Error updating job" });
  }
});

// Delete a job by ID
router.delete("/jobs/:id", async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (job) {
      res.json({ message: "Job deleted successfully" });
    } else {
      res.status(404).json({ message: "Job not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

const { validationResult } = require("express-validator");
const Job = require("../models/Job");
const Application = require("../models/Application");

exports.createJob = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, type, description, qualifications, responsibilities, skills, externalApplyUrl, lastDateToApply, location, salary, company } = req.body;
    const job = new Job({
      title,
      type,
      description,
      qualifications,
      responsibilities,
      skills,
      externalApplyUrl,
      lastDateToApply,
      location,
      salary,
      company,
      postedBy: req.user._id,
    });
    const newJob = await job.save();
    res.status(201).json(newJob);
  } catch (err) {
    next(err);
  }
};

exports.getJobs = async (req, res, next) => {
  try {
    const {
      _limit,
      page = 1,
      search,
      type,
      location,
    } = req.query;

    const limit = parseInt(_limit) || 10;
    const pageNum = parseInt(page) || 1;
    const skip = (pageNum - 1) * limit;

    // Build filter query
    const filter = {};
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { qualifications: { $regex: search, $options: "i" } },
        { responsibilities: { $regex: search, $options: "i" } },
        { skills: { $regex: search, $options: "i" } },
        { "company.name": { $regex: search, $options: "i" } },
      ];
    }
    if (type) {
      filter.type = type;
    }
    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    const total = await Job.countDocuments(filter);
    const jobs = await Job.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // If user is logged in, find all their applications to mark "already applied"
    let userAppliedJobIds = new Set();
    if (req.user) {
      const userApplications = await Application.find({ applicant: req.user._id }, "job");
      userAppliedJobIds = new Set(userApplications.map(app => app.job.toString()));
    }

    const jobsWithCounts = await Promise.all(
      jobs.map(async (job) => {
        const applicantsCount = await Application.countDocuments({ job: job._id });
        return { 
          ...job._doc, 
          applicantsCount,
          hasApplied: userAppliedJobIds.has(job._id.toString())
        };
      })
    );

    res.json({
      jobs: jobsWithCounts,
      page: pageNum,
      totalPages: Math.ceil(total / limit),
      totalJobs: total,
    });
  } catch (err) {
    next(err);
  }
};

exports.getJobById = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate("postedBy", "name email");

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const applicantsCount = await Application.countDocuments({ job: job._id });

    // Check if the current user (if logged in) has applied for this job
    let hasApplied = false;
    if (req.user) {
      const existingApplication = await Application.findOne({
        job: job._id,
        applicant: req.user._id
      });
      hasApplied = !!existingApplication;
    }

    res.json({ ...job._doc, applicantsCount, hasApplied });
  } catch (err) {
    next(err);
  }
};

exports.updateJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Only the employer who posted the job can update it
    if (job.postedBy && job.postedBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this job" });
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.jobId, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json(updatedJob);
  } catch (err) {
    next(err);
  }
};

exports.deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Only the employer who posted the job can delete it
    if (job.postedBy && job.postedBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this job" });
    }

    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    next(err);
  }
};

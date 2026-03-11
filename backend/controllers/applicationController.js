const { validationResult } = require("express-validator");
require("dotenv").config();
const Application = require("../models/Application");
const Job = require("../models/Job");
const User = require("../models/User");
const { createClient } = require('@supabase/supabase-js');
const { sendApplicationConfirmation, sendStatusUpdate } = require("../utils/emailService");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

exports.applyForJob = async (req, res, next) => {
  try {
    const { jobId, coverLetter } = req.body;

    if (!jobId) {
      return res.status(400).json({ message: "Job ID is required" });
    }

    let finalResumeUrl = "";
    let updatedResumeUrl = null;

    if (req.file) {
      const fileName = `${Date.now()}-${req.file.originalname.replace(/\s+/g, '-')}`;

      console.log(`[Resume Upload] File: ${fileName}, Size: ${req.file.buffer.length} bytes, Type: ${req.file.mimetype}`);
      console.log(`[Supabase] URL configured: ${supabaseUrl ? "YES (" + supabaseUrl.substring(0, 30) + "...)" : "NO - MISSING!"}`);
      console.log(`[Supabase] Key configured: ${supabaseKey ? "YES (" + supabaseKey.length + " chars)" : "NO - MISSING!"}`);

      const { data, error } = await supabase.storage
        .from('resumes')
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: false
        });

      if (error) {
        console.error("[Supabase] Upload error:", JSON.stringify(error, null, 2));
        throw new Error("Failed to upload resume to Supabase: " + error.message);
      }

      console.log("[Supabase] Upload successful:", data);

      const { data: publicUrlData } = supabase.storage
        .from('resumes')
        .getPublicUrl(fileName);

      finalResumeUrl = publicUrlData.publicUrl;

      // Update user's profile with the new resume, replacing the old one if it exists
      const user = await User.findById(req.user._id);
      if (user) {
        if (user.resumeUrl) {
          // Delete old resume from Supabase storage
          const oldFileName = user.resumeUrl.split('/resumes/')[1];
          if (oldFileName) {
            await supabase.storage.from('resumes').remove([oldFileName]);
            console.log(`[Supabase] Deleted old resume: ${oldFileName}`);
          }
        }
        user.resumeUrl = finalResumeUrl;
        await user.save();
        updatedResumeUrl = finalResumeUrl;
      }
    } else {
      // No file uploaded then will reuse the user's existing resume from their profile
      const user = await User.findById(req.user._id);
      if (user && user.resumeUrl) {
        finalResumeUrl = user.resumeUrl;
      } else {
        return res
          .status(400)
          .json({ message: "Resume file is required to apply" });
      }
    }

    // Check if already applied
    const existing = await Application.findOne({
      job: jobId,
      applicant: req.user._id,
    });
    if (existing) {
      return res
        .status(400)
        .json({ message: "You have already applied for this job" });
    }

    const application = await Application.create({
      job: jobId,
      applicant: req.user._id,
      resumeUrl: finalResumeUrl,
      coverLetter: coverLetter || "",
    });

    // Send email notification to the job seeker (non-blocking)
    try {
      const populatedJob = await Job.findById(jobId).populate("company", "name description");
      const user = await User.findById(req.user._id);
      if (user && populatedJob) {
        // Send email asynchronously in the background
        sendApplicationConfirmation(user, populatedJob);
      }
    } catch (mailErr) {
      console.error("Failed to trigger application confirmation email:", mailErr);
    }

    res.status(201).json({
      application,
      updatedResumeUrl
    });
  } catch (err) {
    next(err);
  }
};

exports.getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate("job", "title type location salary company")
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) {
    next(err);
  }
};

exports.getJobApplications = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (
      job.postedBy &&
      job.postedBy.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to view these applications" });
    }

    const applications = await Application.find({ job: req.params.jobId })
      .populate("applicant", "name email phone")
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) {
    next(err);
  }
};

exports.getJobApplicationCount = async (req, res, next) => {
  try {
    const count = await Application.countDocuments({ job: req.params.jobId });
    res.json({ count });
  } catch (err) {
    next(err);
  }
};

exports.updateApplicationStatus = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const application = await Application.findById(req.params.id).populate(
      "job"
    );
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Check ownership of the job
    if (
      application.job.postedBy &&
      application.job.postedBy.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this application" });
    }

    application.status = req.body.status;
    await application.save();

    // Re-populate for response and email
    await application.populate({
      path: "applicant",
      select: "name email phone"
    });
    
    // Send status update email notification (non-blocking)
    if (application.applicant && application.job) {
      sendStatusUpdate(application.applicant, application);
    }

    res.json(application);
  } catch (err) {
    next(err);
  }
};

exports.withdrawApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Only the applicant can withdraw their own application
    if (application.applicant.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to withdraw this application" });
    }

    await Application.findByIdAndDelete(req.params.id);
    res.json({ 
      message: "Application withdrawn successfully", 
      id: req.params.id,
      jobId: application.job 
    });
  } catch (err) {
    next(err);
  }
};

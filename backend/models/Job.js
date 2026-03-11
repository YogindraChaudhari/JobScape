const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  contactEmail: { type: String, required: true },
  contactPhone: { type: String, required: true },
});

// Define the job schema
const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: { type: String, required: true },
    description: { type: String },
    qualifications: { type: String, required: true, default: "Not specified" },
    responsibilities: { type: String, required: true, default: "Not specified" },
    skills: { type: String, required: true, default: "Not specified" },
    externalApplyUrl: { type: String },
    lastDateToApply: { type: Date, required: true, default: Date.now },
    views: { type: Number, default: 0 },
    location: { type: String, required: true },
    salary: { type: String, required: true },
    company: { type: companySchema, required: true },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);
module.exports = Job;

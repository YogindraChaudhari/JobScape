const express = require("express");
const { body } = require("express-validator");
const { protect, authorize, protectOptional } = require("../middleware/auth");
const jobController = require("../controllers/jobController");

const router = express.Router();

router.post(
  "/jobs",
  protect,
  authorize("employer"),
  [
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("type").trim().notEmpty().withMessage("Type is required"),
    body("qualifications").trim().notEmpty().withMessage("Qualifications are required"),
    body("responsibilities").trim().notEmpty().withMessage("Responsibilities are required"),
    body("skills").trim().notEmpty().withMessage("Skills are required"),
    body("location").trim().notEmpty().withMessage("Location is required"),
    body("salary").trim().notEmpty().withMessage("Salary is required"),
    body("company.name")
      .trim()
      .notEmpty()
      .withMessage("Company name is required"),
    body("company.description")
      .trim()
      .notEmpty()
      .withMessage("Company description is required"),
    body("company.contactEmail")
      .isEmail()
      .withMessage("Valid contact email is required"),
    body("company.contactPhone")
      .trim()
      .notEmpty()
      .withMessage("Contact phone is required"),
  ],
  jobController.createJob
);

router.get("/jobs", protectOptional, jobController.getJobs);
router.get("/jobs/:id", protectOptional, jobController.getJobById);
router.put("/jobs/:jobId", protect, authorize("employer"), jobController.updateJob);
router.delete("/jobs/:id", protect, authorize("employer"), jobController.deleteJob);

module.exports = router;

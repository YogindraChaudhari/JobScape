const express = require("express");
const { body } = require("express-validator");
const { protect, authorize } = require("../middleware/auth");
const upload = require("../middleware/upload");
const compressResume = require("../middleware/compressResume");
const applicationController = require("../controllers/applicationController");

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("job_seeker"),
  upload.single("resume"),
  compressResume,
  applicationController.applyForJob
);

router.get("/my", protect, authorize("job_seeker"), applicationController.getMyApplications);
router.get("/job/:jobId", protect, authorize("employer"), applicationController.getJobApplications);
router.get("/count/:jobId", protect, authorize("employer"), applicationController.getJobApplicationCount);

router.put(
  "/:id/status",
  protect,
  authorize("employer"),
  [
    body("status")
      .isIn(["pending", "reviewed", "accepted", "rejected"])
      .withMessage("Invalid status"),
  ],
  applicationController.updateApplicationStatus
);

router.delete("/:id", protect, authorize("job_seeker"), applicationController.withdrawApplication);

module.exports = router;

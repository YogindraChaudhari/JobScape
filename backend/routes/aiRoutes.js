const express = require("express");
const { protect, authorize } = require("../middleware/auth");
const aiController = require("../controllers/aiController");

const router = express.Router();

router.post(
  "/generate-cover-letter",
  protect,
  authorize("job_seeker"),
  aiController.generateCoverLetter
);

module.exports = router;

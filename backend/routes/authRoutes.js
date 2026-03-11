const express = require("express");
const { body } = require("express-validator");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");
const compressResume = require("../middleware/compressResume");
const authController = require("../controllers/authController");

const router = express.Router();

router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters")
      .matches(/[A-Z]/)
      .withMessage("Password must contain at least one uppercase letter")
      .matches(/[!@#$%^&*(),.?":{}|<>]/)
      .withMessage("Password must contain at least one symbol"),
    body("role")
      .optional()
      .isIn(["job_seeker", "employer"])
      .withMessage("Role must be job_seeker or employer"),
  ],
  authController.register
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  authController.login
);

router.get("/me", protect, authController.getMe);

router.put(
  "/profile",
  protect,
  [
    body("name").optional().trim().notEmpty().withMessage("Name cannot be empty"),
    body("email").optional().isEmail().withMessage("Valid email is required"),
    body("phone").optional().trim(),
  ],
  authController.updateProfile
);

router.post(
  "/upload-resume",
  protect,
  upload.single("resume"),
  compressResume,
  authController.uploadResume
);

module.exports = router;

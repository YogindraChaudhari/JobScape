const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: process.env.EMAIL_PORT || 465,
  secure: process.env.EMAIL_PORT == 465, // True for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const SENDER_EMAIL = process.env.EMAIL_FROM || process.env.EMAIL_USER;

exports.sendApplicationConfirmation = async (user, job) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn("Email credentials missing. Skipping email notification.");
    return;
  }

  const mailOptions = {
    from: `"JobScape" <${SENDER_EMAIL}>`,
    to: user.email,
    subject: `Application Success: ${job.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #2563eb;">Hello ${user.name},</h2>
        <p>Congratulations! Your application for <strong>${job.title}</strong> has been successfully submitted to <strong>${job.company?.name || "the recruiter"}</strong>.</p>
        <p>You can track the progress of your application through your JobScape dashboard.</p>
        <div style="margin: 20px 0; padding: 15px; background-color: #f3f4f6; border-radius: 8px;">
          <p style="margin: 0;"><strong>Job Title:</strong> ${job.title}</p>
          <p style="margin: 0;"><strong>Company:</strong> ${job.company?.name || "N/A"}</p>
          <p style="margin: 0;"><strong>Location:</strong> ${job.location || "N/A"}</p>
        </div>
        <p>Good luck with your application!</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #666;">This is an automated message from JobScape. Please do not reply.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Success email sent to ${user.email}`);
  } catch (error) {
    console.error("Error sending application success email:", error);
  }
};

exports.sendStatusUpdate = async (user, application) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;

  const statusColors = {
    accepted: "#10b981",
    rejected: "#ef4444",
    reviewed: "#2563eb",
    pending: "#f59e0b",
  };

  const mailOptions = {
    from: `"JobScape" <${SENDER_EMAIL}>`,
    to: user.email,
    subject: `Update on your application for ${application.job.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #2563eb;">Hey ${user.name},</h2>
        <p>The status of your application for <strong>${application.job.title}</strong> has been updated.</p>
        <div style="margin: 20px 0; padding: 20px; background-color: #f9fafb; border-radius: 12px; border-left: 5px solid ${statusColors[application.status] || "#374151"};">
          <p style="margin: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; color: #6b7280; font-weight: bold;">Current Status</p>
          <h3 style="margin: 5px 0; color: ${statusColors[application.status] || "#374151"}; font-size: 24px;">${application.status.toUpperCase()}</h3>
        </div>
        <p>Login to your dashboard to view more details and next steps.</p>
        <a href="${process.env.FRONTEND_URL || "http://localhost:5173"}/dashboard" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: #fff; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 10px;">Visit Dashboard</a>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
        <p style="font-size: 12px; color: #9ca3af;">Thank you for using JobScape.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Status update email sent to ${user.email}`);
  } catch (error) {
    console.error("Error sending status update email:", error);
  }
};

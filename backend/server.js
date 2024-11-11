const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jobRoutes = require("./routes/jobRoutes"); // Import job routes

require("dotenv").config();

const app = express();
// app.use(cors()); // Allow all CORS requests for now
app.use(
  cors({
    origin: ["http://localhost:1505", "https://job-scape.vercel.app"], // Allow local and production URLs
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    credentials: true, // Allow cookies and other credentials
  })
);
app.use(express.json()); // Middleware to parse JSON requests

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error: ", err));

// Use the job routes
app.use("/api", jobRoutes);

// Start the server
// const port = process.env.PORT || 5000;
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

import axios from "axios";

// const API_URL = "http://localhost:5000/api/jobs"; // Backend API URL
const API_URL = `${import.meta.env.VITE_API_URL}/api/jobs`;

// Create a new job
export const createJob = async (jobData) => {
  try {
    const response = await axios.post(API_URL, jobData);
    return response.data;
  } catch (error) {
    console.error("Error creating job:", error);
    throw error;
  }
};

// Fetch all jobs
export const getJobs = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching jobs:", error);
    throw error;
  }
};

// Update an existing job by ID
export const updateJob = async (updatedJob) => {
  try {
    const url = `${API_URL}/${updatedJob._id}`;
    console.log("Updating job at:", url);
    console.log("Payload data:", updatedJob);

    const res = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedJob),
    });

    if (!res.ok) {
      const errorDetails = await res.text();
      console.error("Error details:", errorDetails);
      throw new Error(`Error updating job: ${res.status} ${res.statusText}`);
    }

    return await res.json(); // Return the updated job data
  } catch (error) {
    console.error("Failed to update job:", error);
    throw error; // Re-throw to handle further in EditJobPage
  }
};

// Delete a job by ID
export const deleteJob = async (jobId) => {
  try {
    const response = await axios.delete(`${API_URL}/${jobId}`); // Send DELETE request to delete job
    return response.data; // Return the response message
  } catch (error) {
    console.error("Error deleting job:", error);
    throw error; // Propagate error if the delete fails
  }
};

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { applyForJob, withdrawApplication } from "./applicationSlice";

const API_URL = `${import.meta.env.VITE_API_URL}/api/jobs`;

// Helper to get auth header
const getAuthHeader = (getState) => {
  const token = getState().auth.user?.token;
  return { headers: { Authorization: `Bearer ${token}` } };
};

// Fetch jobs with search, filter, pagination
export const fetchJobs = createAsyncThunk(
  "jobs/fetchJobs",
  async (params = {}, { getState, rejectWithValue }) => {
    try {
      const res = await axios.get(API_URL, { params, ...getAuthHeader(getState) });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch jobs");
    }
  },
  {
    condition: (params, { getState }) => {
      const { jobs } = getState();
      const lastParams = jobs.lastFetchParams;
      // Skip fetching if we already fetched with the exact same parameters
      if (lastParams && JSON.stringify(lastParams) === JSON.stringify(params)) {
        return false;
      }
      return true;
    }
  }
);

// Fetch single job
export const fetchJobById = createAsyncThunk(
  "jobs/fetchJobById",
  async (id, { getState, rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/${id}`, getAuthHeader(getState));
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch job");
    }
  },
  {
    condition: (id, { getState }) => {
      const { jobs } = getState();
      // Skip fetching if the currently loaded job is already the requested job
      if (jobs.currentJob && jobs.currentJob._id === id) {
        return false;
      }
      return true;
    }
  }
);


// Create job
export const createJob = createAsyncThunk(
  "jobs/createJob",
  async (jobData, { getState, rejectWithValue }) => {
    try {
      const res = await axios.post(API_URL, jobData, getAuthHeader(getState));
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
          err.response?.data?.errors?.[0]?.msg ||
          "Failed to create job"
      );
    }
  }
);

// Update job
export const updateJob = createAsyncThunk(
  "jobs/updateJob",
  async (jobData, { getState, rejectWithValue }) => {
    try {
      const res = await axios.put(
        `${API_URL}/${jobData._id}`,
        jobData,
        getAuthHeader(getState)
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update job"
      );
    }
  }
);

// Delete job
export const deleteJob = createAsyncThunk(
  "jobs/deleteJob",
  async (id, { getState, rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`, getAuthHeader(getState));
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete job"
      );
    }
  }
);

const jobSlice = createSlice({
  name: "jobs",
  initialState: {
    jobs: [],
    currentJob: null,
    loading: false,
    error: null,
    page: 1,
    totalPages: 1,
    totalJobs: 0,
    lastFetchParams: null,
    fetchingJob: false,
  },
  reducers: {
    clearCurrentJob: (state) => {
      state.currentJob = null;
    },
    clearJobError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        // Cache parameters of successful fetch
        state.lastFetchParams = action.meta.arg; 
        
        // Handler for pagination response
        if (Array.isArray(action.payload)) {
          state.jobs = action.payload;
          state.page = 1;
          state.totalPages = 1;
          state.totalJobs = action.payload.length;
        } else {
          state.jobs = action.payload.jobs || [];
          state.page = action.payload.page || 1;
          state.totalPages = action.payload.totalPages || 1;
          state.totalJobs = action.payload.totalJobs || 0;
        }
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch by ID
      .addCase(fetchJobById.pending, (state) => {
        state.fetchingJob = true;
        state.error = null;
        // Only set global loading for initial fetch (when no job is present)
        if (!state.currentJob) {
          state.loading = true;
        }
      })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.loading = false;
        state.fetchingJob = false;
        state.currentJob = action.payload;
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        state.loading = false;
        state.fetchingJob = false;
        state.error = action.payload;
      })
      // Create
      .addCase(createJob.fulfilled, (state, action) => {
        state.jobs.unshift(action.payload);
      })
      // Update
      .addCase(updateJob.fulfilled, (state, action) => {
        const idx = state.jobs.findIndex((j) => j._id === action.payload._id);
        if (idx !== -1) state.jobs[idx] = action.payload;
        state.currentJob = action.payload;
      })
      // Delete
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.jobs = state.jobs.filter((j) => j._id !== action.payload);
        state.currentJob = null;
      })
      // React to application submission to update UI state immediately across the app
      .addCase(applyForJob.fulfilled, (state, action) => {
        const jobId = action.meta.arg.jobId;
        
        // 1. Update the detailed view if we are currently looking at this job
        if (state.currentJob && (state.currentJob._id === jobId)) {
          state.currentJob.hasApplied = true;
          state.currentJob.applicantsCount = (state.currentJob.applicantsCount || 0) + 1;
        }

        // 2. Update the job in the main listings 
        const jobIdx = state.jobs.findIndex(j => j._id === jobId);
        if (jobIdx !== -1) {
          state.jobs[jobIdx].hasApplied = true;
          state.jobs[jobIdx].applicantsCount = (state.jobs[jobIdx].applicantsCount || 0) + 1;
        }
      })
      .addCase(withdrawApplication.fulfilled, (state, action) => {
        const jobId = action.payload.jobId;

        // 1. Update the detailed view if we are currently looking at this job
        if (state.currentJob && state.currentJob._id === jobId) {
          state.currentJob.hasApplied = false;
          state.currentJob.applicantsCount = Math.max(0, (state.currentJob.applicantsCount || 0) - 1);
        }

        // 2. Update the job in the main listings
        const jobIdx = state.jobs.findIndex((j) => j._id === jobId);
        if (jobIdx !== -1) {
          state.jobs[jobIdx].hasApplied = false;
          state.jobs[jobIdx].applicantsCount = Math.max(0, (state.jobs[jobIdx].applicantsCount || 0) - 1);
        }
      });
  },
});

export const { clearCurrentJob, clearJobError } = jobSlice.actions;
export default jobSlice.reducer;

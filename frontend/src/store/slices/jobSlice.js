import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { applyForJob, withdrawApplication } from "./applicationSlice";

const API_URL = `${import.meta.env.VITE_API_URL}/api/jobs`;

// Cache TTL: 5 minutes
const CACHE_TTL = 5 * 60 * 1000;

// Helper to get auth header
const getAuthHeader = (getState) => {
  const token = getState().auth.user?.token;
  return { headers: { Authorization: `Bearer ${token}` } };
};

// Fetch jobs with search, filter, pagination
export const fetchJobs = createAsyncThunk(
  "jobs/fetchJobs",
  async (params = {}, { getState, rejectWithValue, signal }) => {
    try {
      const res = await axios.get(API_URL, {
        params,
        ...getAuthHeader(getState),
        signal,
      });
      return res.data;
    } catch (err) {
      if (axios.isCancel(err)) return rejectWithValue("Request cancelled");
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch jobs"
      );
    }
  },
  {
    condition: (params, { getState }) => {
      const { jobs } = getState();
      const lastParams = jobs.lastFetchParams;
      const lastFetchedAt = jobs.lastFetchedAt;

      // Allow refetch if cache has expired
      if (lastFetchedAt && Date.now() - lastFetchedAt > CACHE_TTL) {
        return true;
      }

      // Skip fetching if we already fetched with the exact same parameters
      if (lastParams && JSON.stringify(lastParams) === JSON.stringify(params)) {
        return false;
      }
      return true;
    },
  }
);

// Fetch single job
export const fetchJobById = createAsyncThunk(
  "jobs/fetchJobById",
  async (id, { getState, rejectWithValue, signal }) => {
    try {
      const res = await axios.get(`${API_URL}/${id}`, {
        ...getAuthHeader(getState),
        signal,
      });
      return res.data;
    } catch (err) {
      if (axios.isCancel(err)) return rejectWithValue("Request cancelled");
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch job"
      );
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
    },
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
    listLoading: false,
    detailLoading: false,
    error: null,
    page: 1,
    totalPages: 1,
    totalJobs: 0,
    lastFetchParams: null,
    lastFetchedAt: null,
    fetchingJob: false,
  },
  reducers: {
    clearCurrentJob: (state) => {
      state.currentJob = null;
    },
    clearJobError: (state) => {
      state.error = null;
    },
    invalidateJobsCache: (state) => {
      state.lastFetchParams = null;
      state.lastFetchedAt = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchJobs.pending, (state) => {
        state.listLoading = true;
        // Only show full loading spinner if we have no cached data
        state.loading = state.jobs.length === 0;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.listLoading = false;
        // Cache parameters and timestamp of successful fetch
        state.lastFetchParams = action.meta.arg;
        state.lastFetchedAt = Date.now();

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
        state.listLoading = false;
        if (action.payload !== "Request cancelled") {
          state.error = action.payload;
        }
      })
      // Fetch by ID
      .addCase(fetchJobById.pending, (state) => {
        state.fetchingJob = true;
        state.detailLoading = true;
        state.error = null;
        // Only set global loading for initial fetch (when no job is present)
        if (!state.currentJob) {
          state.loading = true;
        }
      })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.loading = false;
        state.fetchingJob = false;
        state.detailLoading = false;
        state.currentJob = action.payload;
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        state.loading = false;
        state.fetchingJob = false;
        state.detailLoading = false;
        if (action.payload !== "Request cancelled") {
          state.error = action.payload;
        }
      })
      // Create — invalidate cache so next fetch gets fresh data
      .addCase(createJob.fulfilled, (state, action) => {
        state.jobs.unshift(action.payload);
        state.lastFetchParams = null;
        state.lastFetchedAt = null;
      })
      // Update
      .addCase(updateJob.fulfilled, (state, action) => {
        const idx = state.jobs.findIndex((j) => j._id === action.payload._id);
        if (idx !== -1) state.jobs[idx] = action.payload;
        state.currentJob = action.payload;
      })
      // Delete — invalidate cache
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.jobs = state.jobs.filter((j) => j._id !== action.payload);
        state.currentJob = null;
        state.lastFetchParams = null;
        state.lastFetchedAt = null;
      })
      // React to application submission
      .addCase(applyForJob.fulfilled, (state, action) => {
        const jobId = action.meta.arg.jobId;

        if (state.currentJob && state.currentJob._id === jobId) {
          state.currentJob.hasApplied = true;
          state.currentJob.applicantsCount =
            (state.currentJob.applicantsCount || 0) + 1;
        }

        const jobIdx = state.jobs.findIndex((j) => j._id === jobId);
        if (jobIdx !== -1) {
          state.jobs[jobIdx].hasApplied = true;
          state.jobs[jobIdx].applicantsCount =
            (state.jobs[jobIdx].applicantsCount || 0) + 1;
        }
      })
      .addCase(withdrawApplication.fulfilled, (state, action) => {
        const jobId = action.payload.jobId;

        if (state.currentJob && state.currentJob._id === jobId) {
          state.currentJob.hasApplied = false;
          state.currentJob.applicantsCount = Math.max(
            0,
            (state.currentJob.applicantsCount || 0) - 1
          );
        }

        const jobIdx = state.jobs.findIndex((j) => j._id === jobId);
        if (jobIdx !== -1) {
          state.jobs[jobIdx].hasApplied = false;
          state.jobs[jobIdx].applicantsCount = Math.max(
            0,
            (state.jobs[jobIdx].applicantsCount || 0) - 1
          );
        }
      });
  },
});

export const { clearCurrentJob, clearJobError, invalidateJobsCache } =
  jobSlice.actions;
export default jobSlice.reducer;

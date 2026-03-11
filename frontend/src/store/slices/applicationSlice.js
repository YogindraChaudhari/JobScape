import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/applications`;

const getAuthHeader = (getState) => {
  const token = getState().auth.user?.token;
  return { headers: { Authorization: `Bearer ${token}` } };
};

// Apply for a job (with resume file)
export const applyForJob = createAsyncThunk(
  "applications/apply",
  async ({ jobId, coverLetter, resumeFile }, { getState, rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("jobId", jobId);
      formData.append("coverLetter", coverLetter || "");
      formData.append("resume", resumeFile);

      const token = getState().auth.user?.token;
      const res = await axios.post(API_URL, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to apply"
      );
    }
  }
);

// Get my applications (job_seeker)
export const fetchMyApplications = createAsyncThunk(
  "applications/fetchMy",
  async (_, { getState, rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/my`, getAuthHeader(getState));
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch applications"
      );
    }
  }
);

// Get applications for a job (employer)
export const fetchJobApplications = createAsyncThunk(
  "applications/fetchForJob",
  async (jobId, { getState, rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${API_URL}/job/${jobId}`,
        getAuthHeader(getState)
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch applications"
      );
    }
  }
);

// Get application count for a job (employer)
export const fetchApplicationCount = createAsyncThunk(
  "applications/fetchCount",
  async (jobId, { getState, rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${API_URL}/count/${jobId}`,
        getAuthHeader(getState)
      );
      return { jobId, count: res.data.count };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch count"
      );
    }
  }
);

// Update application status (employer)
export const updateApplicationStatus = createAsyncThunk(
  "applications/updateStatus",
  async ({ id, status }, { getState, rejectWithValue }) => {
    try {
      const res = await axios.put(
        `${API_URL}/${id}/status`,
        { status },
        getAuthHeader(getState)
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update status"
      );
    }
  }
);

// Withdraw application (job seeker)
export const withdrawApplication = createAsyncThunk(
  "applications/withdraw",
  async (id, { getState, rejectWithValue }) => {
    try {
      await axios.delete(
        `${API_URL}/${id}`,
        getAuthHeader(getState)
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to withdraw application"
      );
    }
  }
);

// Generate Cover Letter using AI
export const generateAiCoverLetter = createAsyncThunk(
  "applications/generateAiCoverLetter",
  async (jobData, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.user?.token;
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/ai/generate-cover-letter`,
        jobData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return res.data.coverLetter;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to generate cover letter. Ensure Groq API key is set in the backend."
      );
    }
  }
);

const applicationSlice = createSlice({
  name: "applications",
  initialState: {
    applications: [],
    applicationCounts: {}, // { jobId: count }
    loading: false,
    generatingCoverLetter: false,
    error: null,
    applySuccess: false,
  },
  reducers: {
    clearApplySuccess: (state) => {
      state.applySuccess = false;
    },
    clearAppError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Apply
      .addCase(applyForJob.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.applySuccess = false;
      })
      .addCase(applyForJob.fulfilled, (state, action) => {
        state.loading = false;
        state.applySuccess = true;
        // The backend will returns { application, updatedResumeUrl }
        state.applications.unshift(action.payload.application || action.payload);
      })
      .addCase(applyForJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch my
      .addCase(fetchMyApplications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload;
      })
      .addCase(fetchMyApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch for job
      .addCase(fetchJobApplications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchJobApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload;
      })
      .addCase(fetchJobApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch count
      .addCase(fetchApplicationCount.fulfilled, (state, action) => {
        state.applicationCounts[action.payload.jobId] = action.payload.count;
      })
      // Update status
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        const idx = state.applications.findIndex(
          (a) => a._id === action.payload._id
        );
        if (idx !== -1) state.applications[idx] = action.payload;
      })
      // Withdraw application
      .addCase(withdrawApplication.fulfilled, (state, action) => {
        state.applications = state.applications.filter(
          (app) => app._id !== action.payload.id
        );
      })
      // Generate AI Cover Letter
      .addCase(generateAiCoverLetter.pending, (state) => {
        state.generatingCoverLetter = true;
      })
      .addCase(generateAiCoverLetter.fulfilled, (state) => {
        state.generatingCoverLetter = false;
      })
      .addCase(generateAiCoverLetter.rejected, (state, action) => {
        state.generatingCoverLetter = false;
        state.error = action.payload;
      });
  },
});

export const { clearApplySuccess, clearAppError } = applicationSlice.actions;
export default applicationSlice.reducer;

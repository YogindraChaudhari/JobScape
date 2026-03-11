import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/auth`;

// Helper to get token header
const getAuthHeader = (getState) => {
  const token = getState().auth.user?.token;
  return { headers: { Authorization: `Bearer ${token}` } };
};

// Register
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/register`, userData);
      localStorage.setItem("user", JSON.stringify(res.data));
      return res.data;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg ||
        "Registration failed";
      return rejectWithValue(message);
    }
  }
);

// Login
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/login`, credentials);
      localStorage.setItem("user", JSON.stringify(res.data));
      return res.data;
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";
      return rejectWithValue(message);
    }
  }
);

// Get current user
export const getMe = createAsyncThunk(
  "auth/getMe",
  async (_, { getState, rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/me`, getAuthHeader(getState));
      return res.data;
    } catch (err) {
      return rejectWithValue("Session expired");
    }
  }
);

// Update profile
export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (profileData, { getState, rejectWithValue }) => {
    try {
      const res = await axios.put(
        `${API_URL}/profile`,
        profileData,
        getAuthHeader(getState)
      );
      return res.data;
    } catch (err) {
      const message = err.response?.data?.message || "Profile update failed";
      return rejectWithValue(message);
    }
  }
);

// Upload resume
export const uploadResume = createAsyncThunk(
  "auth/uploadResume",
  async (file, { getState, rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("resume", file);

      const token = getState().auth.user?.token;
      const res = await axios.post(`${API_URL}/upload-resume`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    } catch (err) {
      const message = err.response?.data?.message || "Resume upload failed";
      return rejectWithValue(message);
    }
  }
);

// Load user from localStorage
const userFromStorage = JSON.parse(localStorage.getItem("user"));

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: userFromStorage || null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.error = null;
      localStorage.removeItem("user");
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // GetMe
      .addCase(getMe.fulfilled, (state, action) => {
        state.user = { ...state.user, ...action.payload };
      })
      // Update profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { ...state.user, ...action.payload };
        // Update localStorage
        const stored = JSON.parse(localStorage.getItem("user"));
        if (stored) {
          localStorage.setItem(
            "user",
            JSON.stringify({ ...stored, ...action.payload })
          );
        }
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Upload resume
      .addCase(uploadResume.fulfilled, (state, action) => {
        if (state.user) {
          state.user.resumeUrl = action.payload.resumeUrl;
          const stored = JSON.parse(localStorage.getItem("user"));
          if (stored) {
            stored.resumeUrl = action.payload.resumeUrl;
            localStorage.setItem("user", JSON.stringify(stored));
          }
        }
      })
      .addCase(uploadResume.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Auto-update resume from job application if updated
      .addCase("applications/apply/fulfilled", (state, action) => {
        if (action.payload?.updatedResumeUrl && state.user) {
          state.user.resumeUrl = action.payload.updatedResumeUrl;
          const stored = JSON.parse(localStorage.getItem("user"));
          if (stored) {
            stored.resumeUrl = action.payload.updatedResumeUrl;
            localStorage.setItem("user", JSON.stringify(stored));
          }
        }
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;

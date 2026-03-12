import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    // Dashboard
    dashboardActiveView: null, // null = main, jobId = viewing applicants for that job
    expandedApplicantId: null,
    previewApplicantId: null,

    // Job Page
    showApplyForm: false,

    // Search / Filters persistence
    searchFilters: {
      search: "",
      type: "",
      location: "",
    },
  },
  reducers: {
    setDashboardView: (state, action) => {
      state.dashboardActiveView = action.payload;
      // Reset expanded/preview when switching views
      state.expandedApplicantId = null;
      state.previewApplicantId = null;
    },
    setExpandedApplicant: (state, action) => {
      state.expandedApplicantId =
        state.expandedApplicantId === action.payload ? null : action.payload;
    },
    setPreviewApplicant: (state, action) => {
      state.previewApplicantId =
        state.previewApplicantId === action.payload ? null : action.payload;
    },
    setShowApplyForm: (state, action) => {
      state.showApplyForm = action.payload;
    },
    setSearchFilters: (state, action) => {
      state.searchFilters = { ...state.searchFilters, ...action.payload };
    },
    clearSearchFilters: (state) => {
      state.searchFilters = { search: "", type: "", location: "" };
    },
  },
});

export const {
  setDashboardView,
  setExpandedApplicant,
  setPreviewApplicant,
  setShowApplyForm,
  setSearchFilters,
  clearSearchFilters,
} = uiSlice.actions;

export default uiSlice.reducer;

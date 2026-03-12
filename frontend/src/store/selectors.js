import { createSelector } from "@reduxjs/toolkit";

// =============== AUTH SELECTORS ===============
export const selectUser = (state) => state.auth.user;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectIsEmployer = createSelector(
  selectUser,
  (user) => user?.role === "employer"
);
export const selectIsJobSeeker = createSelector(
  selectUser,
  (user) => user?.role === "job_seeker"
);

// =============== JOB SELECTORS ===============
const selectJobsState = (state) => state.jobs;
export const selectAllJobs = createSelector(
  selectJobsState,
  (jobs) => jobs.jobs
);
export const selectJobsLoading = (state) => state.jobs.loading;
export const selectCurrentJob = (state) => state.jobs.currentJob;
export const selectJobsPagination = createSelector(
  selectJobsState,
  (jobs) => ({
    page: jobs.page,
    totalPages: jobs.totalPages,
    totalJobs: jobs.totalJobs,
  })
);

// Employer: filter only jobs posted by current user
export const selectMyJobs = createSelector(
  [selectAllJobs, selectUser],
  (jobs, user) => {
    if (!user || user.role !== "employer") return [];
    return jobs.filter((j) => j.postedBy === user._id);
  }
);

// Derived employer stats
export const selectEmployerStats = createSelector(selectMyJobs, (myJobs) => ({
  jobsPosted: myJobs.length,
  totalApplicants: myJobs.reduce(
    (acc, job) => acc + (job.applicantsCount || 0),
    0
  ),
}));

// =============== APPLICATION SELECTORS ===============
const selectAppState = (state) => state.applications;
export const selectApplications = createSelector(
  selectAppState,
  (apps) => apps.applications
);
export const selectAppsLoading = (state) => state.applications.loading;
export const selectApplySuccess = (state) => state.applications.applySuccess;
export const selectGeneratingCoverLetter = (state) =>
  state.applications.generatingCoverLetter;
export const selectApplyError = (state) => state.applications.error;

// Job Seeker: application status counts
export const selectSeekerStats = createSelector(
  selectApplications,
  (applications) => ({
    total: applications.length,
    accepted: applications.filter((a) => a.status === "accepted").length,
    inReview: applications.filter(
      (a) => a.status === "reviewed" || a.status === "pending"
    ).length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  })
);

// =============== UI SELECTORS ===============
export const selectDashboardView = (state) => state.ui.dashboardActiveView;
export const selectExpandedApplicant = (state) => state.ui.expandedApplicantId;
export const selectPreviewApplicant = (state) => state.ui.previewApplicantId;
export const selectShowApplyForm = (state) => state.ui.showApplyForm;
export const selectSearchFilters = (state) => state.ui.searchFilters;

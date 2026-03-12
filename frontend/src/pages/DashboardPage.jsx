import { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchJobs, deleteJob, invalidateJobsCache } from "../store/slices/jobSlice";
import {
  fetchMyApplications,
  fetchJobApplications,
  updateApplicationStatus,
  withdrawApplication,
} from "../store/slices/applicationSlice";
import { setDashboardView } from "../store/slices/uiSlice";
import {
  selectUser,
  selectIsEmployer,
  selectJobsLoading,
  selectAppsLoading,
  selectMyJobs,
  selectEmployerStats,
  selectSeekerStats,
  selectApplications,
  selectDashboardView,
} from "../store/selectors";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Spinner from "../components/Spinner";
import { useConfirmDialog } from "../components/ConfirmDialog";

// Dashboard sub-components
import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardStats from "../components/dashboard/DashboardStats";
import EmployerJobList from "../components/dashboard/EmployerJobList";
import ApplicantQueue from "../components/dashboard/ApplicantQueue";
import SeekerApplicationList from "../components/dashboard/SeekerApplicationList";

const DashboardPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showConfirm, DialogComponent } = useConfirmDialog();

  // Selectors (memoized)
  const user = useSelector(selectUser);
  const isEmployer = useSelector(selectIsEmployer);
  const jobsLoading = useSelector(selectJobsLoading);
  const appsLoading = useSelector(selectAppsLoading);
  const myJobs = useSelector(selectMyJobs);
  const employerStats = useSelector(selectEmployerStats);
  const seekerStats = useSelector(selectSeekerStats);
  const applications = useSelector(selectApplications);
  const viewingApplicantsFor = useSelector(selectDashboardView);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role === "employer") {
      dispatch(fetchJobs({ _limit: 100 }));
    } else {
      dispatch(fetchMyApplications());
    }
  }, [user, dispatch, navigate]);

  const handleDeleteJob = useCallback(
    (id) => {
      showConfirm({
        title: "Delete Job",
        message:
          "Are you sure you want to delete this job? All applications will also be removed.",
        confirmText: "Delete",
        variant: "danger",
        onConfirm: async () => {
          try {
            await dispatch(deleteJob(id)).unwrap();
            toast.success("Job deleted successfully");
            dispatch(invalidateJobsCache());
            dispatch(fetchJobs({ _limit: 100 }));
          } catch (err) {
            toast.error(err);
          }
        },
      });
    },
    [dispatch, showConfirm]
  );

  const handleViewApplicants = useCallback(
    (jobId) => {
      dispatch(setDashboardView(jobId));
      dispatch(fetchJobApplications(jobId));
    },
    [dispatch]
  );

  const handleBackToJobs = useCallback(() => {
    dispatch(setDashboardView(null));
  }, [dispatch]);

  const handleStatusChange = useCallback(
    (appId, status, applicantName) => {
      showConfirm({
        title: "Change Status",
        message: `Change ${applicantName}'s application status to "${status}"?`,
        confirmText: "Update",
        variant: "primary",
        onConfirm: async () => {
          try {
            await dispatch(
              updateApplicationStatus({ id: appId, status })
            ).unwrap();
            toast.success(`Application ${status}`);
          } catch (err) {
            toast.error(err);
          }
        },
      });
    },
    [dispatch, showConfirm]
  );

  const handleWithdrawApplication = useCallback(
    (appId, jobTitle) => {
      showConfirm({
        title: "Withdraw Application",
        message: `Are you sure you want to withdraw your application for "${jobTitle}"? This action cannot be undone.`,
        confirmText: "Withdraw",
        variant: "danger",
        onConfirm: async () => {
          try {
            await dispatch(withdrawApplication(appId)).unwrap();
            toast.success("Application withdrawn successfully");
          } catch (err) {
            toast.error(err);
          }
        },
      });
    },
    [dispatch, showConfirm]
  );

  const handleDownload = useCallback(async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      const fileName = url.split("/").pop()?.split("?")[0] || "resume.pdf";
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      toast.error("Failed to download. Opening in new tab instead.");
      window.open(url, "_blank");
    }
  }, []);

  if (!user) return null;

  const loading = jobsLoading || appsLoading;

  return (
    <div className="bg-slate-50/50 min-h-screen pt-8 md:pt-28 pb-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <DashboardHeader
          userName={user.name}
          isEmployer={isEmployer}
          showPostButton={!viewingApplicantsFor}
        />

        {/* Stats Grid */}
        {!viewingApplicantsFor && (
          <DashboardStats
            isEmployer={isEmployer}
            employerStats={employerStats}
            seekerStats={seekerStats}
          />
        )}

        {loading && !viewingApplicantsFor ? (
          <Spinner loading={loading} />
        ) : isEmployer ? (
          <div className="animate-fadeIn">
            {viewingApplicantsFor ? (
              <ApplicantQueue
                onBack={handleBackToJobs}
                onStatusChange={handleStatusChange}
                onDownload={handleDownload}
              />
            ) : (
              <EmployerJobList
                myJobs={myJobs}
                onViewApplicants={handleViewApplicants}
                onDelete={handleDeleteJob}
              />
            )}
          </div>
        ) : (
          <SeekerApplicationList
            applications={applications}
            onWithdraw={handleWithdrawApplication}
          />
        )}
      </div>
      {DialogComponent}
    </div>
  );
};

export default DashboardPage;

import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobById, deleteJob } from "../store/slices/jobSlice";
import {
  applyForJob,
  clearApplySuccess,
  generateAiCoverLetter,
} from "../store/slices/applicationSlice";
import {
  selectCurrentJob,
  selectJobsLoading,
  selectUser,
  selectIsJobSeeker,
  selectApplySuccess,
  selectApplyError,
  selectGeneratingCoverLetter,
} from "../store/selectors";
import toast from "react-hot-toast";
import Spinner from "../components/Spinner";
import { useConfirmDialog } from "../components/ConfirmDialog";
import { RiArrowLeftLine } from "react-icons/ri";

// Job sub-components
import JobHeader from "../components/job/JobHeader";
import JobStats from "../components/job/JobStats";
import JobContent from "../components/job/JobContent";
import JobApplicationSection from "../components/job/JobApplicationSection";
import JobSidebar from "../components/job/JobSidebar";

const JobPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showConfirm, DialogComponent } = useConfirmDialog();

  // Memoized selectors
  const job = useSelector(selectCurrentJob);
  const loading = useSelector(selectJobsLoading);
  const user = useSelector(selectUser);
  const isJobSeeker = useSelector(selectIsJobSeeker);
  const applySuccess = useSelector(selectApplySuccess);
  const applyError = useSelector(selectApplyError);
  const generatingCoverLetter = useSelector(selectGeneratingCoverLetter);
  const applyLoading = useSelector((state) => state.applications.loading);

  const [showApplyForm, setShowApplyForm] = useState(false);

  useEffect(() => {
    dispatch(fetchJobById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (applySuccess) {
      toast.success("Application submitted successfully!");
      setShowApplyForm(false);
      dispatch(clearApplySuccess());
    }
  }, [applySuccess, dispatch]);

  useEffect(() => {
    if (applyError) {
      toast.error(applyError);
    }
  }, [applyError]);

  const onDeleteClick = useCallback(
    (jobId) => {
      showConfirm({
        title: "Delete Job",
        message:
          "Are you sure you want to delete this job listing? This action cannot be undone.",
        confirmText: "Delete",
        variant: "danger",
        onConfirm: async () => {
          try {
            await dispatch(deleteJob(jobId)).unwrap();
            toast.success("Job deleted successfully");
            navigate("/jobs");
          } catch (err) {
            toast.error(err || "Failed to delete job");
          }
        },
      });
    },
    [dispatch, navigate, showConfirm]
  );

  const handleGenerateCoverLetter = useCallback(async () => {
    try {
      const coverLetterResult = await dispatch(
        generateAiCoverLetter({
          jobTitle: job.title,
          companyName: job.company.name,
          jobDescription: job.description,
          userName: user?.name,
        })
      ).unwrap();
      toast.success("AI cover letter generated successfully!");
      return coverLetterResult;
    } catch (err) {
      toast.error(err || "Failed to generate cover letter.");
      return null;
    }
  }, [dispatch, job, user]);

  const handleApply = useCallback(
    ({ coverLetter, resumeFile }) => {
      if (!resumeFile && !user?.resumeUrl) {
        toast.error("Please upload your resume before applying");
        return;
      }

      showConfirm({
        title: "Submit Application",
        message:
          "Are you sure you want to submit your application for this job?",
        confirmText: "Submit",
        variant: "primary",
        onConfirm: () => {
          dispatch(applyForJob({ jobId: id, coverLetter, resumeFile }));
        },
      });
    },
    [dispatch, id, user, showConfirm]
  );

  // Show spinner only if we don't have any job data at all
  if (loading && !job) {
    return (
      <div className="py-12">
        <Spinner loading={loading} />
      </div>
    );
  }

  if (!job) {
    return (
      <section className="text-center flex flex-col justify-center items-center h-96">
        <h1 className="text-4xl font-bold mb-4 text-gray-700">
          Job Not Found
        </h1>
        <p className="text-gray-500 mb-4">
          This job may have been removed or doesn't exist.
        </p>
        <Link
          to="/jobs"
          className="text-white bg-gradient-to-r from-blue-500 to-green-500 rounded-md px-4 py-2"
        >
          Browse Jobs
        </Link>
      </section>
    );
  }

  const isOwner =
    user &&
    user.role === "employer" &&
    (job.postedBy?._id === user._id || job.postedBy === user._id);

  const isExpired =
    job.lastDateToApply && new Date(job.lastDateToApply) < new Date();
  const isNew =
    !isExpired &&
    new Date().getTime() - new Date(job.createdAt).getTime() <
      3 * 24 * 60 * 60 * 1000;

  return (
    <div className="bg-slate-50/50 min-h-screen pb-20 pt-24">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <Link
            to="/jobs"
            className="group inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold text-sm transition-colors"
          >
            <RiArrowLeftLine className="group-hover:-translate-x-1 transition-transform" />
            Back to All Jobs
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-8">
            {/* Main Job Card */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden animate-fadeIn">
              <JobHeader job={job} isExpired={isExpired} isNew={isNew} />
              <JobStats job={job} />
              <JobContent job={job} />
            </div>

            {/* Application Section */}
            <JobApplicationSection
              job={job}
              user={user}
              isJobSeeker={isJobSeeker}
              isExpired={isExpired}
              showApplyForm={showApplyForm}
              onToggleForm={setShowApplyForm}
              onApply={handleApply}
              applyLoading={applyLoading}
              generatingCoverLetter={generatingCoverLetter}
              onGenerateCoverLetter={handleGenerateCoverLetter}
            />
          </div>

          {/* Sidebar */}
          <JobSidebar
            job={job}
            isOwner={isOwner}
            onDelete={() => onDeleteClick(job._id)}
          />
        </div>
      </div>
      {DialogComponent}
    </div>
  );
};

export default JobPage;

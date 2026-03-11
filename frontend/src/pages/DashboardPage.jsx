import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchJobs, deleteJob } from "../store/slices/jobSlice";
import {
  fetchMyApplications,
  fetchJobApplications,
  updateApplicationStatus,
  withdrawApplication,
} from "../store/slices/applicationSlice";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Spinner from "../components/Spinner";
import { useConfirmDialog } from "../components/ConfirmDialog";
import { 
  RiEyeLine, RiEyeOffLine, RiFileTextLine, RiDownloadLine, 
  RiAddLine, RiDeleteBinLine, RiEditLine, RiTeamLine, 
  RiFolderLine, RiUserLine, RiTimeLine, RiBriefcaseLine,
  RiCheckDoubleLine, RiCloseCircleLine, RiInformationLine,
  RiArrowLeftLine, RiMailLine, RiPhoneLine, RiSearchLine,
  RiCheckLine, RiCloseLine, RiHistoryLine, RiSearch2Line,
  RiCheckboxCircleLine
} from "react-icons/ri";

const VITE_API_URL = import.meta.env.VITE_API_URL;

const DashboardPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showConfirm, DialogComponent } = useConfirmDialog();
  const { user } = useSelector((state) => state.auth);
  const { jobs, loading: jobsLoading } = useSelector((state) => state.jobs);
  const {
    applications,
    applicationCounts,
    loading: appsLoading,
  } = useSelector((state) => state.applications);

  const [viewingApplicantsFor, setViewingApplicantsFor] = useState(null);
  const [previewAppId, setPreviewAppId] = useState(null);
  const [expandedAppId, setExpandedAppId] = useState(null);

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

  // Fetch applicant counts for employer's jobs
  const myJobs =
    user?.role === "employer"
      ? jobs.filter((j) => j.postedBy === user._id)
      : [];

  const handleDeleteJob = (id) => {
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
          dispatch(fetchJobs({ _limit: 100 }));
        } catch (err) {
          toast.error(err);
        }
      },
    });
  };

  const handleViewApplicants = (jobId) => {
    setViewingApplicantsFor(jobId);
    dispatch(fetchJobApplications(jobId));
  };

  const handleStatusChange = (appId, status, applicantName) => {
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
  };

  const handleWithdrawApplication = (appId, jobTitle) => {
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
  };

  const handleDownload = async (url) => {
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
  };

  if (!user) return null;

  const isEmployer = user.role === "employer";
  const loading = jobsLoading || appsLoading;

  return (
    <div className="bg-slate-50/50 min-h-screen pt-8 md:pt-28 pb-20 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold mb-3 border border-blue-100 uppercase tracking-wider">
              <RiInformationLine /> Overview
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
              Dashboard
            </h1>
            <p className="text-slate-500 font-medium text-sm sm:text-base">
              Welcome back, <span className="text-slate-900">{user.name}</span>
              <span className="hidden sm:inline mx-2 text-slate-300">|</span>
              <br className="sm:hidden" />
              <span className="text-blue-600 font-semibold">{isEmployer ? "Employer" : "Job Seeker"}</span>
            </p>
          </div>

          {isEmployer && !viewingApplicantsFor && (
            <Link
              to="/add-job"
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-2xl shadow-lg shadow-blue-200 transition-all hover:-translate-y-0.5"
            >
              <RiAddLine className="text-xl" /> Post New Job
            </Link>
          )}
        </div>

        {/* Stats Grid */}
        {!viewingApplicantsFor && (
          <div className="flex sm:grid flex-nowrap sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8 overflow-x-auto sm:overflow-x-visible pb-4 sm:pb-0 hide-scrollbar snap-x">
            {isEmployer ? (
              <>
                {/* Jobs Posted */}
                <div className="flex-shrink-0 w-[160px] sm:w-auto bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm snap-start">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl sm:text-2xl mb-3 sm:mb-4">
                    <RiBriefcaseLine />
                  </div>
                  <p className="text-slate-500 text-[10px] sm:text-sm font-bold uppercase tracking-wider">Jobs Posted</p>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900">{myJobs.length}</h3>
                </div>
                
                {/* Total Applicants */}
                <div className="flex-shrink-0 w-[160px] sm:w-auto bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm snap-start">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl sm:text-2xl mb-3 sm:mb-4">
                    <RiTeamLine />
                  </div>
                  <p className="text-slate-500 text-[10px] sm:text-sm font-bold uppercase tracking-wider">Applicants</p>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                    {myJobs.reduce((acc, job) => acc + (job.applicantsCount || 0), 0)}
                  </h3>
                </div>

                {/* Accepted */}
                <div className="flex-shrink-0 w-[160px] sm:w-auto bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm snap-start">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center text-xl sm:text-2xl mb-3 sm:mb-4">
                    <RiCheckDoubleLine />
                  </div>
                  <p className="text-slate-500 text-[10px] sm:text-sm font-bold uppercase tracking-wider">Accepted</p>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900">—</h3>
                </div>

                {/* Pending Review */}
                <div className="flex-shrink-0 w-[160px] sm:w-auto bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm snap-start">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center text-xl sm:text-2xl mb-3 sm:mb-4">
                    <RiTimeLine />
                  </div>
                  <p className="text-slate-500 text-[10px] sm:text-sm font-bold uppercase tracking-wider">In Review</p>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900">—</h3>
                </div>
              </>
            ) : (
              <>
                {/* Applications */}
                <div className="flex-shrink-0 w-[160px] sm:w-auto bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm snap-start">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl sm:text-2xl mb-3 sm:mb-4">
                    <RiFolderLine />
                  </div>
                  <p className="text-slate-500 text-[10px] sm:text-sm font-bold uppercase tracking-wider">Applied</p>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900">{applications.length}</h3>
                </div>

                {/* Accepted */}
                <div className="flex-shrink-0 w-[160px] sm:w-auto bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm snap-start">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl sm:text-2xl mb-3 sm:mb-4">
                    <RiCheckDoubleLine />
                  </div>
                  <p className="text-slate-500 text-[10px] sm:text-sm font-bold uppercase tracking-wider">Accepted</p>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                    {applications.filter(a => a.status === "accepted").length}
                  </h3>
                </div>

                {/* In Review */}
                <div className="flex-shrink-0 w-[160px] sm:w-auto bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm snap-start">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl sm:text-2xl mb-3 sm:mb-4">
                    <RiTimeLine />
                  </div>
                  <p className="text-slate-500 text-[10px] sm:text-sm font-bold uppercase tracking-wider">In Review</p>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                    {applications.filter(a => a.status === "reviewed" || a.status === "pending").length}
                  </h3>
                </div>

                {/* Rejected */}
                <div className="flex-shrink-0 w-[160px] sm:w-auto bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm snap-start">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center text-xl sm:text-2xl mb-3 sm:mb-4">
                    <RiCloseCircleLine />
                  </div>
                  <p className="text-slate-500 text-[10px] sm:text-sm font-bold uppercase tracking-wider">Rejected</p>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                    {applications.filter(a => a.status === "rejected").length}
                  </h3>
                </div>
              </>
            )}
          </div>
        )}

        {loading && !viewingApplicantsFor ? (
          <Spinner loading={loading} />
        ) : isEmployer ? (
          /* ========== EMPLOYER DASHBOARD ========== */
          <div className="animate-fadeIn">
            {viewingApplicantsFor ? (
              <div className="bg-white rounded-3xl md:rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 md:p-8 border-b border-slate-50 bg-slate-50/50">
                  <button
                    onClick={() => setViewingApplicantsFor(null)}
                    className="group flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold text-sm mb-4 transition-colors"
                  >
                    <RiArrowLeftLine className="group-hover:-translate-x-1 transition-transform" />
                    Back to Jobs
                  </button>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-black text-slate-900">
                        Applicants Queue
                      </h2>
                      <p className="text-slate-500 text-sm mt-1">
                        Showing all candidates for this position
                      </p>
                    </div>
                    <div className="px-4 py-2 bg-blue-100 text-blue-700 rounded-xl text-sm font-bold flex items-center gap-2">
                      <RiTeamLine /> {applications.length} Applied
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  {appsLoading ? (
                    <Spinner loading={true} />
                  ) : applications.length === 0 ? (
                    <div className="py-12 text-center">
                      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300 text-3xl">
                        <RiUserLine />
                      </div>
                      <p className="text-slate-400 font-semibold">
                        No one has applied yet.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {applications.map((app) => (
                        <div
                          key={app._id}
                          className="group border border-slate-100 rounded-3xl p-6 hover:border-blue-100 hover:bg-blue-50/20 transition-all duration-300"
                        >
                          <div className="flex flex-col md:flex-row justify-between gap-6 mb-6">
                            <div className="flex items-start gap-4">
                              <div>
                                <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                  {app.applicant?.name || "Unknown"}
                                </h3>
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                                  <span className="text-slate-500 text-sm flex items-center gap-1">
                                    <RiMailLine /> {app.applicant?.email}
                                  </span>
                                  {app.applicant?.phone && (
                                    <span className="text-slate-500 text-sm flex items-center gap-1">
                                      <RiPhoneLine /> {app.applicant.phone}
                                    </span>
                                  )}
                                  <span className="text-slate-400 text-xs flex items-center gap-1 font-medium">
                                    <RiTimeLine /> {new Date(app.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                                                     <div className="flex-shrink-0 flex items-center gap-2 w-full md:w-auto">
                              <div className="relative flex-1 md:flex-initial">
                                <select
                                  value={app.status}
                                  onChange={(e) =>
                                    handleStatusChange(
                                      app._id,
                                      e.target.value,
                                      app.applicant?.name
                                    )
                                  }
                                  className={`w-full px-4 py-2.5 rounded-xl text-sm font-bold border-2 cursor-pointer transition-all outline-none appearance-none pr-10 ${
                                    app.status === "accepted"
                                      ? "bg-emerald-50 text-emerald-700 border-emerald-100 focus:border-emerald-500"
                                      : app.status === "rejected"
                                      ? "bg-rose-50 text-rose-700 border-rose-100 focus:border-rose-500"
                                      : app.status === "reviewed"
                                      ? "bg-blue-50 text-blue-700 border-blue-100 focus:border-blue-500"
                                      : "bg-amber-50 text-amber-700 border-amber-100 focus:border-amber-500"
                                  }`}
                                >
                                  <option value="pending">Pending</option>
                                  <option value="reviewed">Reviewed</option>
                                  <option value="accepted">Accepted</option>
                                  <option value="rejected">Rejected</option>
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                  {app.status === "accepted" && <RiCheckLine className="text-emerald-600" />}
                                  {app.status === "rejected" && <RiCloseLine className="text-rose-600" />}
                                  {app.status === "reviewed" && <RiSearch2Line className="text-blue-600" />}
                                  {app.status === "pending" && <RiHistoryLine className="text-amber-600" />}
                                </div>
                              </div>
                              
                              <button
                                onClick={() => setExpandedAppId(expandedAppId === app._id ? null : app._id)}
                                className={`flex-1 md:flex-initial px-4 py-2.5 rounded-xl text-sm font-bold border-2 transition-all whitespace-nowrap ${
                                  expandedAppId === app._id 
                                    ? "bg-slate-900 border-slate-900 text-white" 
                                    : "bg-white border-slate-100 text-slate-600 hover:border-slate-300"
                                }`}
                              >
                                {expandedAppId === app._id ? "Hide" : "Details"}
                              </button>
                            </div>
                          </div>

                          {expandedAppId === app._id && (
                            <div className="animate-fadeIn">
                              {/* Cover Letter */}
                              {app.coverLetter && (
                                <div className="bg-slate-50 rounded-2xl p-4 mb-6 border border-slate-100 mt-6">
                                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <RiFileTextLine /> Message from candidate
                                  </h4>
                                  <p className="text-slate-700 text-sm leading-relaxed italic">
                                    "{app.coverLetter}"
                                  </p>
                                </div>
                              )}

                              {/* Resume Actions */}
                              {app.resumeUrl && (
                                <div className={`flex items-center gap-3 flex-wrap pt-4 border-t border-slate-50 ${!app.coverLetter ? 'mt-6' : ''}`}>
                                  {app.resumeUrl.toLowerCase().includes(".pdf") && (
                                    <button
                                      onClick={() => setPreviewAppId(previewAppId === app._id ? null : app._id)}
                                      className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 text-sm font-bold transition-all ${
                                        previewAppId === app._id 
                                          ? "bg-slate-900 border-slate-900 text-white" 
                                          : "bg-white border-slate-100 text-slate-600 hover:border-slate-300"
                                      }`}
                                    >
                                      {previewAppId === app._id ? <><RiEyeOffLine /> Hide Preview</> : <><RiEyeLine /> Preview</>}
                                    </button>
                                  )}
                                  <a
                                    href={app.resumeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold shadow-sm shadow-blue-100 hover:bg-blue-700 transition-all"
                                  >
                                    <RiFileTextLine /> View Resume
                                  </a>
                                  <button
                                    onClick={() => handleDownload(app.resumeUrl)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-bold shadow-sm shadow-emerald-100 hover:bg-emerald-700 transition-all ml-auto"
                                  >
                                    <RiDownloadLine /> Download
                                  </button>
                                </div>
                              )}

                              {app.resumeUrl?.toLowerCase().includes(".pdf") && previewAppId === app._id && (
                                <div className="mt-6 p-2 bg-slate-900 rounded-3xl animate-fadeIn">
                                  <iframe
                                    src={`https://docs.google.com/gview?url=${encodeURIComponent(app.resumeUrl)}&embedded=true`}
                                    className="w-full h-[600px] rounded-2xl border-none"
                                    title={`Resume - ${app.applicant?.name}`}
                                  />
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Employer's Posted Jobs */
              <div className="bg-white rounded-3xl md:rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 md:p-8 border-b border-slate-50 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">
                      Your Job Postings
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">
                      Manage and track your active role listings
                    </p>
                  </div>
                  <div className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-xl text-sm font-bold flex items-center gap-2">
                    <RiBriefcaseLine /> {myJobs.length} Active
                  </div>
                </div>

                <div className="p-8">
                  {myJobs.length === 0 ? (
                    <div className="py-20 text-center">
                      <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-200 text-4xl">
                        <RiBriefcaseLine />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">No jobs posted yet</h3>
                      <p className="text-slate-400 mb-8 max-w-xs mx-auto">
                        Ready to find your next team member? Start by creating a job listing.
                      </p>
                      <Link
                        to="/add-job"
                        className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold py-3 px-8 rounded-2xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all hover:-translate-y-0.5"
                      >
                        <RiAddLine /> Post Your First Job
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {myJobs.map((job) => (
                        <div
                          key={job._id}
                          className="group border border-slate-100 rounded-3xl p-6 hover:border-blue-100 hover:bg-blue-50/20 transition-all duration-300"
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-center gap-5">
                              <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-blue-600 text-2xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                <RiBriefcaseLine />
                              </div>
                              <div>
                                <h3 className="text-base md:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                  {job.title}
                                </h3>
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-slate-500 text-xs md:text-sm">
                                  <span className="flex items-center gap-1 font-medium italic">
                                    {job.type}
                                  </span>
                                  <span className="text-slate-300">•</span>
                                  <span>{job.location}</span>
                                  <span className="text-slate-300">•</span>
                                  <span className="text-emerald-600 font-bold">
                                    {(() => {
                                      const n = Number(job.salary);
                                      return isFinite(n) ? `₹${n.toLocaleString("en-IN")}` : (job.salary || "Not Disclosed");
                                    })()}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                              <button
                                onClick={() => handleViewApplicants(job._id)}
                                className="flex-1 md:flex-initial flex items-center justify-center gap-2 bg-slate-900 text-white font-bold px-4 py-2.5 rounded-xl text-sm hover:bg-slate-800 transition-all group-hover:shadow-lg shadow-slate-100"
                              >
                                <RiTeamLine /> {job.applicantsCount || 0} Candidates
                              </button>
                              
                              <div className="flex items-center justify-center md:justify-start gap-2 bg-slate-50 p-1.5 rounded-xl w-full md:w-auto">
                                <Link
                                  to={`/jobs/${job._id}`}
                                  className="flex-1 md:flex-initial flex items-center justify-center p-2.5 text-slate-500 hover:text-blue-600 hover:bg-white rounded-xl transition-all"
                                  title="Preview Public View"
                                >
                                  <RiEyeLine size={20} />
                                </Link>
                                <Link
                                  to={`/edit-job/${job._id}`}
                                  state={{ job }}
                                  className="flex-1 md:flex-initial flex items-center justify-center p-2.5 text-slate-500 hover:text-emerald-600 hover:bg-white rounded-xl transition-all"
                                  title="Edit Listing"
                                >
                                  <RiEditLine size={20} />
                                </Link>
                                <button
                                  onClick={() => handleDeleteJob(job._id)}
                                  className="flex-1 md:flex-initial flex items-center justify-center p-2.5 text-slate-500 hover:text-rose-600 hover:bg-white rounded-xl transition-all"
                                  title="Delete Listing"
                                >
                                  <RiDeleteBinLine size={20} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ========== JOB SEEKER DASHBOARD ========== */
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden animate-fadeIn">
            <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  Application History
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  Track the progress of your active applications
                </p>
              </div>
              <div className="px-4 py-2 bg-blue-100 text-blue-700 rounded-xl text-sm font-bold flex items-center gap-2">
                <RiFolderLine /> {applications.length} Submitted
              </div>
            </div>

            <div className="p-8">
              {applications.length === 0 ? (
                <div className="py-20 text-center">
                  <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-200 text-4xl">
                    <RiBriefcaseLine />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">No applications yet</h3>
                  <p className="text-slate-400 mb-8 max-w-xs mx-auto">
                    Your dream job is waiting for you. Start browsing current openings.
                  </p>
                  <Link
                    to="/jobs"
                    className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold py-3 px-8 rounded-2xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all hover:-translate-y-0.5"
                  >
                    <RiSearchLine /> Browse Jobs
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {applications.map((app) => (
                    <div
                      key={app._id}
                      className="group border border-slate-100 rounded-3xl p-6 hover:border-blue-100 hover:bg-blue-50/20 transition-all duration-300"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                          <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-emerald-600 text-2xl group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                            <RiBriefcaseLine />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                              {app.job?.title || "Job removed"}
                            </h3>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-slate-500 text-sm">
                              <span className="font-semibold text-slate-800 tracking-tight">
                                {app.job?.company?.name || "N/A"}
                              </span>
                              <span className="text-slate-300">•</span>
                              <span>{app.job?.location || "Remote"}</span>
                              <span className="text-slate-300">•</span>
                              <span className="flex items-center gap-1 font-medium">
                                <RiTimeLine /> {new Date(app.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <span
                            className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest border-2 ${
                              app.status === "accepted"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                : app.status === "rejected"
                                ? "bg-rose-50 text-rose-700 border-rose-100"
                                : app.status === "reviewed"
                                ? "bg-blue-50 text-blue-700 border-blue-100"
                                : "bg-amber-50 text-amber-700 border-amber-100"
                            }`}
                          >
                            {app.status === "accepted" && <RiCheckboxCircleLine className="text-sm" />}
                            {app.status === "rejected" && <RiCloseCircleLine className="text-sm" />}
                            {app.status === "reviewed" && <RiEyeLine className="text-sm" />}
                            {app.status === "pending" && <RiTimeLine className="text-sm" />}
                            {app.status}
                          </span>
                          <button
                            onClick={() =>
                              handleWithdrawApplication(
                                app._id,
                                app.job?.title || "Unknown Job"
                              )
                            }
                            className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                            title="Withdraw Application"
                          >
                            <RiDeleteBinLine size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {DialogComponent}
    </div>
  );
};

export default DashboardPage;

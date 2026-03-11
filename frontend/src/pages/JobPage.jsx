import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobById, deleteJob } from "../store/slices/jobSlice";
import { applyForJob, clearApplySuccess, generateAiCoverLetter } from "../store/slices/applicationSlice";
import toast from "react-hot-toast";
import Spinner from "../components/Spinner";
import { useConfirmDialog } from "../components/ConfirmDialog";
import { 
  RiMapPinLine, RiCheckLine, RiAttachmentLine, RiEyeLine, RiTeamLine, 
  RiCalendarLine, RiCalendarEventLine, RiExternalLinkLine, RiBriefcaseLine,
  RiBuilding4Line, RiMoneyDollarCircleLine, RiArrowLeftLine, RiMailLine, 
  RiPhoneLine, RiToolsLine, RiGraduationCapLine, RiListCheck, RiDeleteBinLine,
  RiEditLine, RiMagicLine, RiCloseLine, RiFileTextLine
} from "react-icons/ri";

const JobPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showConfirm, DialogComponent } = useConfirmDialog();

  const { currentJob: job, loading } = useSelector((state) => state.jobs);
  const { user } = useSelector((state) => state.auth);
  const { applySuccess, error: applyError, loading: applyLoading, generatingCoverLetter } = useSelector(
    (state) => state.applications
  );

  const [coverLetter, setCoverLetter] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [showApplyForm, setShowApplyForm] = useState(false);

  useEffect(() => {
    dispatch(fetchJobById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (applySuccess) {
      toast.success("Application submitted successfully!");
      setShowApplyForm(false);
      setCoverLetter("");
      setResumeFile(null);
      dispatch(clearApplySuccess());
    }
  }, [applySuccess, dispatch]);

  useEffect(() => {
    if (applyError) {
      toast.error(applyError);
    }
  }, [applyError]);

  const onDeleteClick = (jobId) => {
    showConfirm({
      title: "Delete Job",
      message: "Are you sure you want to delete this job listing? This action cannot be undone.",
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
  };

  const handleGenerateCoverLetter = async () => {
    try {
      const coverLetterResult = await dispatch(generateAiCoverLetter({ 
        jobTitle: job.title, 
        companyName: job.company.name, 
        jobDescription: job.description,
        userName: user?.name
      })).unwrap();
      setCoverLetter(coverLetterResult);
      toast.success("AI cover letter generated successfully!");
    } catch (err) {
      toast.error(err || "Failed to generate cover letter.");
    }
  };

  const handleApply = (e) => {
    e.preventDefault();
    if (!resumeFile && !user?.resumeUrl) {
      toast.error("Please upload your resume before applying");
      return;
    }

    showConfirm({
      title: "Submit Application",
      message: "Are you sure you want to submit your application for this job?",
      confirmText: "Submit",
      variant: "primary",
      onConfirm: () => {
        dispatch(applyForJob({ jobId: id, coverLetter, resumeFile }));
      },
    });
  };

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
  const isJobSeeker = user && user.role === "job_seeker";

  const isExpired = job.lastDateToApply && new Date(job.lastDateToApply) < new Date();
  const isNew = !isExpired && (new Date().getTime() - new Date(job.createdAt).getTime()) < 3 * 24 * 60 * 60 * 1000;

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
                {/* Header Banner */}
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-8 md:p-12 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full -ml-16 -mb-16 blur-2xl"></div>
                  
                  <div className="relative z-10">
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${
                        isExpired ? 'bg-rose-500 text-white' : 'bg-blue-600 text-white'
                      }`}>
                        {job.type}
                      </span>
                      {isNew && (
                        <span className="px-4 py-1.5 bg-emerald-500 text-white rounded-full text-xs font-black uppercase tracking-widest">
                          New
                        </span>
                      )}
                      {isExpired && (
                        <span className="px-4 py-1.5 bg-rose-200 text-rose-800 rounded-full text-xs font-black uppercase tracking-widest">
                          Expired
                        </span>
                      )}
                    </div>
                    
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-white mb-4 tracking-tight leading-tight">
                      {job.title}
                    </h1>
                    
                    <div className="flex flex-wrap items-center gap-6 text-slate-400 font-medium">
                      <div className="flex items-center gap-2">
                        <RiBuilding4Line className="text-xl text-blue-400" />
                        <span className="text-white/90">{job.company.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <RiMapPinLine className="text-xl" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <RiMoneyDollarCircleLine className="text-xl text-emerald-400" />
                        <span className="text-white/90">Rs. {job.salary} / Year</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 border-b border-slate-50">
                  <div className="p-4 md:p-6 text-center border-r border-slate-50">
                    <RiTeamLine className="mx-auto text-blue-600 text-lg md:text-xl mb-1" />
                    <p className="text-slate-400 text-[8px] md:text-[10px] font-black uppercase tracking-widest">Applicants</p>
                    <p className="text-slate-900 font-black text-base md:text-lg">{job.applicantsCount || 0}</p>
                  </div>
                  <div className="p-4 md:p-6 text-center md:border-r border-slate-50">
                    <RiEyeLine className="mx-auto text-indigo-600 text-lg md:text-xl mb-1" />
                    <p className="text-slate-400 text-[8px] md:text-[10px] font-black uppercase tracking-widest">Views</p>
                    <p className="text-slate-900 font-black text-base md:text-lg">{job.views || 0}</p>
                  </div>
                  <div className="p-4 md:p-6 text-center border-r border-slate-50 border-t md:border-t-0">
                    <RiCalendarLine className="mx-auto text-emerald-600 text-lg md:text-xl mb-1" />
                    <p className="text-slate-400 text-[8px] md:text-[10px] font-black uppercase tracking-widest">Posted</p>
                    <p className="text-slate-900 font-black text-base md:text-lg">
                      {new Date(job.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                  <div className="p-4 md:p-6 text-center border-t md:border-t-0">
                    <RiCalendarEventLine className="mx-auto text-rose-600 text-lg md:text-xl mb-1" />
                    <p className="text-slate-400 text-[8px] md:text-[10px] font-black uppercase tracking-widest">Closes</p>
                    <p className="text-slate-900 font-black text-base md:text-lg">
                      {job.lastDateToApply ? new Date(job.lastDateToApply).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Content Sections */}
                <div className="p-8 md:p-12 space-y-12">
                  <section>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl">
                        <RiGraduationCapLine />
                      </div>
                      <h3 className="text-xl font-black text-slate-900 leading-none">Qualifications</h3>
                    </div>
                    <p className="text-slate-600 leading-loose whitespace-pre-wrap md:pl-13">
                      {job.qualifications || job.description}
                    </p>
                  </section>

                  <section>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl">
                        <RiListCheck />
                      </div>
                      <h3 className="text-xl font-black text-slate-900 leading-none">Key Responsibilities</h3>
                    </div>
                    <p className="text-slate-600 leading-loose whitespace-pre-wrap md:pl-13">
                      {job.responsibilities || "Not specified"}
                    </p>
                  </section>

                  <section>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">
                        <RiToolsLine />
                      </div>
                      <h3 className="text-xl font-black text-slate-900 leading-none">Skills Required</h3>
                    </div>
                    <p className="text-slate-600 leading-loose whitespace-pre-wrap md:pl-13">
                      {job.skills || "Not specified"}
                    </p>
                  </section>
                </div>
              </div>              {/* Application Handling Section */}
              <div className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden animate-fadeInUp">
                {isJobSeeker ? (
                  <>
                    {job.externalApplyUrl ? (
                      <div className="text-center">
                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl">
                          <RiExternalLinkLine />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-2">External Application</h3>
                        <p className="text-slate-500 mb-10 max-w-sm mx-auto">This role requires you to apply directly on the company's private career portal.</p>
                        <a
                           href={job.externalApplyUrl.startsWith('http') ? job.externalApplyUrl : `https://${job.externalApplyUrl}`}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="w-full inline-flex justify-center items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-black py-4 rounded-3xl transition-all shadow-xl shadow-slate-200"
                        >
                           Visit Application Site <RiExternalLinkLine />
                        </a>
                      </div>
                    ) : isExpired ? (
                      <div className="text-center p-8 bg-rose-50 rounded-3xl border border-rose-100">
                        <RiCloseLine className="text-4xl text-rose-500 mx-auto mb-3" />
                        <h4 className="text-rose-900 font-black text-xl mb-1">Applications Closed</h4>
                        <p className="text-rose-600/80 font-medium">The deadline for this position has passed.</p>
                      </div>
                    ) : job.hasApplied ? (
                      <div className="text-center p-10 bg-emerald-50 rounded-[2rem] border border-emerald-100/50">
                        <div className="w-20 h-20 bg-emerald-600 text-white rounded-[1.75rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-200">
                          <RiCheckLine size={40} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-2">Already Applied</h3>
                        <p className="text-slate-500 mb-8 max-w-sm mx-auto font-medium">You have already submitted your application for this position. You can track its status in your dashboard.</p>
                        <Link
                          to="/dashboard"
                          className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-black py-4 px-10 rounded-2xl transition-all hover:-translate-y-1 shadow-xl shadow-slate-200"
                        >
                          View Application Status <RiArrowLeftLine className="rotate-180" />
                        </Link>
                      </div>
                    ) : !showApplyForm ? (
                      <button
                        onClick={() => setShowApplyForm(true)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-3xl shadow-xl shadow-blue-100 transition-all hover:-translate-y-1 active:scale-95 text-lg"
                      >
                        Start Your Application
                      </button>
                    ) : (
                      <form onSubmit={handleApply} className="space-y-8 animate-fadeIn">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-6 mb-8">
                          <div>
                            <h3 className="text-2xl font-black text-slate-900">Application</h3>
                            <p className="text-slate-400 text-sm font-medium">Please review your profile data below.</p>
                          </div>
                          <button 
                            type="button"
                            onClick={() => setShowApplyForm(false)}
                            className="w-10 h-10 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-400 transition-colors"
                          >
                            <RiCloseLine size={24} />
                          </button>
                        </div>

                        {/* Resume Section */}
                        <div>
                          <label className="block text-slate-700 text-sm font-black mb-3 uppercase tracking-widest flex items-center gap-2">
                             Your Resume {!user?.resumeUrl && <span className="text-rose-500">*</span>}
                          </label>
                          {user?.resumeUrl && !resumeFile && (
                            <div className="mb-4 p-4 bg-emerald-50 text-emerald-800 rounded-2xl flex items-center justify-between border border-emerald-100">
                               <div className="flex items-center gap-3">
                                 <RiCheckLine className="text-xl text-emerald-600" />
                                 <span className="font-bold text-sm">Active Profile Resume</span>
                               </div>
                               <a href={user.resumeUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs font-black uppercase tracking-wider text-emerald-700 hover:text-emerald-900 bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors">
                                 <RiEyeLine /> View
                               </a>
                            </div>
                          )}
                          
                          <div className="relative group">
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file && file.size > 2 * 1024 * 1024) {
                                  toast.error("File size must be under 2MB");
                                  return;
                                }
                                setResumeFile(file);
                              }}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                              id="resume-upload"
                            />
                            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center bg-slate-50 transition-all group-hover:border-blue-400 group-hover:bg-blue-50/10">
                              {resumeFile ? (
                                <div className="text-blue-600 font-bold flex flex-col items-center">
                                  <RiFileTextLine className="text-3xl mb-2" />
                                  <span className="flex items-center gap-1">{resumeFile.name}</span>
                                  <p className="text-slate-400 text-xs mt-2 uppercase">Click to replace file</p>
                                </div>
                              ) : (
                                <div className="text-slate-400 flex flex-col items-center">
                                  <RiAttachmentLine className="text-3xl mb-2" />
                                  <p className="text-slate-700 font-black mb-1">
                                    {user?.resumeUrl ? "Upload New Attachment" : "Drop Resume Here"}
                                  </p>
                                  <p className="text-xs font-medium uppercase tracking-tighter italic">PDF, DOC (Max 2MB)</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Cover Letter Section */}
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <label className="block text-slate-700 text-sm font-black uppercase tracking-widest">
                              Brief Introduction
                            </label>
                            <button
                              type="button"
                              onClick={handleGenerateCoverLetter}
                              disabled={generatingCoverLetter}
                              className="group flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-[10px] font-black uppercase tracking-[0.2em] py-2 px-4 rounded-full transition-all shadow-lg shadow-blue-200 disabled:opacity-50"
                            >
                              {generatingCoverLetter ? (
                                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              ) : <RiMagicLine className="text-sm" />}
                              {generatingCoverLetter ? "Drafting..." : "Generate with AI"}
                            </button>
                          </div>
                          <textarea
                            className="block w-full bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] py-4 px-6 text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white resize-none"
                            rows="6"
                            placeholder="Why are you a great fit for this role?"
                            value={coverLetter}
                            onChange={(e) => setCoverLetter(e.target.value)}
                          />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                          <button
                            type="submit"
                            disabled={applyLoading}
                            className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-black py-4 rounded-2xl shadow-xl shadow-slate-200 transition-all hover:-translate-y-1 disabled:opacity-50 uppercase tracking-widest text-sm"
                          >
                            {applyLoading ? "Sending..." : "Submit Application"}
                          </button>
                        </div>
                      </form>
                    )}
                  </>
                ) : !user ? (
                  <div className="text-center py-6">
                    <RiBuilding4Line className="mx-auto text-slate-200 text-5xl mb-4" />
                    <h3 className="text-xl font-black text-slate-900 mb-2">Interested in this Role?</h3>
                    <p className="text-slate-400 mb-8 font-medium italic">Create an account or login to apply for this position.</p>
                    <Link
                      to="/login"
                      className="inline-block bg-blue-600 text-white font-black py-4 px-10 rounded-3xl shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all hover:-translate-y-1"
                    >
                      Login to Apply
                    </Link>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <RiBriefcaseLine className="mx-auto text-blue-100 text-5xl mb-4" />
                    <h3 className="text-xl font-black text-slate-900 mb-2">Internal Management</h3>
                    <p className="text-slate-400 mb-0 font-medium italic">As an employer, you can manage this role from your dashboard.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar Sections */}
            <aside className="space-y-8">
              {/* Company Info Card */}
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm animate-fadeInRight">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center text-3xl mb-6 mx-auto lg:mx-0">
                  <RiBuilding4Line />
                </div>
                <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-2 text-center lg:text-left">
                  Hiring Organization
                </h3>
                <h2 className="text-2xl font-black text-slate-900 mb-4 text-center lg:text-left leading-tight">
                  {job.company.name}
                </h2>
                <p className="text-slate-500 text-sm leading-relaxed mb-8 italic text-center lg:text-left">
                  {job.company.description}
                </p>
                
                <div className="space-y-4 pt-6 border-t border-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg">
                      <RiMailLine />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Email Address</span>
                      <span className="text-xs font-bold text-slate-700 break-all">{job.company.contactEmail}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg">
                      <RiPhoneLine />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Phone Number</span>
                      <span className="text-xs font-bold text-slate-700 italic">{job.company.contactPhone}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Management Card for Owners */}
              {isOwner && (
                <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl shadow-slate-200 animate-fadeInRight" style={{ animationDelay: '0.1s' }}>
                  <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-8 text-center">
                    Manager Tools
                  </h3>
                  <div className="space-y-4">
                    <Link
                      to={`/edit-job/${id}`}
                      state={{ job }}
                      className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white text-white hover:text-slate-900 font-black py-4 rounded-2xl transition-all border border-white/10"
                    >
                      <RiEditLine /> Edit Listing
                    </Link>
                    <button
                      onClick={() => onDeleteClick(job._id)}
                      className="w-full flex items-center justify-center gap-2 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white font-black py-4 rounded-2xl transition-all border border-rose-500/20"
                    >
                      <RiDeleteBinLine /> Delete Job
                    </button>
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      {DialogComponent}
    </div>
  );
};

export default JobPage;

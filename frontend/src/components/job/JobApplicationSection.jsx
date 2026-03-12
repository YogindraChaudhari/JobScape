import { memo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  RiExternalLinkLine,
  RiCloseLine,
  RiCheckLine,
  RiArrowLeftLine,
  RiEyeLine,
  RiAttachmentLine,
  RiFileTextLine,
  RiMagicLine,
  RiBriefcaseLine,
  RiBuilding4Line,
} from "react-icons/ri";

const JobApplicationSection = memo(
  ({
    job,
    user,
    isJobSeeker,
    isExpired,
    showApplyForm,
    onToggleForm,
    onApply,
    applyLoading,
    generatingCoverLetter,
    onGenerateCoverLetter,
  }) => {
    const [coverLetter, setCoverLetter] = useState("");
    const [resumeFile, setResumeFile] = useState(null);

    const handleApply = (e) => {
      e.preventDefault();
      if (!resumeFile && !user?.resumeUrl) {
        toast.error("Please upload your resume before applying");
        return;
      }
      onApply({ coverLetter, resumeFile });
    };

    const handleGenerate = async () => {
      const result = await onGenerateCoverLetter();
      if (result) setCoverLetter(result);
    };

    // Reset form when it's hidden
    const handleClose = () => {
      setCoverLetter("");
      setResumeFile(null);
      onToggleForm(false);
    };

    return (
      <div className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden animate-fadeInUp">
        {isJobSeeker ? (
          <>
            {job.externalApplyUrl ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl">
                  <RiExternalLinkLine />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">
                  External Application
                </h3>
                <p className="text-slate-500 mb-10 max-w-sm mx-auto">
                  This role requires you to apply directly on the company's
                  private career portal.
                </p>
                <a
                  href={
                    job.externalApplyUrl.startsWith("http")
                      ? job.externalApplyUrl
                      : `https://${job.externalApplyUrl}`
                  }
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
                <h4 className="text-rose-900 font-black text-xl mb-1">
                  Applications Closed
                </h4>
                <p className="text-rose-600/80 font-medium">
                  The deadline for this position has passed.
                </p>
              </div>
            ) : job.hasApplied ? (
              <div className="text-center p-10 bg-emerald-50 rounded-[2rem] border border-emerald-100/50">
                <div className="w-20 h-20 bg-emerald-600 text-white rounded-[1.75rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-200">
                  <RiCheckLine size={40} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">
                  Already Applied
                </h3>
                <p className="text-slate-500 mb-8 max-w-sm mx-auto font-medium">
                  You have already submitted your application for this position.
                  You can track its status in your dashboard.
                </p>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-black py-4 px-10 rounded-2xl transition-all hover:-translate-y-1 shadow-xl shadow-slate-200"
                >
                  View Application Status{" "}
                  <RiArrowLeftLine className="rotate-180" />
                </Link>
              </div>
            ) : !showApplyForm ? (
              <button
                onClick={() => onToggleForm(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-3xl shadow-xl shadow-blue-100 transition-all hover:-translate-y-1 active:scale-95 text-lg"
              >
                Start Your Application
              </button>
            ) : (
              <form onSubmit={handleApply} className="space-y-8 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-slate-100 pb-6 mb-8">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">
                      Application
                    </h3>
                    <p className="text-slate-400 text-sm font-medium">
                      Please review your profile data below.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="w-10 h-10 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-400 transition-colors"
                  >
                    <RiCloseLine size={24} />
                  </button>
                </div>

                {/* Resume Section */}
                <div>
                  <label className="block text-slate-700 text-sm font-black mb-3 uppercase tracking-widest flex items-center gap-2">
                    Your Resume{" "}
                    {!user?.resumeUrl && (
                      <span className="text-rose-500">*</span>
                    )}
                  </label>
                  {user?.resumeUrl && !resumeFile && (
                    <div className="mb-4 p-4 bg-emerald-50 text-emerald-800 rounded-2xl flex items-center justify-between border border-emerald-100">
                      <div className="flex items-center gap-3">
                        <RiCheckLine className="text-xl text-emerald-600" />
                        <span className="font-bold text-sm">
                          Active Profile Resume
                        </span>
                      </div>
                      <a
                        href={user.resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-xs font-black uppercase tracking-wider text-emerald-700 hover:text-emerald-900 bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors"
                      >
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
                          <span className="flex items-center gap-1">
                            {resumeFile.name}
                          </span>
                          <p className="text-slate-400 text-xs mt-2 uppercase">
                            Click to replace file
                          </p>
                        </div>
                      ) : (
                        <div className="text-slate-400 flex flex-col items-center">
                          <RiAttachmentLine className="text-3xl mb-2" />
                          <p className="text-slate-700 font-black mb-1">
                            {user?.resumeUrl
                              ? "Upload New Attachment"
                              : "Drop Resume Here"}
                          </p>
                          <p className="text-xs font-medium uppercase tracking-tighter italic">
                            PDF, DOC (Max 2MB)
                          </p>
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
                      onClick={handleGenerate}
                      disabled={generatingCoverLetter}
                      className="group flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-[10px] font-black uppercase tracking-[0.2em] py-2 px-4 rounded-full transition-all shadow-lg shadow-blue-200 disabled:opacity-50"
                    >
                      {generatingCoverLetter ? (
                        <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <RiMagicLine className="text-sm" />
                      )}
                      {generatingCoverLetter
                        ? "Drafting..."
                        : "Generate with AI"}
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
            <h3 className="text-xl font-black text-slate-900 mb-2">
              Interested in this Role?
            </h3>
            <p className="text-slate-400 mb-8 font-medium italic">
              Create an account or login to apply for this position.
            </p>
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
            <h3 className="text-xl font-black text-slate-900 mb-2">
              Internal Management
            </h3>
            <p className="text-slate-400 mb-0 font-medium italic">
              As an employer, you can manage this role from your dashboard.
            </p>
          </div>
        )}
      </div>
    );
  }
);

JobApplicationSection.displayName = "JobApplicationSection";
export default JobApplicationSection;

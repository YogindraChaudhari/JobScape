import { memo, useCallback } from "react";
import { useDispatch } from "react-redux";
import {
  RiFileTextLine,
  RiDownloadLine,
  RiEyeLine,
  RiEyeOffLine,
  RiMailLine,
  RiPhoneLine,
  RiTimeLine,
  RiCheckLine,
  RiCloseLine,
  RiSearch2Line,
  RiHistoryLine,
} from "react-icons/ri";
import { setExpandedApplicant, setPreviewApplicant } from "../../store/slices/uiSlice";

const ApplicantCard = memo(
  ({
    app,
    isExpanded,
    isPreviewOpen,
    onStatusChange,
    onDownload,
  }) => {
    const dispatch = useDispatch();

    const toggleExpanded = useCallback(() => {
      dispatch(setExpandedApplicant(app._id));
    }, [dispatch, app._id]);

    const togglePreview = useCallback(() => {
      dispatch(setPreviewApplicant(app._id));
    }, [dispatch, app._id]);

    return (
      <div className="group border border-slate-100 rounded-3xl p-6 hover:border-blue-100 hover:bg-blue-50/20 transition-all duration-300">
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
                  <RiTimeLine />{" "}
                  {new Date(app.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:flex-initial">
              <select
                value={app.status}
                onChange={(e) =>
                  onStatusChange(
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
                {app.status === "accepted" && (
                  <RiCheckLine className="text-emerald-600" />
                )}
                {app.status === "rejected" && (
                  <RiCloseLine className="text-rose-600" />
                )}
                {app.status === "reviewed" && (
                  <RiSearch2Line className="text-blue-600" />
                )}
                {app.status === "pending" && (
                  <RiHistoryLine className="text-amber-600" />
                )}
              </div>
            </div>

            <button
              onClick={toggleExpanded}
              className={`flex-1 md:flex-initial px-4 py-2.5 rounded-xl text-sm font-bold border-2 transition-all whitespace-nowrap ${
                isExpanded
                  ? "bg-slate-900 border-slate-900 text-white"
                  : "bg-white border-slate-100 text-slate-600 hover:border-slate-300"
              }`}
            >
              {isExpanded ? "Hide" : "Details"}
            </button>
          </div>
        </div>

        {isExpanded && (
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
              <div
                className={`flex items-center gap-3 flex-wrap pt-4 border-t border-slate-50 ${
                  !app.coverLetter ? "mt-6" : ""
                }`}
              >
                {app.resumeUrl.toLowerCase().includes(".pdf") && (
                  <button
                    onClick={togglePreview}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 text-sm font-bold transition-all ${
                      isPreviewOpen
                        ? "bg-slate-900 border-slate-900 text-white"
                        : "bg-white border-slate-100 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    {isPreviewOpen ? (
                      <>
                        <RiEyeOffLine /> Hide Preview
                      </>
                    ) : (
                      <>
                        <RiEyeLine /> Preview
                      </>
                    )}
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
                  onClick={() => onDownload(app.resumeUrl)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-bold shadow-sm shadow-emerald-100 hover:bg-emerald-700 transition-all ml-auto"
                >
                  <RiDownloadLine /> Download
                </button>
              </div>
            )}

            {app.resumeUrl?.toLowerCase().includes(".pdf") && isPreviewOpen && (
              <div className="mt-6 p-2 bg-slate-900 rounded-3xl animate-fadeIn">
                <iframe
                  src={`https://docs.google.com/gview?url=${encodeURIComponent(
                    app.resumeUrl
                  )}&embedded=true`}
                  className="w-full h-[600px] rounded-2xl border-none"
                  title={`Resume - ${app.applicant?.name}`}
                />
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

ApplicantCard.displayName = "ApplicantCard";
export default ApplicantCard;

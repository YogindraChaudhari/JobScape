import { memo, useState } from "react";
import toast from "react-hot-toast";
import {
  RiFileTextLine,
  RiEyeLine,
  RiEyeOffLine,
  RiDownloadLine,
  RiRefreshLine,
  RiUploadCloudLine,
} from "react-icons/ri";

const ProfileResumeCard = memo(
  ({ user, resumeFullUrl, onResumeUpload, onDownload }) => {
    const [showPreview, setShowPreview] = useState(false);

    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
          <RiFileTextLine className="text-blue-500" /> Resume / CV
        </h3>

        {resumeFullUrl ? (
          <div className="border border-gray-100 bg-slate-50 rounded-xl p-4 mb-4">
            {/* File info row */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <RiFileTextLine className="text-red-500 text-lg" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {user.resumeUrl?.split("/").pop()?.split("?")[0] ||
                    "resume.pdf"}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">PDF Document</p>
              </div>
              <span className="text-xs font-bold px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full">
                Uploaded
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-2">
              {resumeFullUrl?.toLowerCase().includes(".pdf") && (
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-lg border transition-all ${
                    showPreview
                      ? "bg-purple-50 text-purple-700 border-purple-200"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {showPreview ? (
                    <>
                      <RiEyeOffLine /> Hide Preview
                    </>
                  ) : (
                    <>
                      <RiEyeLine /> Show Preview
                    </>
                  )}
                </button>
              )}
              <a
                href={resumeFullUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 transition-all"
              >
                <RiFileTextLine /> View Full
              </a>
              <button
                onClick={() => onDownload(resumeFullUrl)}
                className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-lg border border-emerald-200 text-emerald-600 hover:bg-emerald-50 transition-all"
              >
                <RiDownloadLine /> Download
              </button>
            </div>

            {/* PDF Preview */}
            {resumeFullUrl?.toLowerCase().includes(".pdf") && showPreview && (
              <iframe
                src={`https://docs.google.com/gview?url=${encodeURIComponent(
                  resumeFullUrl
                )}&embedded=true`}
                className="w-full h-96 mt-4 rounded-xl border border-gray-200"
                title="Resume Preview"
              />
            )}
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-200 bg-gray-50 rounded-xl p-8 text-center mb-4">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <RiFileTextLine className="text-gray-400 text-xl" />
            </div>
            <p className="text-gray-500 font-medium text-sm">
              No resume uploaded yet
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Upload your CV to apply faster
            </p>
          </div>
        )}

        {/* Upload button */}
        <label className="cursor-pointer inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white font-bold py-2.5 px-5 rounded-xl transition-all hover:shadow-md hover:-translate-y-0.5 text-sm">
          {user.resumeUrl ? (
            <>
              <RiRefreshLine /> Update Resume
            </>
          ) : (
            <>
              <RiUploadCloudLine /> Upload Resume
            </>
          )}
          <input
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx"
            onChange={onResumeUpload}
          />
        </label>
        <p className="text-xs text-gray-400 mt-2">
          PDF, DOC, DOCX (max 2MB)
        </p>
      </div>
    );
  }
);

ProfileResumeCard.displayName = "ProfileResumeCard";
export default ProfileResumeCard;

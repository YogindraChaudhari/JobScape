import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateProfile, uploadResume } from "../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useConfirmDialog } from "../components/ConfirmDialog";
import {
  RiPencilLine, RiEyeLine, RiEyeOffLine, RiFileTextLine,
  RiDownloadLine, RiRefreshLine, RiUploadCloudLine,
  RiUserLine, RiMailLine, RiPhoneLine, RiBriefcaseLine,
  RiCloseLine, RiCheckLine,
} from "react-icons/ri";

const VITE_API_URL = import.meta.env.VITE_API_URL;

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading } = useSelector((state) => state.auth);
  const { showConfirm, DialogComponent } = useConfirmDialog();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("job_seeker");
  const [resumeFile, setResumeFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    setName(user.name || "");
    setEmail(user.email || "");
    setPhone(user.phone || "");
    setRole(user.role || "job_seeker");
  }, [user, navigate]);

  const handleSave = () => {
    showConfirm({
      title: "Save Changes",
      message: "Are you sure you want to update your profile?",
      variant: "primary",
      confirmText: "Save",
      onConfirm: async () => {
        try {
          await dispatch(updateProfile({ name, email, phone, role })).unwrap();
          toast.success("Profile updated successfully");
          setIsEditing(false);
        } catch (err) {
          toast.error(err || "Failed to update profile");
        }
      },
    });
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowed = [".pdf", ".doc", ".docx"];
    const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    if (!allowed.includes(ext)) { toast.error("Only PDF, DOC, and DOCX files are allowed"); return; }
    if (file.size > 2 * 1024 * 1024) { toast.error("File size must be under 2MB"); return; }
    setResumeFile(file);
    showConfirm({
      title: "Upload Resume",
      message: `Upload "${file.name}" as your resume?`,
      variant: "primary",
      confirmText: "Upload",
      onConfirm: async () => {
        try {
          await dispatch(uploadResume(file)).unwrap();
          toast.success("Resume uploaded successfully");
          setResumeFile(null);
        } catch (err) {
          toast.error(err || "Failed to upload resume");
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
      link.download = url.split("/").pop() || "resume.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      toast.error("Failed to download. Opening in new tab.");
      window.open(url, "_blank");
    }
  };

  if (!user) return null;

  const resumeFullUrl = user.resumeUrl
    ? user.resumeUrl.startsWith("http") ? user.resumeUrl : `${VITE_API_URL}${user.resumeUrl}`
    : null;

  const getInitials = (n) => n ? n.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) : "?";

  return (
    <section className="bg-slate-50 min-h-screen py-10 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Profile Settings</h1>
          <p className="text-gray-500 mt-1">Manage your personal information and resume</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left: Avatar card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white text-3xl font-extrabold mx-auto mb-4 shadow-lg shadow-blue-200">
                {getInitials(user.name)}
              </div>
              <h2 className="text-lg font-bold text-gray-900">{user.name}</h2>
              <p className="text-gray-400 text-sm mb-4">{user.email}</p>

              {/* Role badge */}
              <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${
                user.role === "employer"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-emerald-100 text-emerald-700"
              }`}>
                <RiBriefcaseLine />
                {user.role === "employer" ? "Employer" : "Job Seeker"}
              </span>

              {/* Edit toggle */}
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-5 w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold text-sm py-2.5 rounded-xl transition-all"
                >
                  <RiPencilLine /> Edit Profile
                </button>
              ) : (
                <button
                  onClick={() => { setIsEditing(false); setName(user.name || ""); setEmail(user.email || ""); setPhone(user.phone || ""); }}
                  className="mt-5 w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-500 hover:bg-gray-50 font-semibold text-sm py-2.5 rounded-xl transition-all"
                >
                  <RiCloseLine /> Cancel
                </button>
              )}
            </div>


          </div>

          {/* Right: Details + Resume */}
          <div className="lg:col-span-2 space-y-5">

            {/* Personal info card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
                <RiUserLine className="text-blue-500" /> Personal Information
              </h3>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1.5">Full Name</label>
                  {isEditing ? (
                    <div className="relative">
                      <RiUserLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      <input
                        type="text"
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  ) : (
                    <p className="text-gray-800 font-medium py-2.5 px-3.5 bg-gray-50 rounded-xl text-sm">{user.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1.5">Email Address</label>
                  {isEditing ? (
                    <div className="relative">
                      <RiMailLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      <input
                        type="email"
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  ) : (
                    <p className="text-gray-800 font-medium py-2.5 px-3.5 bg-gray-50 rounded-xl text-sm">{user.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1.5">Mobile Number</label>
                  {isEditing ? (
                    <div className="relative">
                      <RiPhoneLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      <input
                        type="tel"
                        placeholder="Enter your mobile number"
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  ) : (
                    <p className="text-gray-800 font-medium py-2.5 px-3.5 bg-gray-50 rounded-xl text-sm">{user.phone || "Not provided"}</p>
                  )}
                </div>

                {/* Role */}
                {isEditing && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Account Role</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[{ value: "job_seeker", label: "Job Seeker" }, { value: "employer", label: "Employer" }].map((r) => (
                        <label
                          key={r.value}
                          className={`flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all text-sm font-semibold ${
                            role === r.value ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-600 hover:border-gray-300"
                          }`}
                        >
                          <input type="radio" className="hidden" checked={role === r.value} onChange={() => setRole(r.value)} />
                          <RiCheckLine className={role === r.value ? "text-blue-500" : "text-transparent"} />
                          {r.label}
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Save button */}
              {isEditing && (
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="mt-6 w-full bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white font-bold py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 text-sm"
                >
                  {loading ? "Saving…" : "Save Changes"}
                </button>
              )}
            </div>

            {/* Resume card */}
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
                        {user.resumeUrl?.split("/").pop()?.split("?")[0] || "resume.pdf"}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">PDF Document</p>
                    </div>
                    <span className="text-xs font-bold px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full">Uploaded</span>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-wrap gap-2">
                    {resumeFullUrl?.toLowerCase().includes(".pdf") && (
                      <button
                        onClick={() => setShowPreview(!showPreview)}
                        className={`flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-lg border transition-all ${
                          showPreview ? "bg-purple-50 text-purple-700 border-purple-200" : "border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {showPreview ? <><RiEyeOffLine /> Hide Preview</> : <><RiEyeLine /> Show Preview</>}
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
                      onClick={() => handleDownload(resumeFullUrl)}
                      className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-lg border border-emerald-200 text-emerald-600 hover:bg-emerald-50 transition-all"
                    >
                      <RiDownloadLine /> Download
                    </button>
                  </div>

                  {/* PDF Preview */}
                  {resumeFullUrl?.toLowerCase().includes(".pdf") && showPreview && (
                    <iframe
                      src={`https://docs.google.com/gview?url=${encodeURIComponent(resumeFullUrl)}&embedded=true`}
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
                  <p className="text-gray-500 font-medium text-sm">No resume uploaded yet</p>
                  <p className="text-gray-400 text-xs mt-1">Upload your CV to apply faster</p>
                </div>
              )}

              {/* Upload button */}
              <label className="cursor-pointer inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white font-bold py-2.5 px-5 rounded-xl transition-all hover:shadow-md hover:-translate-y-0.5 text-sm">
                {user.resumeUrl ? <><RiRefreshLine /> Update Resume</> : <><RiUploadCloudLine /> Upload Resume</>}
                <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} />
              </label>
              <p className="text-xs text-gray-400 mt-2">PDF, DOC, DOCX (max 2MB)</p>
            </div>
          </div>
        </div>
      </div>
      {DialogComponent}
    </section>
  );
};

export default ProfilePage;

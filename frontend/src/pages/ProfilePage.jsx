import { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateProfile, uploadResume } from "../store/slices/authSlice";
import { selectUser, selectAuthLoading } from "../store/selectors";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useConfirmDialog } from "../components/ConfirmDialog";

// Profile sub-components
import ProfileAvatar from "../components/profile/ProfileAvatar";
import ProfileInfoForm from "../components/profile/ProfileInfoForm";
import ProfileResumeCard from "../components/profile/ProfileResumeCard";

const VITE_API_URL = import.meta.env.VITE_API_URL;

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const loading = useSelector(selectAuthLoading);
  const { showConfirm, DialogComponent } = useConfirmDialog();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("job_seeker");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    setName(user.name || "");
    setEmail(user.email || "");
    setPhone(user.phone || "");
    setRole(user.role || "job_seeker");
  }, [user, navigate]);

  const handleSave = useCallback(() => {
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
  }, [dispatch, showConfirm, name, email, phone, role]);

  const handleResumeUpload = useCallback(
    (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const allowed = [".pdf", ".doc", ".docx"];
      const ext = file.name
        .substring(file.name.lastIndexOf("."))
        .toLowerCase();
      if (!allowed.includes(ext)) {
        toast.error("Only PDF, DOC, and DOCX files are allowed");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File size must be under 2MB");
        return;
      }
      showConfirm({
        title: "Upload Resume",
        message: `Upload "${file.name}" as your resume?`,
        variant: "primary",
        confirmText: "Upload",
        onConfirm: async () => {
          try {
            await dispatch(uploadResume(file)).unwrap();
            toast.success("Resume uploaded successfully");
          } catch (err) {
            toast.error(err || "Failed to upload resume");
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
      link.download = url.split("/").pop() || "resume.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      toast.error("Failed to download. Opening in new tab.");
      window.open(url, "_blank");
    }
  }, []);

  const handleCancelEdit = useCallback(() => {
    setIsEditing(false);
    setName(user.name || "");
    setEmail(user.email || "");
    setPhone(user.phone || "");
  }, [user]);

  if (!user) return null;

  const resumeFullUrl = user.resumeUrl
    ? user.resumeUrl.startsWith("http")
      ? user.resumeUrl
      : `${VITE_API_URL}${user.resumeUrl}`
    : null;

  return (
    <section className="bg-slate-50 min-h-screen py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Profile Settings
          </h1>
          <p className="text-gray-500 mt-1">
            Manage your personal information and resume
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Avatar card */}
          <div className="lg:col-span-1">
            <ProfileAvatar
              user={user}
              isEditing={isEditing}
              onToggleEdit={() => setIsEditing(true)}
              onCancel={handleCancelEdit}
            />
          </div>

          {/* Right: Details + Resume */}
          <div className="lg:col-span-2 space-y-5">
            <ProfileInfoForm
              user={user}
              isEditing={isEditing}
              name={name}
              email={email}
              phone={phone}
              role={role}
              loading={loading}
              onNameChange={setName}
              onEmailChange={setEmail}
              onPhoneChange={setPhone}
              onRoleChange={setRole}
              onSave={handleSave}
            />

            <ProfileResumeCard
              user={user}
              resumeFullUrl={resumeFullUrl}
              onResumeUpload={handleResumeUpload}
              onDownload={handleDownload}
            />
          </div>
        </div>
      </div>
      {DialogComponent}
    </section>
  );
};

export default ProfilePage;

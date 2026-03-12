import { memo } from "react";
import {
  RiBriefcaseLine,
  RiPencilLine,
  RiCloseLine,
} from "react-icons/ri";

const getInitials = (n) =>
  n
    ? n
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

const ProfileAvatar = memo(({ user, isEditing, onToggleEdit, onCancel }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
      {/* Avatar */}
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white text-3xl font-extrabold mx-auto mb-4 shadow-lg shadow-blue-200">
        {getInitials(user.name)}
      </div>
      <h2 className="text-lg font-bold text-gray-900">{user.name}</h2>
      <p className="text-gray-400 text-sm mb-4">{user.email}</p>

      {/* Role badge */}
      <span
        className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${
          user.role === "employer"
            ? "bg-blue-100 text-blue-700"
            : "bg-emerald-100 text-emerald-700"
        }`}
      >
        <RiBriefcaseLine />
        {user.role === "employer" ? "Employer" : "Job Seeker"}
      </span>

      {/* Edit toggle */}
      {!isEditing ? (
        <button
          onClick={onToggleEdit}
          className="mt-5 w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold text-sm py-2.5 rounded-xl transition-all"
        >
          <RiPencilLine /> Edit Profile
        </button>
      ) : (
        <button
          onClick={onCancel}
          className="mt-5 w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-500 hover:bg-gray-50 font-semibold text-sm py-2.5 rounded-xl transition-all"
        >
          <RiCloseLine /> Cancel
        </button>
      )}
    </div>
  );
});

ProfileAvatar.displayName = "ProfileAvatar";
export default ProfileAvatar;

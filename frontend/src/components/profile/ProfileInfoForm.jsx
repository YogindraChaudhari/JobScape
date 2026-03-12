import { memo } from "react";
import {
  RiUserLine,
  RiMailLine,
  RiPhoneLine,
  RiCheckLine,
} from "react-icons/ri";

const ProfileInfoForm = memo(
  ({
    user,
    isEditing,
    name,
    email,
    phone,
    role,
    loading,
    onNameChange,
    onEmailChange,
    onPhoneChange,
    onRoleChange,
    onSave,
  }) => {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
          <RiUserLine className="text-blue-500" /> Personal Information
        </h3>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1.5">
              Full Name
            </label>
            {isEditing ? (
              <div className="relative">
                <RiUserLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                  value={name}
                  onChange={(e) => onNameChange(e.target.value)}
                />
              </div>
            ) : (
              <p className="text-gray-800 font-medium py-2.5 px-3.5 bg-gray-50 rounded-xl text-sm">
                {user.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1.5">
              Email Address
            </label>
            {isEditing ? (
              <div className="relative">
                <RiMailLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="email"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                  value={email}
                  onChange={(e) => onEmailChange(e.target.value)}
                />
              </div>
            ) : (
              <p className="text-gray-800 font-medium py-2.5 px-3.5 bg-gray-50 rounded-xl text-sm">
                {user.email}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1.5">
              Mobile Number
            </label>
            {isEditing ? (
              <div className="relative">
                <RiPhoneLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="tel"
                  placeholder="Enter your mobile number"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                  value={phone}
                  onChange={(e) => onPhoneChange(e.target.value)}
                />
              </div>
            ) : (
              <p className="text-gray-800 font-medium py-2.5 px-3.5 bg-gray-50 rounded-xl text-sm">
                {user.phone || "Not provided"}
              </p>
            )}
          </div>

          {/* Role */}
          {isEditing && (
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">
                Account Role
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: "job_seeker", label: "Job Seeker" },
                  { value: "employer", label: "Employer" },
                ].map((r) => (
                  <label
                    key={r.value}
                    className={`flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all text-sm font-semibold ${
                      role === r.value
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      className="hidden"
                      checked={role === r.value}
                      onChange={() => onRoleChange(r.value)}
                    />
                    <RiCheckLine
                      className={
                        role === r.value ? "text-blue-500" : "text-transparent"
                      }
                    />
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
            onClick={onSave}
            disabled={loading}
            className="mt-6 w-full bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white font-bold py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 text-sm"
          >
            {loading ? "Saving…" : "Save Changes"}
          </button>
        )}
      </div>
    );
  }
);

ProfileInfoForm.displayName = "ProfileInfoForm";
export default ProfileInfoForm;

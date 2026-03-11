import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearError } from "../store/slices/authSlice";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { RiEyeLine, RiEyeOffLine, RiMailLine, RiLockLine, RiUserLine, RiBriefcaseLine, RiSearchLine, RiBuilding4Line } from "react-icons/ri";

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm({ defaultValues: { role: "job_seeker" } });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);

  useEffect(() => { if (user) navigate("/"); }, [user, navigate]);
  useEffect(() => {
    if (error) { toast.error(error); dispatch(clearError()); }
  }, [error, dispatch]);

  const onSubmit = (data) => dispatch(registerUser({ name: data.name, email: data.email, password: data.password, role: data.role }));
  const password = watch("password");
  const selectedRole = watch("role");

  return (
    <section className="min-h-screen flex flex-col lg:flex-row">
      <div className="h-16 md:h-20 lg:hidden" />

      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-emerald-900 via-blue-950 to-slate-900 flex-col items-center justify-center p-12 overflow-hidden">
        <div className="absolute -top-30 -right-30 w-96 h-96 rounded-full bg-emerald-500/15 blur-[80px]" />
        <div className="absolute -bottom-30 -left-30 w-96 h-96 rounded-full bg-blue-600/20 blur-[80px]" />
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "40px 40px" }}
        />
        <div className="relative z-10 max-w-sm text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <RiBriefcaseLine className="text-white text-3xl" />
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-4">Join JobScape Today</h1>
          <p className="text-emerald-200/70 text-lg leading-relaxed">
            Create your free account and unlock thousands of job opportunities or post your first job in minutes.
          </p>
          <div className="mt-10 space-y-3 text-left">
            {[
              { icon: <RiSearchLine />, title: "Browse thousands of jobs", desc: "Find roles matching your skills" },
              { icon: <RiBuilding4Line />, title: "Connect with employers", desc: "Apply directly in one click" },
              { icon: <RiBriefcaseLine />, title: "Track your applications", desc: "Manage your career from dashboard" },
            ].map((f) => (
              <div key={f.title} className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0 text-emerald-400">
                  {f.icon}
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{f.title}</p>
                  <p className="text-white/50 text-xs">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-start sm:justify-center bg-slate-50 px-6 pt-10 pb-20 sm:py-16 min-h-screen lg:min-h-0 overflow-y-auto">
        <div className="w-full max-w-md my-auto">
          <div className="mb-8 text-center sm:text-left">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Create your account</h2>
            <p className="text-gray-500">Already have one? <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold">Login</Link></p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-gray-100 p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                <div className="relative">
                  <RiUserLine className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none" />
                  <input type="text" placeholder="John Doe"
                    className={`w-full pl-11 pr-4 py-3 border rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all ${errors.name ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                    {...register("name", { required: "Name is required" })}
                  />
                </div>
                {errors.name && <p className="text-red-500 text-xs mt-1.5">⚠ {errors.name.message}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email address</label>
                <div className="relative">
                  <RiMailLine className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none" />
                  <input type="email" placeholder="you@example.com"
                    className={`w-full pl-11 pr-4 py-3 border rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all ${errors.email ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                    {...register("email", {
                      required: "Email is required",
                      pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email format" }
                    })}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1.5">⚠ {errors.email.message}</p>}
              </div>

              {/* Role toggle */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">I am a…</label>
                <div className="grid grid-cols-2 gap-2">
                  {[{ value: "job_seeker", label: "Job Seeker", icon: <RiSearchLine /> }, { value: "employer", label: "Employer", icon: <RiBuilding4Line /> }].map((r) => (
                    <label key={r.value} className={`flex items-center gap-2.5 p-3 rounded-xl border-2 cursor-pointer transition-all ${selectedRole === r.value ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                      <input type="radio" value={r.value} className="hidden" {...register("role")} />
                      <span className="text-lg">{r.icon}</span>
                      <span className="font-semibold text-sm">{r.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <RiLockLine className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none" />
                  <input type={showPassword ? "text" : "password"} placeholder="At least 8 characters"
                    className={`w-full pl-11 pr-12 py-3 border rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all ${errors.password ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                    {...register("password", { 
                      required: "Password is required", 
                      minLength: { value: 8, message: "Minimum 8 characters" },
                      validate: {
                        hasSymbol: (v) => /[!@#$%^&*(),.?":{}|<>]/.test(v) || "At least one symbol required",
                        hasCapital: (v) => /[A-Z]/.test(v) || "At least one capital letter required"
                      }
                    })}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                    {showPassword ? <RiEyeOffLine className="text-lg" /> : <RiEyeLine className="text-lg" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1.5">⚠ {errors.password.message}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <RiLockLine className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none" />
                  <input type={showConfirmPassword ? "text" : "password"} placeholder="Repeat your password"
                    className={`w-full pl-11 pr-12 py-3 border rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all ${errors.confirmPassword ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                    {...register("confirmPassword", { required: "Please confirm your password", validate: (v) => v === password || "Passwords do not match" })}
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                    {showConfirmPassword ? <RiEyeOffLine className="text-lg" /> : <RiEyeLine className="text-lg" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1.5">⚠ {errors.confirmPassword.message}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white font-bold py-3.5 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm mt-1"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Creating account…
                  </span>
                ) : "Create Free Account"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterPage;

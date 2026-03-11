import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearError } from "../store/slices/authSlice";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { RiEyeLine, RiEyeOffLine, RiMailLine, RiLockLine, RiBriefcaseLine } from "react-icons/ri";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);

  useEffect(() => { if (user) navigate("/"); }, [user, navigate]);
  useEffect(() => {
    if (error) { toast.error(error); dispatch(clearError()); }
  }, [error, dispatch]);

  const onSubmit = (data) => dispatch(loginUser({ email: data.email, password: data.password }));

  return (
    <section className="min-h-screen flex flex-col lg:flex-row">
      <div className="h-16 md:h-20 lg:hidden" />

      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex-col items-center justify-center p-12 overflow-hidden">
        <div className="absolute -top-30 -right-30 w-96 h-96 rounded-full bg-blue-600/20 blur-[80px]" />
        <div className="absolute -bottom-30 -left-30 w-96 h-96 rounded-full bg-emerald-500/15 blur-[80px]" />
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "40px 40px" }}
        />
        <div className="relative z-10 max-w-sm text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-500/30">
            <RiBriefcaseLine className="text-white text-3xl" />
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-4">Welcome back to JobScape</h1>
          <p className="text-blue-200/70 text-lg leading-relaxed">
            Your next career move starts here. Log in to access your applications, profile, and tailored opportunities.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-4">
            {[["10K+", "Jobs"], ["500+", "Companies"], ["25K+", "Members"]].map(([v, l]) => (
              <div key={l} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <p className="text-xl font-extrabold text-white">{v}</p>
                <p className="text-xs text-white/50 mt-0.5">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-start sm:justify-center bg-slate-50 px-6 pt-12 pb-20 sm:py-16 min-h-screen lg:min-h-0 overflow-y-auto">
        <div className="w-full max-w-md my-auto">
          <div className="mb-8 text-center sm:text-left">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Login</h2>
            <p className="text-gray-500">Don't have an account? <Link to="/register" className="text-blue-600 hover:text-blue-700 font-semibold">Create one free</Link></p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-gray-100 p-8 sm:p-10">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email address</label>
                <div className="relative">
                  <RiMailLine className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className={`w-full pl-11 pr-4 py-3 border rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all ${errors.email ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                    {...register("email", { required: "Email is required" })}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">⚠ {errors.email.message}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <RiLockLine className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={`w-full pl-11 pr-12 py-3 border rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all ${errors.password ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                    {...register("password", { required: "Password is required" })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <RiEyeOffLine className="text-lg" /> : <RiEyeLine className="text-lg" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1.5">⚠ {errors.password.message}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white font-bold py-3.5 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm mt-2"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Logging in…
                  </span>
                ) : "Login to JobScape"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;

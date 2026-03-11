import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RiArrowRightLine, RiBriefcaseLine, RiBuilding4Line, RiUserStarLine } from "react-icons/ri";

const stats = [
  { icon: <RiBriefcaseLine />, value: "10K+", label: "Jobs Posted" },
  { icon: <RiBuilding4Line />, value: "500+", label: "Companies" },
  { icon: <RiUserStarLine />, value: "25K+", label: "Job Seekers" },
];

const Hero = ({ title, subtitle }) => {
  const { user } = useSelector((state) => state.auth);

  return (
    <section className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 overflow-hidden">
      {/* Animated blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/3 -right-1/4 w-[600px] h-[600px] rounded-full bg-blue-600/20 blur-[100px] animate-[pulse_8s_ease-in-out_infinite]" />
        <div className="absolute top-1/2 -left-1/4 w-[500px] h-[500px] rounded-full bg-emerald-500/15 blur-[100px] animate-[pulse_10s_ease-in-out_infinite_2s]" />
        <div className="absolute -bottom-1/4 left-1/2 w-[400px] h-[400px] rounded-full bg-violet-600/15 blur-[100px] animate-[pulse_7s_ease-in-out_infinite_1s]" />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "50px 50px" }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white/80 text-sm font-medium">Your dream job is one click away</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white leading-tight mb-6 animate-fade-in delay-100 px-2 sm:px-0">
            {title || (
              <>
                Find the Career<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 animate-gradient">
                  You Deserve
                </span>
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-blue-200/80 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in delay-200">
            {subtitle || "Connect with top companies, discover role-fit opportunities, and apply in seconds. Join thousands of professionals already on JobScape."}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in delay-300 px-6 sm:px-0">
            <Link
              to="/jobs"
              className="w-full sm:w-auto group flex items-center justify-center gap-2 px-8 py-4 text-base font-bold rounded-2xl bg-gradient-to-r from-blue-500 to-emerald-500 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-1 transition-all duration-300"
            >
              Browse Jobs
              <RiArrowRightLine className="group-hover:translate-x-1 transition-transform" />
            </Link>
            {!user && (
              <Link
                to="/register"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 text-base font-bold rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 hover:-translate-y-1 transition-all duration-300"
              >
                Create Free Account
              </Link>
            )}
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-lg mx-auto animate-fade-in delay-400">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex items-center sm:flex-col gap-4 sm:gap-1 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all duration-300 text-left sm:text-center"
              >
                <span className="text-2xl text-emerald-400 flex-shrink-0">{stat.icon}</span>
                <div className="flex flex-col">
                  <span className="text-xl font-extrabold text-white">{stat.value}</span>
                  <span className="text-xs text-white/50 font-medium">{stat.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom curve */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 60L1440 60L1440 0C1200 55 240 55 0 0L0 60Z" fill="#f8fafc" />
        </svg>
      </div>
    </section>
  );
};

export default Hero;

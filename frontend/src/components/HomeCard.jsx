import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { RiSearchLine, RiBuilding4Line, RiArrowRightLine, RiCheckLine } from "react-icons/ri";

const perks = [
  "Apply in seconds, no account required to browse",
  "Get matched with curated companies",
  "Manage all your applications in one place",
];

const HomeCard = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handlePostJobClick = (e) => {
    if (user && user.role === "job_seeker") {
      e.preventDefault();
      toast.error("Switch your role to Employer in profile settings to post a job");
    } else if (!user) {
      e.preventDefault();
      navigate("/login");
      toast.error("Please login to post a job");
    }
  };

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="text-center mb-14">
          <span className="inline-block text-blue-600 text-sm font-bold uppercase tracking-widest mb-3 bg-blue-50 px-4 py-1 rounded-full">
            Why JobScape?
          </span>
          <h2 className="text-4xl font-extrabold text-gray-900">
            Built for Everyone
          </h2>
          <p className="mt-4 text-gray-500 max-w-xl mx-auto text-lg">
            Whether you are looking for a job or hiring your next star player JobScape has you covered.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Job Seeker Card */}
          <div className="relative group rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-400">
            {/* Background accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-500" />

            <div className="relative p-10">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center mb-7 shadow-lg shadow-blue-200">
                <RiSearchLine className="text-2xl text-white" />
              </div>

              <div className="inline-block bg-blue-100 text-blue-600 text-xs font-bold px-3 py-1 rounded-full mb-4">
                For Job Seekers
              </div>

              <h3 className="text-3xl font-extrabold text-gray-900 mb-4">
                Land your next <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500">dream role</span>
              </h3>
              <p className="text-gray-500 text-base leading-relaxed mb-6">
                Browse curated openings, apply directly, and track every application all from one sleek dashboard.
              </p>

              <ul className="space-y-2.5 mb-8">
                {perks.map((p) => (
                  <li key={p} className="flex items-center gap-2.5 text-sm text-gray-600">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <RiCheckLine className="text-emerald-600 text-xs" />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>

              <Link
                to="/jobs"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold px-7 py-3.5 rounded-xl hover:shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5 transition-all duration-200"
              >
                Browse All Jobs <RiArrowRightLine />
              </Link>
            </div>
          </div>

          {/* Employer Card */}
          <div className="relative group rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 to-blue-950 border border-slate-700 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-400">
            {/* Background accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-500" />
            {/* Grid pattern */}
            <div className="absolute inset-0 opacity-[0.04]"
              style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "30px 30px" }}
            />

            <div className="relative p-10">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-400 rounded-2xl flex items-center justify-center mb-7 shadow-lg shadow-emerald-900/50">
                <RiBuilding4Line className="text-2xl text-white" />
              </div>

              <div className="inline-block bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full mb-4 border border-emerald-500/20">
                For Employers
              </div>

              <h3 className="text-3xl font-extrabold text-white mb-4">
                Hire the <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">perfect candidate</span>
              </h3>
              <p className="text-slate-400 text-base leading-relaxed mb-6">
                Post openings, review incoming applications, and update statuses all in real-time from your employer dashboard.
              </p>

              <ul className="space-y-2.5 mb-8">
                {["Post a job in under 2 minutes", "Review resumes & cover letters side-by-side", "Track applicant stages with status management"].map((p) => (
                  <li key={p} className="flex items-center gap-2.5 text-sm text-slate-300">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                      <RiCheckLine className="text-emerald-400 text-xs" />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>

              <Link
                to="/add-job"
                onClick={handlePostJobClick}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-400 text-white font-bold px-7 py-3.5 rounded-xl hover:shadow-lg hover:shadow-emerald-900/50 hover:-translate-y-0.5 transition-all duration-200"
              >
                Post a Job <RiArrowRightLine />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeCard;

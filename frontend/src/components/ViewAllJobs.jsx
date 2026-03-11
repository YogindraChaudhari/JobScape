import { Link } from "react-router-dom";
import { RiArrowRightLine, RiBriefcaseLine } from "react-icons/ri";

const ViewAllJobs = () => (
  <section className="py-16 bg-slate-50">
    <div className="max-w-2xl mx-auto px-4 text-center">
      <div className="bg-gradient-to-br from-blue-600 to-emerald-500 rounded-3xl p-10 shadow-xl shadow-blue-200 relative overflow-hidden">
        {/* decorative blobs */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />

        <div className="relative z-10">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <RiBriefcaseLine className="text-white text-2xl" />
          </div>
          <h2 className="text-3xl font-extrabold text-white mb-3">Explore All Opportunities</h2>
          <p className="text-white/80 text-base mb-7 max-w-sm mx-auto">
            Thousands of roles across tech, design, marketing and more — updated daily.
          </p>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-50 font-extrabold px-8 py-4 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 text-base"
          >
            View All Jobs <RiArrowRightLine className="text-lg" />
          </Link>
        </div>
      </div>
    </div>
  </section>
);

export default ViewAllJobs;

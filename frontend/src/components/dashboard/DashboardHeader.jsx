import { memo } from "react";
import { Link } from "react-router-dom";
import { RiInformationLine, RiAddLine } from "react-icons/ri";

const DashboardHeader = memo(({ userName, isEmployer, showPostButton }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold mb-3 border border-blue-100 uppercase tracking-wider">
          <RiInformationLine /> Overview
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
          Dashboard
        </h1>
        <p className="text-slate-500 font-medium text-sm sm:text-base">
          Welcome back, <span className="text-slate-900">{userName}</span>
          <span className="hidden sm:inline mx-2 text-slate-300">|</span>
          <br className="sm:hidden" />
          <span className="text-blue-600 font-semibold">
            {isEmployer ? "Employer" : "Job Seeker"}
          </span>
        </p>
      </div>

      {isEmployer && showPostButton && (
        <Link
          to="/add-job"
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-2xl shadow-lg shadow-blue-200 transition-all hover:-translate-y-0.5"
        >
          <RiAddLine className="text-xl" /> Post New Job
        </Link>
      )}
    </div>
  );
});

DashboardHeader.displayName = "DashboardHeader";
export default DashboardHeader;

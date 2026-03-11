import { useState } from "react";
import { Link } from "react-router-dom";
import { RiMapPinLine, RiTeamLine, RiCalendarLine, RiArrowRightLine } from "react-icons/ri";

const typeColors = {
  "Full-Time":  { bg: "bg-blue-100",    text: "text-blue-700",    dot: "bg-blue-500" },
  "Part-Time":  { bg: "bg-violet-100",  text: "text-violet-700",  dot: "bg-violet-500" },
  "Remote":     { bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500" },
  "Internship": { bg: "bg-amber-100",   text: "text-amber-700",   dot: "bg-amber-500" },
  "Contract":   { bg: "bg-rose-100",    text: "text-rose-700",    dot: "bg-rose-500" },
};

const getTypeStyle = (type) => typeColors[type] || { bg: "bg-gray-100", text: "text-gray-700", dot: "bg-gray-400" };

const JobListing = ({ job }) => {
  const [expanded, setExpanded] = useState(false);

  const desc = job.qualifications || job.description || "";
  const displayDesc = !expanded && desc.length > 110 ? desc.substring(0, 110) + "…" : desc;

  const isExpired = job.lastDateToApply && new Date(job.lastDateToApply) < new Date();
  const isNew = !isExpired && (Date.now() - new Date(job.createdAt).getTime()) < 3 * 24 * 60 * 60 * 1000;

  const typeStyle = getTypeStyle(job.type);

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 hover:border-blue-100 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-400 font-medium mb-0.5">{job.company?.name}</p>
            <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">
              {job.title}
            </h3>
          </div>

          {/* Status badges */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {job.hasApplied && (
              <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-emerald-500 text-white shadow-sm shadow-emerald-200 uppercase tracking-wider">
                ✓ Applied
              </span>
            )}
            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${typeStyle.bg} ${typeStyle.text}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${typeStyle.dot}`} />
              {job.type}
            </span>
            {isNew && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                ✨ New
              </span>
            )}
            {isExpired && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-red-100 text-red-600 border border-red-200">
                Expired
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-500 leading-relaxed mb-1">{displayDesc}</p>
        {desc.length > 110 && (
          <button
            onClick={() => setExpanded(p => !p)}
            className="text-xs text-blue-500 hover:text-blue-700 font-semibold mb-4 inline-block transition-colors"
          >
            {expanded ? "Show less ↑" : "Show more ↓"}
          </button>
        )}

        {/* Divider */}
        <div className="border-t border-gray-100 my-4" />

        {/* Meta info */}
        <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4">
          <span className="flex items-center gap-1.5 text-sm text-gray-500">
            <RiMapPinLine className="text-orange-400" />
            <span>{job.location || "Remote"}</span>
          </span>
          <span className="flex items-center gap-1.5 text-sm text-gray-500">
            <RiTeamLine className="text-blue-400" />
            <span>{job.applicantsCount || 0} applicants</span>
          </span>
          <span className="flex items-center gap-1.5 text-sm text-gray-500">
            <RiCalendarLine className="text-violet-400" />
            <span>{new Date(job.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
          </span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-medium mb-0.5">Annual Salary</p>
            <p className="text-lg font-extrabold text-emerald-600">
              {(() => {
                if (!job.salary) return "Not disclosed";
                const n = Number(job.salary);
                return isFinite(n) ? `₹${n.toLocaleString("en-IN")}` : String(job.salary);
              })()}
            </p>
          </div>
          <Link
            to={`/jobs/${job._id}`}
            className={`flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 ${
              job.hasApplied 
                ? "bg-slate-900 text-white hover:bg-slate-800" 
                : "bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white"
            }`}
          >
            {job.hasApplied ? "View Application" : "View Job"} <RiArrowRightLine className="text-base" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JobListing;

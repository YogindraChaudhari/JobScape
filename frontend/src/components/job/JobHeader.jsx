import { memo } from "react";
import {
  RiMapPinLine,
  RiBuilding4Line,
  RiMoneyDollarCircleLine,
} from "react-icons/ri";

const JobHeader = memo(({ job, isExpired, isNew }) => {
  return (
    <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-8 md:p-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full -ml-16 -mb-16 blur-2xl"></div>

      <div className="relative z-10">
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span
            className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${
              isExpired ? "bg-rose-500 text-white" : "bg-blue-600 text-white"
            }`}
          >
            {job.type}
          </span>
          {isNew && (
            <span className="px-4 py-1.5 bg-emerald-500 text-white rounded-full text-xs font-black uppercase tracking-widest">
              New
            </span>
          )}
          {isExpired && (
            <span className="px-4 py-1.5 bg-rose-200 text-rose-800 rounded-full text-xs font-black uppercase tracking-widest">
              Expired
            </span>
          )}
        </div>

        <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-white mb-4 tracking-tight leading-tight">
          {job.title}
        </h1>

        <div className="flex flex-wrap items-center gap-6 text-slate-400 font-medium">
          <div className="flex items-center gap-2">
            <RiBuilding4Line className="text-xl text-blue-400" />
            <span className="text-white/90">{job.company.name}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <RiMapPinLine className="text-xl" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <RiMoneyDollarCircleLine className="text-xl text-emerald-400" />
            <span className="text-white/90">Rs. {job.salary} / Year</span>
          </div>
        </div>
      </div>
    </div>
  );
});

JobHeader.displayName = "JobHeader";
export default JobHeader;

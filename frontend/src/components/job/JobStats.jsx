import { memo } from "react";
import {
  RiTeamLine,
  RiEyeLine,
  RiCalendarLine,
  RiCalendarEventLine,
} from "react-icons/ri";

const JobStats = memo(({ job }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 border-b border-slate-50">
      <div className="p-4 md:p-6 text-center border-r border-slate-50">
        <RiTeamLine className="mx-auto text-blue-600 text-lg md:text-xl mb-1" />
        <p className="text-slate-400 text-[8px] md:text-[10px] font-black uppercase tracking-widest">
          Applicants
        </p>
        <p className="text-slate-900 font-black text-base md:text-lg">
          {job.applicantsCount || 0}
        </p>
      </div>
      <div className="p-4 md:p-6 text-center md:border-r border-slate-50">
        <RiEyeLine className="mx-auto text-indigo-600 text-lg md:text-xl mb-1" />
        <p className="text-slate-400 text-[8px] md:text-[10px] font-black uppercase tracking-widest">
          Views
        </p>
        <p className="text-slate-900 font-black text-base md:text-lg">
          {job.views || 0}
        </p>
      </div>
      <div className="p-4 md:p-6 text-center border-r border-slate-50 border-t md:border-t-0">
        <RiCalendarLine className="mx-auto text-emerald-600 text-lg md:text-xl mb-1" />
        <p className="text-slate-400 text-[8px] md:text-[10px] font-black uppercase tracking-widest">
          Posted
        </p>
        <p className="text-slate-900 font-black text-base md:text-lg">
          {new Date(job.createdAt).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          })}
        </p>
      </div>
      <div className="p-4 md:p-6 text-center border-t md:border-t-0">
        <RiCalendarEventLine className="mx-auto text-rose-600 text-lg md:text-xl mb-1" />
        <p className="text-slate-400 text-[8px] md:text-[10px] font-black uppercase tracking-widest">
          Closes
        </p>
        <p className="text-slate-900 font-black text-base md:text-lg">
          {job.lastDateToApply
            ? new Date(job.lastDateToApply).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })
            : "N/A"}
        </p>
      </div>
    </div>
  );
});

JobStats.displayName = "JobStats";
export default JobStats;

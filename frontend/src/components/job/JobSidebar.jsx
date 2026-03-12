import { memo } from "react";
import { Link } from "react-router-dom";
import {
  RiBuilding4Line,
  RiMailLine,
  RiPhoneLine,
  RiEditLine,
  RiDeleteBinLine,
} from "react-icons/ri";

const CompanyCard = memo(({ company }) => (
  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm animate-fadeInRight">
    <div className="w-16 h-16 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center text-3xl mb-6 mx-auto lg:mx-0">
      <RiBuilding4Line />
    </div>
    <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-2 text-center lg:text-left">
      Hiring Organization
    </h3>
    <h2 className="text-2xl font-black text-slate-900 mb-4 text-center lg:text-left leading-tight">
      {company.name}
    </h2>
    <p className="text-slate-500 text-sm leading-relaxed mb-8 italic text-center lg:text-left">
      {company.description}
    </p>

    <div className="space-y-4 pt-6 border-t border-slate-50">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg">
          <RiMailLine />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">
            Email Address
          </span>
          <span className="text-xs font-bold text-slate-700 break-all">
            {company.contactEmail}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg">
          <RiPhoneLine />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">
            Phone Number
          </span>
          <span className="text-xs font-bold text-slate-700 italic">
            {company.contactPhone}
          </span>
        </div>
      </div>
    </div>
  </div>
));

const ManagerTools = memo(({ jobId, job, onDelete }) => (
  <div
    className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl shadow-slate-200 animate-fadeInRight"
    style={{ animationDelay: "0.1s" }}
  >
    <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-8 text-center">
      Manager Tools
    </h3>
    <div className="space-y-4">
      <Link
        to={`/edit-job/${jobId}`}
        state={{ job }}
        className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white text-white hover:text-slate-900 font-black py-4 rounded-2xl transition-all border border-white/10"
      >
        <RiEditLine /> Edit Listing
      </Link>
      <button
        onClick={onDelete}
        className="w-full flex items-center justify-center gap-2 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white font-black py-4 rounded-2xl transition-all border border-rose-500/20"
      >
        <RiDeleteBinLine /> Delete Job
      </button>
    </div>
  </div>
));

const JobSidebar = memo(({ job, isOwner, onDelete }) => {
  return (
    <aside className="space-y-8">
      <CompanyCard company={job.company} />
      {isOwner && (
        <ManagerTools jobId={job._id} job={job} onDelete={onDelete} />
      )}
    </aside>
  );
});

CompanyCard.displayName = "CompanyCard";
ManagerTools.displayName = "ManagerTools";
JobSidebar.displayName = "JobSidebar";
export default JobSidebar;

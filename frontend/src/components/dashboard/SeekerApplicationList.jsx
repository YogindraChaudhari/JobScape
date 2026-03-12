import { memo } from "react";
import { Link } from "react-router-dom";
import {
  RiBriefcaseLine,
  RiTimeLine,
  RiDeleteBinLine,
  RiFolderLine,
  RiSearchLine,
  RiCheckboxCircleLine,
  RiCloseCircleLine,
  RiEyeLine,
} from "react-icons/ri";

const SeekerApplicationCard = memo(({ app, onWithdraw }) => (
  <div className="group border border-slate-100 rounded-3xl p-6 hover:border-blue-100 hover:bg-blue-50/20 transition-all duration-300">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="flex items-center gap-5">
        <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-emerald-600 text-2xl group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
          <RiBriefcaseLine />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
            {app.job?.title || "Job removed"}
          </h3>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-slate-500 text-sm">
            <span className="font-semibold text-slate-800 tracking-tight">
              {app.job?.company?.name || "N/A"}
            </span>
            <span className="text-slate-300">•</span>
            <span>{app.job?.location || "Remote"}</span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1 font-medium">
              <RiTimeLine />{" "}
              {new Date(app.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span
          className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest border-2 ${
            app.status === "accepted"
              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
              : app.status === "rejected"
              ? "bg-rose-50 text-rose-700 border-rose-100"
              : app.status === "reviewed"
              ? "bg-blue-50 text-blue-700 border-blue-100"
              : "bg-amber-50 text-amber-700 border-amber-100"
          }`}
        >
          {app.status === "accepted" && (
            <RiCheckboxCircleLine className="text-sm" />
          )}
          {app.status === "rejected" && (
            <RiCloseCircleLine className="text-sm" />
          )}
          {app.status === "reviewed" && <RiEyeLine className="text-sm" />}
          {app.status === "pending" && <RiTimeLine className="text-sm" />}
          {app.status}
        </span>
        <button
          onClick={() =>
            onWithdraw(app._id, app.job?.title || "Unknown Job")
          }
          className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
          title="Withdraw Application"
        >
          <RiDeleteBinLine size={20} />
        </button>
      </div>
    </div>
  </div>
));

const SeekerApplicationList = memo(({ applications, onWithdraw }) => {
  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden animate-fadeIn">
      <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">
            Application History
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Track the progress of your active applications
          </p>
        </div>
        <div className="px-4 py-2 bg-blue-100 text-blue-700 rounded-xl text-sm font-bold flex items-center gap-2">
          <RiFolderLine /> {applications.length} Submitted
        </div>
      </div>

      <div className="p-8">
        {applications.length === 0 ? (
          <div className="py-20 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-200 text-4xl">
              <RiBriefcaseLine />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              No applications yet
            </h3>
            <p className="text-slate-400 mb-8 max-w-xs mx-auto">
              Your dream job is waiting for you. Start browsing current
              openings.
            </p>
            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold py-3 px-8 rounded-2xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all hover:-translate-y-0.5"
            >
              <RiSearchLine /> Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {applications.map((app) => (
              <SeekerApplicationCard
                key={app._id}
                app={app}
                onWithdraw={onWithdraw}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

SeekerApplicationCard.displayName = "SeekerApplicationCard";
SeekerApplicationList.displayName = "SeekerApplicationList";
export default SeekerApplicationList;

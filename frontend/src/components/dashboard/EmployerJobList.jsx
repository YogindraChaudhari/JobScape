import { memo } from "react";
import { Link } from "react-router-dom";
import {
  RiBriefcaseLine,
  RiTeamLine,
  RiEyeLine,
  RiEditLine,
  RiDeleteBinLine,
  RiAddLine,
} from "react-icons/ri";

const EmployerJobCard = memo(({ job, onViewApplicants, onDelete }) => (
  <div className="group border border-slate-100 rounded-3xl p-6 hover:border-blue-100 hover:bg-blue-50/20 transition-all duration-300">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="flex items-center gap-5">
        <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-blue-600 text-2xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
          <RiBriefcaseLine />
        </div>
        <div>
          <h3 className="text-base md:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
            {job.title}
          </h3>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-slate-500 text-xs md:text-sm">
            <span className="flex items-center gap-1 font-medium italic">
              {job.type}
            </span>
            <span className="text-slate-300">•</span>
            <span>{job.location}</span>
            <span className="text-slate-300">•</span>
            <span className="text-emerald-600 font-bold">
              {(() => {
                const n = Number(job.salary);
                return isFinite(n)
                  ? `₹${n.toLocaleString("en-IN")}`
                  : job.salary || "Not Disclosed";
              })()}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
        <button
          onClick={() => onViewApplicants(job._id)}
          className="flex-1 md:flex-initial flex items-center justify-center gap-2 bg-slate-900 text-white font-bold px-4 py-2.5 rounded-xl text-sm hover:bg-slate-800 transition-all group-hover:shadow-lg shadow-slate-100"
        >
          <RiTeamLine /> {job.applicantsCount || 0} Candidates
        </button>

        <div className="flex items-center justify-center md:justify-start gap-2 bg-slate-50 p-1.5 rounded-xl w-full md:w-auto">
          <Link
            to={`/jobs/${job._id}`}
            className="flex-1 md:flex-initial flex items-center justify-center p-2.5 text-slate-500 hover:text-blue-600 hover:bg-white rounded-xl transition-all"
            title="Preview Public View"
          >
            <RiEyeLine size={20} />
          </Link>
          <Link
            to={`/edit-job/${job._id}`}
            state={{ job }}
            className="flex-1 md:flex-initial flex items-center justify-center p-2.5 text-slate-500 hover:text-emerald-600 hover:bg-white rounded-xl transition-all"
            title="Edit Listing"
          >
            <RiEditLine size={20} />
          </Link>
          <button
            onClick={() => onDelete(job._id)}
            className="flex-1 md:flex-initial flex items-center justify-center p-2.5 text-slate-500 hover:text-rose-600 hover:bg-white rounded-xl transition-all"
            title="Delete Listing"
          >
            <RiDeleteBinLine size={20} />
          </button>
        </div>
      </div>
    </div>
  </div>
));

const EmployerJobList = memo(({ myJobs, onViewApplicants, onDelete }) => {
  return (
    <div className="bg-white rounded-3xl md:rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-6 md:p-8 border-b border-slate-50 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">
            Your Job Postings
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Manage and track your active role listings
          </p>
        </div>
        <div className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-xl text-sm font-bold flex items-center gap-2">
          <RiBriefcaseLine /> {myJobs.length} Active
        </div>
      </div>

      <div className="p-8">
        {myJobs.length === 0 ? (
          <div className="py-20 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-200 text-4xl">
              <RiBriefcaseLine />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              No jobs posted yet
            </h3>
            <p className="text-slate-400 mb-8 max-w-xs mx-auto">
              Ready to find your next team member? Start by creating a job
              listing.
            </p>
            <Link
              to="/add-job"
              className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold py-3 px-8 rounded-2xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all hover:-translate-y-0.5"
            >
              <RiAddLine /> Post Your First Job
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {myJobs.map((job) => (
              <EmployerJobCard
                key={job._id}
                job={job}
                onViewApplicants={onViewApplicants}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

EmployerJobCard.displayName = "EmployerJobCard";
EmployerJobList.displayName = "EmployerJobList";
export default EmployerJobList;

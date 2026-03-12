import { memo } from "react";
import { useSelector } from "react-redux";
import {
  selectApplications,
  selectAppsLoading,
  selectExpandedApplicant,
  selectPreviewApplicant,
} from "../../store/selectors";
import Spinner from "../Spinner";
import ApplicantCard from "./ApplicantCard";
import {
  RiArrowLeftLine,
  RiTeamLine,
  RiUserLine,
} from "react-icons/ri";

const ApplicantQueue = memo(
  ({ onBack, onStatusChange, onDownload }) => {
    const applications = useSelector(selectApplications);
    const appsLoading = useSelector(selectAppsLoading);
    const expandedAppId = useSelector(selectExpandedApplicant);
    const previewAppId = useSelector(selectPreviewApplicant);

    return (
      <div className="bg-white rounded-3xl md:rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 border-b border-slate-50 bg-slate-50/50">
          <button
            onClick={onBack}
            className="group flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold text-sm mb-4 transition-colors"
          >
            <RiArrowLeftLine className="group-hover:-translate-x-1 transition-transform" />
            Back to Jobs
          </button>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-slate-900">
                Applicants Queue
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Showing all candidates for this position
              </p>
            </div>
            <div className="px-4 py-2 bg-blue-100 text-blue-700 rounded-xl text-sm font-bold flex items-center gap-2">
              <RiTeamLine /> {applications.length} Applied
            </div>
          </div>
        </div>

        <div className="p-8">
          {appsLoading ? (
            <Spinner loading={true} />
          ) : applications.length === 0 ? (
            <div className="py-12 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300 text-3xl">
                <RiUserLine />
              </div>
              <p className="text-slate-400 font-semibold">
                No one has applied yet.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {applications.map((app) => (
                <ApplicantCard
                  key={app._id}
                  app={app}
                  isExpanded={expandedAppId === app._id}
                  isPreviewOpen={previewAppId === app._id}
                  onStatusChange={onStatusChange}
                  onDownload={onDownload}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
);

ApplicantQueue.displayName = "ApplicantQueue";
export default ApplicantQueue;

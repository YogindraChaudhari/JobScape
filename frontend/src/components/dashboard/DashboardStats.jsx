import { memo } from "react";
import {
  RiBriefcaseLine,
  RiTeamLine,
  RiCheckDoubleLine,
  RiTimeLine,
  RiFolderLine,
  RiCloseCircleLine,
} from "react-icons/ri";

const StatCard = ({ icon: Icon, label, value, iconBg, iconColor }) => (
  <div className="flex-shrink-0 w-[160px] sm:w-auto bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm snap-start">
    <div
      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl ${iconBg} ${iconColor} flex items-center justify-center text-xl sm:text-2xl mb-3 sm:mb-4`}
    >
      <Icon />
    </div>
    <p className="text-slate-500 text-[10px] sm:text-sm font-bold uppercase tracking-wider">
      {label}
    </p>
    <h3 className="text-2xl sm:text-3xl font-black text-slate-900">{value}</h3>
  </div>
);

const EmployerStats = memo(({ stats }) => (
  <>
    <StatCard
      icon={RiBriefcaseLine}
      label="Jobs Posted"
      value={stats.jobsPosted}
      iconBg="bg-blue-50"
      iconColor="text-blue-600"
    />
    <StatCard
      icon={RiTeamLine}
      label="Applicants"
      value={stats.totalApplicants}
      iconBg="bg-emerald-50"
      iconColor="text-emerald-600"
    />
    <StatCard
      icon={RiCheckDoubleLine}
      label="Accepted"
      value="—"
      iconBg="bg-violet-50"
      iconColor="text-violet-600"
    />
    <StatCard
      icon={RiTimeLine}
      label="In Review"
      value="—"
      iconBg="bg-rose-50"
      iconColor="text-rose-600"
    />
  </>
));

const SeekerStats = memo(({ stats }) => (
  <>
    <StatCard
      icon={RiFolderLine}
      label="Applied"
      value={stats.total}
      iconBg="bg-blue-50"
      iconColor="text-blue-600"
    />
    <StatCard
      icon={RiCheckDoubleLine}
      label="Accepted"
      value={stats.accepted}
      iconBg="bg-emerald-50"
      iconColor="text-emerald-600"
    />
    <StatCard
      icon={RiTimeLine}
      label="In Review"
      value={stats.inReview}
      iconBg="bg-amber-50"
      iconColor="text-amber-600"
    />
    <StatCard
      icon={RiCloseCircleLine}
      label="Rejected"
      value={stats.rejected}
      iconBg="bg-rose-50"
      iconColor="text-rose-600"
    />
  </>
));

const DashboardStats = memo(({ isEmployer, employerStats, seekerStats }) => {
  return (
    <div className="flex sm:grid flex-nowrap sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8 overflow-x-auto sm:overflow-x-visible pb-4 sm:pb-0 hide-scrollbar snap-x">
      {isEmployer ? (
        <EmployerStats stats={employerStats} />
      ) : (
        <SeekerStats stats={seekerStats} />
      )}
    </div>
  );
});

EmployerStats.displayName = "EmployerStats";
SeekerStats.displayName = "SeekerStats";
DashboardStats.displayName = "DashboardStats";
export default DashboardStats;

import { memo } from "react";
import {
  RiGraduationCapLine,
  RiListCheck,
  RiToolsLine,
} from "react-icons/ri";

const ContentSection = memo(({ icon: Icon, title, content, iconBg, iconColor }) => (
  <section>
    <div className="flex items-center gap-3 mb-4">
      <div
        className={`w-10 h-10 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center text-xl`}
      >
        <Icon />
      </div>
      <h3 className="text-xl font-black text-slate-900 leading-none">
        {title}
      </h3>
    </div>
    <p className="text-slate-600 leading-loose whitespace-pre-wrap md:pl-13">
      {content || "Not specified"}
    </p>
  </section>
));

const JobContent = memo(({ job }) => {
  return (
    <div className="p-8 md:p-12 space-y-12">
      <ContentSection
        icon={RiGraduationCapLine}
        title="Qualifications"
        content={job.qualifications || job.description}
        iconBg="bg-blue-50"
        iconColor="text-blue-600"
      />
      <ContentSection
        icon={RiListCheck}
        title="Key Responsibilities"
        content={job.responsibilities}
        iconBg="bg-indigo-50"
        iconColor="text-indigo-600"
      />
      <ContentSection
        icon={RiToolsLine}
        title="Skills Required"
        content={job.skills}
        iconBg="bg-emerald-50"
        iconColor="text-emerald-600"
      />
    </div>
  );
});

ContentSection.displayName = "ContentSection";
JobContent.displayName = "JobContent";
export default JobContent;

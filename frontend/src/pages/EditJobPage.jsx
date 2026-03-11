import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation, useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateJob } from "../store/slices/jobSlice";
import toast from "react-hot-toast";
import { useConfirmDialog } from "../components/ConfirmDialog";
import { 
  RiBriefcaseLine, RiBuilding4Line, RiMapPinLine, RiMoneyDollarCircleLine,
  RiTimeLine, RiLinkM, RiCalendarLine, RiListCheck, RiToolsLine, RiGraduationCapLine,
  RiArrowLeftLine, RiInformationLine, RiMailLine, RiPhoneLine, RiSave3Line
} from "react-icons/ri";

const EditJobPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { jobId } = useParams();
  const location = useLocation();
  const job = location?.state?.job;
  const { showConfirm, DialogComponent } = useConfirmDialog();
  const { user } = useSelector((state) => state.auth);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  useEffect(() => {
    if (!user || user.role !== "employer") {
      navigate("/login");
      return;
    }
    if (job) {
      setValue("title", job.title);
      setValue("type", job.type);
      setValue("location", job.location);
      setValue("qualifications", job.qualifications || "");
      setValue("responsibilities", job.responsibilities || "");
      setValue("skills", job.skills || "");
      setValue("externalApplyUrl", job.externalApplyUrl || "");
      setValue("lastDateToApply", job.lastDateToApply ? job.lastDateToApply.split("T")[0] : "");
      setValue("salary", job.salary);
      setValue("companyName", job.company.name);
      setValue("companyDescription", job.company.description);
      setValue("contactEmail", job.company.contactEmail);
      setValue("contactPhone", job.company.contactPhone);
    }
  }, [job, user, navigate, setValue]);

  const onSubmit = (data) => {
    const updatedJob = {
      _id: jobId,
      title: data.title,
      type: data.type,
      location: data.location,
      qualifications: data.qualifications,
      responsibilities: data.responsibilities,
      skills: data.skills,
      externalApplyUrl: data.externalApplyUrl,
      lastDateToApply: data.lastDateToApply,
      salary: data.salary,
      company: {
        name: data.companyName,
        description: data.companyDescription,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
      },
    };

    showConfirm({
      title: "Save Changes",
      message: "Are you sure you want to update this job listing?",
      confirmText: "Save Changes",
      variant: "primary",
      onConfirm: async () => {
        try {
          await dispatch(updateJob(updatedJob)).unwrap();
          toast.success("Job updated successfully");
          navigate(`/jobs/${jobId}`);
        } catch (err) {
          toast.error(err || "Failed to update job");
        }
      },
    });
  };

  const labelClass = "block text-slate-700 text-sm font-bold mb-2 flex items-center gap-2";
  const inputClass = (field) =>
    `w-full bg-slate-50 border-2 rounded-xl py-3 px-4 text-slate-900 outline-none transition-all placeholder:text-slate-400 ${
      errors[field] 
        ? "border-rose-100 focus:border-rose-500 bg-rose-50/30" 
        : "border-slate-100 focus:border-blue-500 focus:bg-white"
    }`;

  const SectionHeader = ({ icon: Icon, title, subtitle }) => (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl">
          <Icon />
        </div>
        <h3 className="text-xl font-black text-slate-900">{title}</h3>
      </div>
      <p className="text-slate-400 text-sm font-medium md:ml-13">{subtitle}</p>
    </div>
  );

  return (
    <div className="bg-slate-50/50 min-h-screen pt-28 pb-20 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-10">
          <Link
            to="/dashboard"
            className="group inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold text-sm mb-4 transition-colors"
          >
            <RiArrowLeftLine className="group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Edit Job Listing</h1>
          <p className="text-slate-500 mt-2 font-medium italic">Refine the details to improve your candidate pool.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Section 1: Job Identity */}
          <div className="bg-white p-6 md:p-10 rounded-3xl md:rounded-[2.5rem] border border-slate-100 shadow-sm transition-all hover:shadow-md">
            <SectionHeader 
              icon={RiBriefcaseLine} 
              title="Job Identity" 
              subtitle="Basic information about the role and compensation."
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className={labelClass}><RiInformationLine /> Job Title</label>
                <input 
                  type="text" 
                  className={inputClass("title")} 
                  placeholder="e.g. Senior Frontend Engineer" 
                  {...register("title", { required: "Title is required" })} 
                />
                {errors.title && <p className="text-rose-500 text-xs font-bold mt-2 ml-1">{errors.title.message}</p>}
              </div>

              <div>
                <label className={labelClass}><RiTimeLine /> Job Type</label>
                <select className={inputClass("type")} {...register("type")}>
                  <option value="Full-Time">Full-Time</option>
                  <option value="Part-Time">Part-Time</option>
                  <option value="Remote">Remote</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              <div>
                <label className={labelClass}><RiMoneyDollarCircleLine /> Annual Salary Range</label>
                <select className={inputClass("salary")} {...register("salary")}>
                  <option value="Under 1.5 Lakh">Under 1.5 Lakh</option>
                  <option value="1.5 - 2 Lakh">1.5 - 2 Lakh</option>
                  <option value="2 - 3 Lakh">2 - 3 Lakh</option>
                  <option value="3 - 4 Lakh">3 - 4 Lakh</option>
                  <option value="4 - 5 Lakh">4 - 5 Lakh</option>
                  <option value="5 - 6 Lakh">5 - 6 Lakh</option>
                  <option value="6 - 7 Lakh">6 - 7 Lakh</option>
                  <option value="7 - 8 Lakh">7 - 8 Lakh</option>
                  <option value="8 - 10 Lakh">8 - 10 Lakh</option>
                  <option value="10 - 12 Lakh">10 - 12 Lakh</option>
                  <option value="Over 12 Lakh">Over 12 Lakh</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Requirements */}
          <div className="bg-white p-6 md:p-10 rounded-3xl md:rounded-[2.5rem] border border-slate-100 shadow-sm transition-all hover:shadow-md">
            <SectionHeader 
              icon={RiListCheck} 
              title="Requirements & Skills" 
              subtitle="Be specific to attract the right candidates."
            />
            
            <div className="space-y-6">
              <div>
                <label className={labelClass}><RiGraduationCapLine /> Qualifications</label>
                <textarea 
                  className={inputClass("qualifications")} 
                  rows="3" 
                  placeholder="What educational or professional background is needed?" 
                  {...register("qualifications", { required: "Qualifications are required" })} 
                />
                {errors.qualifications && <p className="text-rose-500 text-xs font-bold mt-2 ml-1">{errors.qualifications.message}</p>}
              </div>

              <div>
                <label className={labelClass}><RiArrowLeftLine className="rotate-180" /> Key Responsibilities</label>
                <textarea 
                  className={inputClass("responsibilities")} 
                  rows="4" 
                  placeholder="List the day-to-day tasks and expectations..." 
                  {...register("responsibilities", { required: "Responsibilities are required" })} 
                />
                {errors.responsibilities && <p className="text-rose-500 text-xs font-bold mt-2 ml-1">{errors.responsibilities.message}</p>}
              </div>

              <div>
                <label className={labelClass}><RiToolsLine /> Required Skills</label>
                <textarea 
                  className={inputClass("skills")} 
                  rows="3" 
                  placeholder="Technical stacks, soft skills, or tools..." 
                  {...register("skills", { required: "Skills are required" })} 
                />
                {errors.skills && <p className="text-rose-500 text-xs font-bold mt-2 ml-1">{errors.skills.message}</p>}
              </div>
            </div>
          </div>

          {/* Section 3: Location */}
          <div className="bg-white p-6 md:p-10 rounded-3xl md:rounded-[2.5rem] border border-slate-100 shadow-sm">
            <SectionHeader 
              icon={RiMapPinLine} 
              title="Location, Links & Deadline" 
              subtitle="Where and when should they apply?"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}><RiMapPinLine /> Location</label>
                <input 
                  type="text" 
                  className={inputClass("location")} 
                  placeholder="City, State or Remote" 
                  {...register("location", { required: "Location is required" })} 
                />
                {errors.location && <p className="text-rose-500 text-xs font-bold mt-2 ml-1">{errors.location.message}</p>}
              </div>

              <div>
                <label className={labelClass}><RiCalendarLine /> Application Deadline</label>
                <input 
                  type="date" 
                  className={inputClass("lastDateToApply")} 
                  {...register("lastDateToApply", { required: "Deadline is required" })} 
                />
                {errors.lastDateToApply && <p className="text-rose-500 text-xs font-bold mt-2 ml-1">{errors.lastDateToApply.message}</p>}
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}><RiLinkM /> External Application Link (Optional)</label>
                <input 
                  type="url" 
                  className={inputClass("externalApplyUrl")} 
                  placeholder="https://company.com/careers/apply" 
                  {...register("externalApplyUrl")} 
                />
              </div>
            </div>
          </div>

          {/* Section 4: Company Info */}
          <div className="bg-white p-6 md:p-10 rounded-3xl md:rounded-[2.5rem] border border-slate-100 shadow-sm">
            <SectionHeader 
              icon={RiBuilding4Line} 
              title="Company Profile" 
              subtitle="Tell candidates about your organization."
            />
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}><RiBuilding4Line /> Company Name</label>
                  <input 
                    type="text" 
                    className={inputClass("companyName")} 
                    placeholder="e.g. Acme Corp" 
                    {...register("companyName", { required: "Company name is required" })} 
                  />
                  {errors.companyName && <p className="text-rose-500 text-xs font-bold mt-2 ml-1">{errors.companyName.message}</p>}
                </div>
                <div>
                  <label className={labelClass}><RiMailLine /> Contact Email</label>
                  <input 
                    type="email" 
                    className={inputClass("contactEmail")} 
                    placeholder="recruiter@company.com" 
                    {...register("contactEmail", { required: "Email is required" })} 
                  />
                  {errors.contactEmail && <p className="text-rose-500 text-xs font-bold mt-2 ml-1">{errors.contactEmail.message}</p>}
                </div>
              </div>

              <div>
                <label className={labelClass}><RiPhoneLine /> Contact Phone</label>
                <input 
                  type="tel" 
                  className={inputClass("contactPhone")} 
                  placeholder="+91 XXXXX XXXXX" 
                  {...register("contactPhone", { required: "Phone is required" })} 
                />
                {errors.contactPhone && <p className="text-rose-500 text-xs font-bold mt-2 ml-1">{errors.contactPhone.message}</p>}
              </div>

              <div>
                <label className={labelClass}><RiInformationLine /> Company Description</label>
                <textarea 
                  className={inputClass("companyDescription")} 
                  rows="4" 
                  placeholder="Briefly describe your company's mission and culture..." 
                  {...register("companyDescription", { required: "Description is required" })} 
                />
                {errors.companyDescription && <p className="text-rose-500 text-xs font-bold mt-2 ml-1">{errors.companyDescription.message}</p>}
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-5 rounded-3xl shadow-xl shadow-slate-200 transition-all hover:-translate-y-1 active:scale-[0.98] text-lg tracking-wide uppercase flex items-center justify-center gap-3"
            >
              <RiSave3Line size={24} /> Update Job Listing
            </button>
            <p className="text-center text-slate-400 text-xs font-bold mt-6 uppercase tracking-widest">
              Last saved changes will be updated immediately
            </p>
          </div>
        </form>
      </div>
      {DialogComponent}
    </div>
  );
};

export default EditJobPage;

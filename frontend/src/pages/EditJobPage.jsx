import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { updateJob } from "../services/jobService"; // Ensure this function is defined correctly

const EditJobPage = () => {
  const navigate = useNavigate();
  const { jobId } = useParams(); // Extract jobId from the URL
  console.log(jobId);
  const location = useLocation(); // Get location state
  const job = location?.state?.job; // Access the job data passed in state

  // Form fields
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [locationField, setLocationField] = useState("");
  const [description, setDescription] = useState("");
  const [salary, setSalary] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  // Set form fields with job data on initial load
  useEffect(() => {
    if (job) {
      setTitle(job.title);
      setType(job.type);
      setLocationField(job.location);
      setDescription(job.description);
      setSalary(job.salary);
      setCompanyName(job.company.name);
      setCompanyDescription(job.company.description);
      setContactEmail(job.company.contactEmail);
      setContactPhone(job.company.contactPhone);
    }
  }, [job]);

  const submitForm = async (e) => {
    e.preventDefault();

    if (
      !title ||
      !type ||
      !locationField ||
      !description ||
      !salary ||
      !companyName ||
      !companyDescription ||
      !contactEmail
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const updatedJob = {
      _id: jobId,
      title,
      type,
      location: locationField,
      description,
      salary,
      company: {
        name: companyName,
        description: companyDescription,
        contactEmail,
        contactPhone,
      },
    };

    try {
      const response = await updateJob(updatedJob);
      if (response) {
        toast.success("Job Updated Successfully");
        navigate(`/jobs/${jobId}`);
      } else {
        toast.error("Job update failed: No response data");
      }
    } catch (error) {
      console.error("Error updating job:", error);

      if (error.message === "Unexpected end of JSON input") {
        toast.error(
          "Failed to update job: Empty or invalid response from the server."
        );
      } else {
        toast.error("Failed to update job: " + error.message);
      }
    }
  };

  return (
    <section className="bg-indigo-50">
      <div className="container m-auto max-w-2xl py-24">
        <div className="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0">
          <form onSubmit={submitForm}>
            <h2 className="text-3xl text-green-600 p-5 text-center font-extrabold mb-6">
              Update Job
            </h2>

            {/* Job Type */}
            <div className="mb-4">
              <label
                htmlFor="type"
                className="block text-green-600 font-bold mb-2"
              >
                Job Type
              </label>
              <select
                id="type"
                name="type"
                className="border rounded w-full py-2 px-3"
                required
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Remote">Remote</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            {/* Job Listing Name */}
            <div className="mb-4">
              <label className="block text-green-600 font-bold mb-2">
                Job Listing Name
              </label>
              <input
                type="text"
                id="title"
                name="title"
                className="border rounded w-full py-2 px-3 mb-2"
                placeholder="eg. Beautiful Apartment In Miami"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Description */}
            <div className="mb-4">
              <label
                htmlFor="description"
                className="block text-green-600 font-bold mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                className="border rounded w-full py-2 px-3"
                rows="4"
                placeholder="Add any job duties, expectations, requirements, etc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            {/* Salary */}
            <div className="mb-4">
              <label
                htmlFor="salary"
                className="block text-green-600 font-bold mb-2"
              >
                Salary
              </label>
              <select
                id="salary"
                name="salary"
                className="border rounded w-full py-2 px-3"
                required
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
              >
                <option value="Under 150000">Under 150000</option>
                <option value="150000 - 200000">150000 - 200000</option>
                <option value="200000 - 300000">200000 - 300000</option>
                <option value="300000 - 400000">300000 - 400000</option>
                <option value="400000 - 500000">400000 - 500000</option>
                <option value="500000 - 600000">500000 - 600000</option>
                <option value="600000 - 700000">600000 - 700000</option>
                <option value="700000 - 800000">700000 - 800000</option>
                <option value="800000 - 1000000">800000 - 1000000</option>
                <option value="1000000 - 1200000">1000000 - 1200000</option>
                <option value="Over 1200000">Over 1200000</option>
              </select>
            </div>

            {/* Location */}
            <div className="mb-4">
              <label className="block text-green-600 font-bold mb-2">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                className="border rounded w-full py-2 px-3 mb-2"
                placeholder="Company Location"
                required
                value={locationField}
                onChange={(e) => setLocationField(e.target.value)}
              />
            </div>

            <h3 className="text-2xl mb-5 font-extrabold text-center text-green-700">
              Company Info
            </h3>

            {/* Company Name */}
            <div className="mb-4">
              <label
                htmlFor="company"
                className="block text-green-600 font-bold mb-2"
              >
                Company Name
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                className="border rounded w-full py-2 px-3 mb-2"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>

            {/* Company Description */}
            <div className="mb-4">
              <label
                htmlFor="companyDescription"
                className="block text-green-600 font-bold mb-2"
              >
                Company Description
              </label>
              <textarea
                id="companyDescription"
                name="companyDescription"
                className="border rounded w-full py-2 px-3 mb-2"
                required
                value={companyDescription}
                onChange={(e) => setCompanyDescription(e.target.value)}
              ></textarea>
            </div>

            {/* Contact Email */}
            <div className="mb-4">
              <label
                htmlFor="contactEmail"
                className="block text-green-600 font-bold mb-2"
              >
                Contact Email
              </label>
              <input
                type="email"
                id="contactEmail"
                name="contactEmail"
                className="border rounded w-full py-2 px-3 mb-2"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
              />
            </div>

            {/* Contact Phone */}
            <div className="mb-4">
              <label
                htmlFor="contactPhone"
                className="block text-green-600 font-bold mb-2"
              >
                Contact Phone
              </label>
              <input
                type="text"
                id="contactPhone"
                name="contactPhone"
                className="border rounded w-full py-2 px-3 mb-2"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white py-2 rounded"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default EditJobPage;

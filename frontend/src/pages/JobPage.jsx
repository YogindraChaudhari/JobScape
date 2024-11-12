import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaMapMarker } from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const JobPage = () => {
  const { id } = useParams(); // Extract job ID from URL
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const VITE_API_URL = import.meta.env.VITE_API_URL;

  // Fetch job details when component mounts or ID changes
  useEffect(() => {
    const fetchJob = async () => {
      try {
        // const res = await fetch(`http://localhost:5000/api/jobs/${id}`);
        const res = await fetch(`${VITE_API_URL}/api/jobs/${id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch job details");
        }
        const data = await res.json();
        setJob(data); // Set the job details to state
      } catch (error) {
        console.error("Error fetching job data:", error);
        toast.error("Failed to load job details");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]); // Run the effect again if the job ID changes

  // Function to handle job deletion
  const onDeleteClick = async (jobId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job listing?"
    );

    if (!confirmDelete) return;

    try {
      // API call to delete the job
      // const res = await fetch(`http://localhost:5000/api/jobs/${jobId}`, {
      const res = await fetch(`${VITE_API_URL}/api/jobs/${jobId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Failed to delete the job");
      }
      toast.success("Job deleted successfully");
      navigate("/jobs"); // Redirect to job listings page after deletion
    } catch (error) {
      console.error("Error deleting job:", error);
      toast.error("Failed to delete job");
    }
  };

  // Display loading or error messages if needed
  if (loading) {
    return (
      <div className="text-center font-bold text-blue-500 p-12">Loading...</div>
    ); // Show a loading state while fetching the job
  }

  if (!job) {
    return <div>Job not found</div>; // Show an error message if the job is not found
  }

  return (
    <>
      <section>
        <div className="container m-auto py-6 px-6">
          <Link
            to="/jobs"
            className="font-bold text-blue-500 hover:text-blue-600 flex items-center"
          >
            <FaArrowLeft className="mr-2" /> Back to Job Listings
          </Link>
        </div>
      </section>

      <section className="bg-indigo-50">
        <div className="container m-auto py-10 px-6">
          <div className="grid grid-cols-1 md:grid-cols-70/30 w-full gap-6">
            <main>
              <div className="bg-white p-6 rounded-2xl shadow-md text-center md:text-left">
                <div className="text-gray-500 mb-4">{job.type}</div>
                <h1 className="text-3xl font-bold mb-4">{job.title}</h1>
                <div className="text-gray-500 mb-4 flex align-middle justify-center md:justify-start">
                  {/* <FaMapMarker className="text-orange-700 mr-1" /> */}
                  <p className="text-orange-700">📍{job.location}</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-md mt-6">
                <h3 className="text-green-600 text-lg font-bold mb-6">
                  Job Description
                </h3>

                <p className="mb-4 text-justify font-gray-700">
                  {job.description}
                </p>

                <h3 className="text-green-600 text-lg font-bold mb-2">
                  Salary
                </h3>

                <p className="mb-4">Rs. {job.salary} / Year</p>
              </div>
            </main>

            {/* Sidebar */}
            <aside>
              <div className="bg-white p-6 rounded-2xl shadow-md">
                <h3 className="text-xl font-bold text-green-600 mb-6">
                  Company Info
                </h3>

                <h2 className="text-2xl">{job.company.name}</h2>

                <p className="my-2">{job.company.description}</p>

                <hr className="my-4" />

                <h3 className="text-xl">Contact Email:</h3>

                <p className="my-2 bg-green-100 p-2 font-bold">
                  {job.company.contactEmail}
                </p>

                <h3 className="text-xl">Contact Phone:</h3>

                <p className="my-2 bg-green-100 p-2 font-bold">
                  {job.company.contactPhone}
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-md mt-6">
                <h3 className="text-xl font-bold mb-6 text-green-600">
                  Manage Job
                </h3>
                <Link
                  to={`/edit-job/${id}`}
                  state={{ job }}
                  className="bg-black hover:bg-gray-800 text-white text-center font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline mt-4 block"
                >
                  Edit Job
                </Link>
                <button
                  onClick={() => onDeleteClick(job._id)} // Pass the correct job ID
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline mt-4 block"
                >
                  Delete Job
                </button>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
};

export default JobPage;

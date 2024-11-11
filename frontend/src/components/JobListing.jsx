import { useState } from "react";
import { FaMapMarker } from "react-icons/fa";
import { Link } from "react-router-dom";

const JobListing = ({ job }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Confirm job data
  console.log(job);

  // Show a truncated version of the job description
  let description = job.description || "";
  if (!showFullDescription && description.length > 90) {
    description = description.substring(0, 90) + "...";
  }

  return (
    <div className="bg-white rounded-3xl shadow-md relative overflow-hidden">
      <div className="p-6">
        <div className="mb-6">
          <div className="text-gray-600 my-2">{job.type}</div>
          <h3 className="text-2xl font-semibold text-gray-800">{job.title}</h3>
          <h4 className="text-md font-mono text-gray-500 mt-2 pl-3">
            {job.company.name}
          </h4>
        </div>

        <div className="mb-5 text-pretty text-gray-700">{description}</div>

        <button
          onClick={() => setShowFullDescription((prevState) => !prevState)}
          className="text-blue-600 hover:text-blue-700 mb-5"
        >
          {showFullDescription ? "Less" : "More"}
        </button>

        <h3 className="text-green-600 font-semibold mb-2">
          {job.salary
            ? `Rs. ${job.salary.toLocaleString()}`
            : "Salary not specified"}{" "}
          / Year
        </h3>

        <div className="border border-blue-200 mb-5"></div>

        <div className="flex flex-col lg:flex-row justify-between items-center mb-4">
          <div className="text-gray-800 flex items-center mb-3">
            {/* <FaMapMarker className="text-red-600 inline text-lg mb-1 mr-2" /> */}
            <span>📍{job.location || "Location not specified"}</span>
          </div>

          <Link
            to={`/jobs/${job._id}`}
            className="h-[36px]  bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white px-4 py-2 rounded-lg text-center text-sm transition duration-300"
          >
            Read More
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JobListing;

import { useSelector } from "react-redux";
import JobListing from "./JobListing";
import Spinner from "./Spinner";

const JobListings = ({ isHome = false }) => {
  const { jobs = [], loading } = useSelector((state) => state.jobs);

  const jobList = Array.isArray(jobs) ? jobs : [];

  const displayedJobs = isHome ? jobList.slice(0, 3) : jobList;

  return (
    <section className="bg-gray-100 px-4 py-10">
      <div className="container-xl lg:container m-auto">
        <h2 className="text-3xl font-bold text-green-800 mb-6 text-center">
          {isHome ? "Recent Jobs" : "Browse Jobs"}
        </h2>

        {loading ? (
          <Spinner loading={loading} />
        ) : displayedJobs.length === 0 ? (
          <p className="text-center text-gray-500 text-lg py-10">
            No jobs found. Try adjusting your search.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayedJobs.map((job) => (
              <JobListing key={job._id} job={job} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default JobListings;

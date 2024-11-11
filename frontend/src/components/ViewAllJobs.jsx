import { Link } from "react-router-dom";

const ViewAllJobs = () => {
  return (
    <>
      <section className="m-auto max-w-lg my-10 px-6">
        <Link
          to="/jobs"
          className="block font-bold bg-gradient-to-r from-blue-500 to-green-500 text-white text-center py-4 px-6 rounded-xl hover:bg-gradient-to-r hover:from-blue-600 hover:to-green-600"
        >
          View All Jobs
        </Link>
      </section>
    </>
  );
};

export default ViewAllJobs;

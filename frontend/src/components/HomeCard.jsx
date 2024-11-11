import { Link } from "react-router-dom";
import Card from "./Card";

const HomeCard = () => {
  return (
    <>
      <section className="py-4">
        <div className="container-xl lg:container m-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg">
            <Card>
              <h2 className="text-2xl font-bold">For Developers</h2>
              <p className="mt-2 mb-4">
                Browse our React jobs and start your career today
              </p>
              <Link
                to="/jobs"
                className="inline-block font-bold bg-black text-white rounded-lg px-4 py-2 hover:bg-green-600 hover:text-white"
              >
                Browse Jobs
              </Link>
            </Card>
            <Card bg="bg-gray-900">
              <h2 className="text-2xl font-bold text-white">For Employers</h2>
              <p className="mt-2 mb-4 text-white">
                List your job to find the perfect developer for the role
              </p>
              <Link
                to="/add-job"
                className="inline-block font-bold bg-green-100 text-gray-800 rounded-lg px-4 py-2 hover:bg-white hover:text-black"
              >
                Add Job
              </Link>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomeCard;

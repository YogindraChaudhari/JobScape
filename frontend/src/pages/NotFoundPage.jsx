import { Link } from "react-router-dom";
import { RiHome4Line, RiSearchLine } from "react-icons/ri";

const NotFoundPage = () => (
  <section className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
    <div className="text-center max-w-md">
      <div className="relative mb-8">
        <div className="text-[10rem] font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-200 to-emerald-200 leading-none select-none">
          404
        </div>
      </div>

      <h1 className="text-3xl font-extrabold text-gray-900 mb-3">Page not found</h1>
      <p className="text-gray-500 text-lg mb-8 leading-relaxed">
        Oops! The page you are looking for doesn't exist or has been moved.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white font-bold px-7 py-3.5 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
        >
          <RiHome4Line /> Go Home
        </Link>
        <Link
          to="/jobs"
          className="inline-flex items-center justify-center gap-2 border border-gray-200 text-gray-600 hover:bg-gray-100 font-semibold px-7 py-3.5 rounded-xl transition-all duration-200"
        >
          <RiSearchLine /> Browse Jobs
        </Link>
      </div>
    </div>
  </section>
);

export default NotFoundPage;

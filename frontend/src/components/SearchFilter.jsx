import { useState } from "react";
import { RiSearchLine, RiMapPinLine, RiFilterLine, RiCloseLine } from "react-icons/ri";

const SearchFilter = ({ onSearch }) => {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ search, type, location });
  };

  const handleClear = () => {
    setSearch(""); setType(""); setLocation("");
    onSearch({ search: "", type: "", location: "" });
  };

  const hasFilters = search || type || location;

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <RiFilterLine className="text-blue-500 text-lg" />
        <h3 className="font-semibold text-gray-700 text-sm">Filter Jobs</h3>
        {hasFilters && (
          <button type="button" onClick={handleClear}
            className="ml-auto flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors font-medium"
          >
            <RiCloseLine /> Clear all
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
        {/* Search */}
        <div className="relative">
          <RiSearchLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none" />
          <input
            type="text"
            placeholder="Job title or company…"
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Job Type */}
        <div>
          <select
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white appearance-none cursor-pointer"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="">All Job Types</option>
            <option value="Full-Time">Full-Time</option>
            <option value="Part-Time">Part-Time</option>
            <option value="Remote">Remote</option>
            <option value="Internship">Internship</option>
            <option value="Contract">Contract</option>
          </select>
        </div>

        {/* Location */}
        <div className="relative">
          <RiMapPinLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none" />
          <input
            type="text"
            placeholder="City or region…"
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white font-bold py-2.5 px-5 rounded-xl transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 text-sm"
        >
          <RiSearchLine className="text-base" /> Search Jobs
        </button>
      </div>
    </form>
  );
};

export default SearchFilter;

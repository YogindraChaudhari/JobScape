import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobs } from "../store/slices/jobSlice";
import JobListings from "../components/JobListings";
import SearchFilter from "../components/SearchFilter";
import Pagination from "../components/Pagination";

const JobsPages = () => {
  const dispatch = useDispatch();
  const { page, totalPages } = useSelector((state) => state.jobs);
  const [filters, setFilters] = useState({});

  const loadJobs = useCallback(
    (pageNum = 1) => {
      dispatch(fetchJobs({ ...filters, page: pageNum, _limit: 9 }));
    },
    [dispatch, filters]
  );

  useEffect(() => {
    loadJobs(1);
  }, [loadJobs]);

  const handleSearch = (newFilters) => {
    setFilters(newFilters);
  };

  const handlePageChange = (newPage) => {
    loadJobs(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="bg-blue-50 px-4 py-6">
      <div className="container-xl lg:container m-auto">
        <SearchFilter onSearch={handleSearch} />
        <JobListings />
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </section>
  );
};

export default JobsPages;

import { useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobs } from "../store/slices/jobSlice";
import { setSearchFilters, clearSearchFilters } from "../store/slices/uiSlice";
import { selectSearchFilters } from "../store/selectors";
import JobListings from "../components/JobListings";
import SearchFilter from "../components/SearchFilter";
import Pagination from "../components/Pagination";

const JobsPages = () => {
  const dispatch = useDispatch();
  const { page, totalPages } = useSelector((state) => state.jobs);
  const filters = useSelector(selectSearchFilters);
  const abortRef = useRef(null);

  const loadJobs = useCallback(
    (pageNum = 1) => {
      // Cancel previous in-flight request
      if (abortRef.current) {
        abortRef.current.abort();
      }
      const promise = dispatch(
        fetchJobs({ ...filters, page: pageNum, _limit: 9 })
      );
      abortRef.current = promise;
    },
    [dispatch, filters]
  );

  useEffect(() => {
    loadJobs(1);
    return () => {
      // Cleanup: abort on unmount
      if (abortRef.current) {
        abortRef.current.abort();
      }
    };
  }, [loadJobs]);

  const handleSearch = useCallback(
    (newFilters) => {
      dispatch(setSearchFilters(newFilters));
    },
    [dispatch]
  );

  const handleClear = useCallback(() => {
    dispatch(clearSearchFilters());
  }, [dispatch]);

  const handlePageChange = useCallback(
    (newPage) => {
      loadJobs(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [loadJobs]
  );

  return (
    <section className="bg-blue-50 px-4 py-6">
      <div className="container-xl lg:container m-auto">
        <SearchFilter
          onSearch={handleSearch}
          onClear={handleClear}
          initialFilters={filters}
        />
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

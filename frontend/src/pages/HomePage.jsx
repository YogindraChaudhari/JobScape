import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchJobs } from "../store/slices/jobSlice";
import Hero from "../components/Hero";
import HomeCards from "../components/HomeCard";
import JobListings from "../components/JobListings";
import ViewAllJobs from "../components/ViewAllJobs";

const HomePage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchJobs({ _limit: 3 }));
  }, [dispatch]);

  return (
    <>
      <Hero />
      <HomeCards />
      <JobListings isHome={true} />
      <ViewAllJobs />
    </>
  );
};

export default HomePage;

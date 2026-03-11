import { lazy, Suspense } from "react";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import {
  HomeShimmer,
  JobsShimmer,
  JobDetailsShimmer,
  FormShimmer,
  ProfileShimmer,
  DashboardShimmer
} from "./components/Shimmers";

// Lazy-loaded pages for code splitting
const HomePage = lazy(() => import("./pages/HomePage"));
const JobsPages = lazy(() => import("./pages/JobsPages"));
const JobPage = lazy(() => import("./pages/JobPage"));
const AddJobPage = lazy(() => import("./pages/AddJobPage"));
const EditJobPage = lazy(() => import("./pages/EditJobPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

const LazyWrapper = ({ children, fallback }) => (
  <Suspense
    fallback={fallback || <JobsShimmer />}
  >
    {children}
  </Suspense>
);

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<MainLayout />}>
        <Route
          index
          element={
            <LazyWrapper fallback={<HomeShimmer />}>
              <HomePage />
            </LazyWrapper>
          }
        />
        <Route
          path="/jobs"
          element={
            <LazyWrapper fallback={<JobsShimmer />}>
              <JobsPages />
            </LazyWrapper>
          }
        />
        <Route
          path="/jobs/:id"
          element={
            <LazyWrapper fallback={<JobDetailsShimmer />}>
              <JobPage />
            </LazyWrapper>
          }
        />
        <Route
          path="/add-job"
          element={
            <LazyWrapper fallback={<FormShimmer />}>
              <AddJobPage />
            </LazyWrapper>
          }
        />
        <Route
          path="/edit-job/:jobId"
          element={
            <LazyWrapper fallback={<FormShimmer />}>
              <EditJobPage />
            </LazyWrapper>
          }
        />
        <Route
          path="/login"
          element={
            <LazyWrapper fallback={<FormShimmer />}>
              <LoginPage />
            </LazyWrapper>
          }
        />
        <Route
          path="/register"
          element={
            <LazyWrapper fallback={<FormShimmer />}>
              <RegisterPage />
            </LazyWrapper>
          }
        />
        <Route
          path="/dashboard"
          element={
            <LazyWrapper fallback={<DashboardShimmer />}>
              <DashboardPage />
            </LazyWrapper>
          }
        />
        <Route
          path="/profile"
          element={
            <LazyWrapper fallback={<ProfileShimmer />}>
              <ProfilePage />
            </LazyWrapper>
          }
        />
        <Route
          path="*"
          element={
            <LazyWrapper fallback={<FormShimmer />}>
              <NotFoundPage />
            </LazyWrapper>
          }
        />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};

export default App;

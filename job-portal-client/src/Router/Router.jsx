import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import About from "../pages/About";
import CreateJob from "../pages/CreateJob";
import MyJobs from "../pages/MyJobs";
import SalaryPage from "../pages/SalaryPage";
import UpdateJob from "../pages/UpdateJob";
import Login from "../pages/Login";
import JobDetails from "../pages/JobDetails";
import Signup from "../pages/Signup";
import ErrorPage from "../pages/ErrorPage";
import RoleSelection from "../pages/RoleSelection";
import { jobsApi } from "../api/jobsApi";
import ProtectedRoute from "../components/ProtectedRoute";
import { USER_ROLES } from "../utils/roles";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/about", element: <About /> },
      {
        path: "/select-role",
        element: (
          <ProtectedRoute requireRole={false}>
            <RoleSelection />
          </ProtectedRoute>
        ),
      },
      {
        path: "/post-job",
        element: (
          <ProtectedRoute allowedRoles={[USER_ROLES.JOB_PROVIDER]}>
            <CreateJob />
          </ProtectedRoute>
        ),
      },
      {
        path: "/my-job",
        element: (
          <ProtectedRoute allowedRoles={[USER_ROLES.JOB_PROVIDER]}>
            <MyJobs />
          </ProtectedRoute>
        ),
      },
      {
        path: "/salary",
        element: <SalaryPage />,
      },
      {
        path: "/edit-job/:id",
        element: (
          <ProtectedRoute allowedRoles={[USER_ROLES.JOB_PROVIDER]}>
            <UpdateJob />
          </ProtectedRoute>
        ),
        loader: ({ params }) => jobsApi.getById(params.id),
      },
      {
        path: "/job/:id",
        element: <JobDetails />,
      },
      {
        path: "*",
        element: <ErrorPage />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/sign-up",
    element: <Signup />,
    errorElement: <ErrorPage />,
  },
]);

export default router;
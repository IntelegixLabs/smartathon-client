import { createBrowserRouter, Navigate } from "react-router-dom";
import DefaultLayout from "./components/DefaultLayout.jsx";
import GuestLayout from "./components/GuestLayout.jsx";

import Login from "./views/Login.jsx";
import Home from "./views/Home.jsx";
import Error404 from "./views/Error404.jsx";

import Dashboard from "./views/Dashboard.jsx";
import Pollutions from "./views/Pollutions.jsx";
import Pollution from "./views/Pollution.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
      {
        path: "/",
        element: <Navigate to="/dashboard" />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/pollutions",
        element: <Pollutions />,
      },
      {
        path: "/pollutions/:pollution_id",
        element: <Pollution key="showPollution" />,
      },
    ],
  },
  {
    path: "/",
    element: <GuestLayout />,
    children: [
      {
        path: "/",
        element: <Navigate to="/home" />,
      },
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
  {
    path: "*",
    element: <Error404 />,
  },
]);

export default router;

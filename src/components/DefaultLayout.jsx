import { Fragment } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";
import AdminNavbar from "../components/AdminNavbar";

export default function DefaultLayout() {
  const { user, token } = useStateContext();

  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <Fragment>
      <AdminNavbar />
      <Outlet />
    </Fragment>
  );
}

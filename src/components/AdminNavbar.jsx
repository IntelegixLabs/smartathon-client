import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import Api from "../lib/Api/Api";
import { useStateContext } from "../context/ContextProvider";

export default function AdminNavbar() {
  const { setToken } = useStateContext();

  const logout = async (e) => {
    e.preventDefault();

    await Api.post("/auth/logout").then((res) => {
      localStorage.removeItem("ACCESS_TOKEN");
      setToken(null);
    });
  };

  return (
    <Fragment>
      <nav className="admin__navbar navbar navbar-expand-lg sticky-top bg-body-tertiary">
        <div className="container">
          <Link className="navbar-brand" to="/">
            <img
              className="img-fluid"
              alt="logo"
              style={{ maxHeight: "36px", maxWidth: "36px" }}
              src="/images/site/logo.png"
            />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" aria-current="page" to="/dashboard">
                  Dashboard
                </Link>
              </li>
            </ul>
            <form className="d-flex">
              <button className="btn btn-danger" onClick={logout}>
                <i className="fa-solid fa-power-off fa-fw"></i> Logout
              </button>
            </form>
          </div>
        </div>
      </nav>
    </Fragment>
  );
}

import { useState } from "react";
import axios from "axios";
import { useStateContext } from "../context/ContextProvider.jsx";

export default function Login() {
  const { setUser, setToken } = useStateContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, showLoginErrorMessage] = useState(false);

  const handleInputChange = (e) => {
    const fieldName = e.target.name;

    if (fieldName === "email") {
      setEmail(e.target.value);
    }

    if (fieldName === "password") {
      setPassword(e.target.value);
    }

    showLoginErrorMessage(false);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      showLoginErrorMessage(true);
      return;
    }

    const payload = {
      email: email,
      password: password,
    };

    await axios
      .post(process.env.REACT_APP_API_URL + "/auth/login", payload)
      .then((response) => {
        const userData = {
          first_name: response.data.data.first_name,
          last_name: response.data.data.last_name,
          email: response.data.data.email,
        };

        setUser(userData);
        setToken(response.data.data.token);
      })
      .catch((error) => showLoginErrorMessage(true));

    return;
  };

  return (
    <div
      className="container-fluid">
      <div
      style={{
        backgroundImage: "url('images/site/bg-img.png')",
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        width: "100%",
        height: "100vh",
        opacity: "0.1",
        position: "absolute",
        left: "0"
      }}
    ></div>
      <div className="container" style={{ opacity: "" }}>
        <div className="row">
          <div className="col-md-4 offset-md-4">
            <div className="card card-body mt-5">
              <img className="img-fluid" style={{ maxHeight: "64px", maxWidth: "64px" }} src="/images/site/logo.png" />
              <h3 className="mt-2">Sign In</h3>
              <p className="text-muted">for Administrator</p>
              {loginError ? (
                <p className="alert alert-danger text-center">
                  Wrong email or password
                </p>
              ) : null}
              <label htmlFor="email" className="form-label mt-2">
                Email:
              </label>
              <input
                type="text"
                name="email"
                id="email"
                className="form-control"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => handleInputChange(e)}
              />
              <label htmlFor="password" className="form-label mt-3">
                Password:
              </label>
              <input
                type="password"
                name="password"
                id="password"
                className="form-control"
                placeholder="Enter Password"
                onChange={(e) => handleInputChange(e)}
              />
              <div className="d-grid mt-4">
                <button className="btn btn-info py-3" onClick={onSubmit}>
                  Sign In{" "}
                  <i className="fa-solid fa-arrow-right-long fa-fw ms-2"></i>
                </button>
              </div>
            </div>
            <p className="text-muted text-sm mt-3">
              &copy; {process.env.REACT_APP_NAME} 2022
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

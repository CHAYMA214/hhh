import React, { useRef, useState } from "react";
import "./register-login.css";
import { Alert } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate,useLocation } from "react-router-dom";
import logo1 from "./habit-tracker-gif-looponce.gif";
function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = location.state?.path || "/";
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      navigate("/Dashboard");
    } catch {
      setError("Failed to log in");
      console.error(error); 
      setError(error.message || "Failed to log in");
    }

    setLoading(false);
  }
  const [passwordVisible, setPasswordVisible] = useState(false);

const togglePasswordVisibility = () => {
  setPasswordVisible((prev) => !prev);
};

return (
  <div class="loginmainContainer">
    <div className="loginmainBody">
      <img id="logo" src={logo1} alt="Habit tracker gif" />
      <h1>Welcome Back.</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        <input type="text" id="username" name="username" required ref={emailRef} />

        <label htmlFor="password">Password:</label>
        <p>
          <input
            type={passwordVisible ? "text" : "password"}
            name="password"
            id="password"
            required
            ref={passwordRef}
          />
          <i
            className={passwordVisible ? "fas fa-eye-slash" : "fas fa-eye"} 
            id="togglePassword"
            style={{ marginLeft: '-30px', cursor: 'pointer' }}
            onClick={togglePasswordVisibility}
          ></i>
        </p>

        <input
          disabled={loading}
          type="submit"
          id="loginButton"
          name="loginButton"
          value="Login"
        />
      </form>
      <p className="loginlink">
        Don't have an account? <Link to="/Registre">Register here</Link>
      </p>
      <p className="loginlink">
      Forgot Password?<Link to="/forgotpassword">Rest</Link>
      </p>
    </div>
  </div>
);
}
export default Login;

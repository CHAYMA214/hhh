import { React, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import logo1 from "./habit-tracker-gif-looponce.gif";
import "./register-login.css";
export default function ForgotPassword() {
  const emailRef = useRef();
  const { resetPassword } = useAuth();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setMessage("");
      setError("");
      setLoading(true);
      await resetPassword(emailRef.current.value);
      setMessage("Check your inbox for further instructions");
    } catch {
      setError("Failed to reset password");
    }

    setLoading(false);
  }
  return (
    <div className="loginmainContainer">
    <div className="loginmainBody">
      <img className="logo" src={logo1} alt="Habit tracker gif" />
      <h1>Reset Password.</h1>
          {error && <Alert variant="danger">{error}</Alert>}
          {message && <Alert variant="success">{message}</Alert>}
          <form onSubmit={handleSubmit}>
        <label htmlFor="Email">Email:</label>
        <input type="text" id="Email" name="Email" ref={emailRef} required />
        <input
          disabled={loading}
          type="submit"
          id="loginButton"
          name="loginButton"
          value="Rest"
        />
</form>
          <div>
            <label htmlFor="text">have an account?:</label>
            <Link to="/login">Login</Link>

      </div>  
      </div>  
      </div> 

  );
}
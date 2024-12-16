import React, { useRef, useState } from "react";
import { Alert } from "react-bootstrap";
import "./register-login.css";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import logo1 from "./habit-tracker-gif-looponce.gif";
import "./register-login.css";

export default function Registre() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { signup } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match");
    }

    try {
      setError("");
      setLoading(true); 
      await signup(emailRef.current.value, passwordRef.current.value);
      navigate("/completedonner");
    } catch (error) {
      setError("Failed to create an account");
      console.error(error); 
      setError(error.message || "Failed to create an account"); 

    }
    setLoading(false);
  }

  return (
    <div className="loginmainContainer">
      <div className="loginmainBody">
        <img className="logo" src={logo1} alt="Habit tracker gif" />
        <h1>Register new account</h1>
        {error && <Alert variant="danger">{error}</Alert>}
        <form id="registerForm" onSubmit={handleSubmit}>
          <label htmlFor="username">Username:</label>
          <input type="text" id="email" name="email" required ref={emailRef} />
          <label htmlFor="password">Password:</label>
          <p>
            <input
              type={showPassword ? "text" : "password"} // Toggle pour afficher/masquer le mot de passe
              name="password"
              id="password"
              required
              ref={passwordRef}
            />
            <i
              className="far fa-eye"
              id="togglePassword1"
              style={{ marginLeft: "-30px", cursor: "pointer" }}
              onClick={() => setShowPassword((prev) => !prev)} // Basculer la visibilité du mot de passe
            ></i>
          </p>
          <span id="passwordMessage"></span>

          <label htmlFor="confirmPassword">Confirm Password:</label>
          <p>
            <input
              type={showPasswordConfirm ? "text" : "password"} // Toggle pour afficher/masquer la confirmation du mot de passe
              name="confirmPassword"
              id="confirmPassword"
              required
              ref={passwordConfirmRef}
            />
            <i
              className="far fa-eye"
              id="togglePassword2"
              style={{ marginLeft: "-30px", cursor: "pointer" }}
              onClick={() => setShowPasswordConfirm((prev) => !prev)}
            ></i>
          </p>
          <span id="passwordConfirmMessage"></span>

          <input disabled={loading} type="submit" id="registerButton" name="registerButton" value="Register" />
        </form>
        <p className="loginlink">
          Already have an account?<Link to="/login"> login here</Link>
        </p>
      </div>
    </div>
  );
}

import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import React, { useState, useMemo, useRef } from "react";
import { Alert } from "react-bootstrap";
import logo1 from "./habit-tracker-gif-looponce.gif";
import "./register-login.css";
import Select from "react-select";
import countryList from "react-select-country-list";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../fireba/firebase";
export default function Complete() {
const { currentUser } = useAuth(); 
const [value, setValue] = useState('');
    const options = useMemo(() => countryList().getData(), []);
    const changeHandler = value => {
      setValue(value);}
    const nameRef = useRef();
    const ageref = useRef();
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [loader, setLoader] = useState(false);
    
async function handleSubmit(e) {
  e.preventDefault();
  try {
    setError(""); 
    setLoader(true); 

    const id = currentUser.uid; 
    const userRef = doc(db, "users", id);
    await setDoc(userRef, {
      name: nameRef.current.value,
      country: value.label,
      age: ageref.current.value,
    });
    navigate("/Dashboard", {
      state: {
        name: nameRef.current.value,
        country: value.label,
        age: ageref.current.value,
      },
    });
  } catch (error) {
    setError("Failed to save user data");
  } finally {
    setLoader(false);
  }
}
  return (
    <div className="loginmainContainer">
      <div className="loginmainBody">
        <img className="logo" src={logo1} alt="Habit tracker gif" />
        <h1>Please complete registration</h1>
        {error && <Alert variant="danger">{error}</Alert>}
        <form id="registerForm" onSubmit={handleSubmit}>
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" required ref={nameRef} />
          <label htmlFor="country">Country:</label>
          <Select options={options} value={value} onChange={changeHandler} />
          <label htmlFor="age">Age:</label>
          <input type="number" id="age" name="age" required ref={ageref} />
          <input
            disabled={loader}
            type="submit"
            id="registerButton"
            name="registerButton"
            value="Complete"
          />
        </form>
      </div>
    </div>
  );
}

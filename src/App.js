import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import  AuthProvider  from "./context/AuthContext"; 
import Home from "./home/home";
import Registre from "./login&register/Registre";
import Login from "./login&register/login";
import Dashboard from "./dashboard/Dashboard"; 
import Setting from "./setting/setting"; 
import ForgotPassword from "./login&register/forgotpassword"; 
import Challenge from "./challenge/challenges"; 
import Habit from "./yourhabit/yourhabits"; 
import Friend from "./friend/friends";
import Complete from "./login&register/completedonner";
//import Calendar from "./dashboard/apt";
const App = () => {
  return (
    <AuthProvider> 
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registre" element={<Registre />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/Setting" element={<Setting />} />
          <Route path="/ForgotPassword" element={<ForgotPassword />} />
          <Route path="/challenges" element={<Challenge />} />
          <Route path="/yourhabits" element={<Habit />} />
          <Route path="/friends" element={<Friend />} />
          <Route path="/completedonner" element={<Complete />} />
          </Routes>
      </Router>
    </AuthProvider>
  );
};
export default App;

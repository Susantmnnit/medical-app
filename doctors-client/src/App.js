import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navheader from "./comp/Navheader";
import Login from "./comp/Login";
import Doctors from "./comp/Doctors";
import Home from "./comp/Home";
import Userprofile from "./comp/Userprofile";
import DoctorsProfile from "./comp/DoctorsProfile";
import "./App.css";
import Doctorlogin from "./comp/Doctorlogin";

function App() {
  const user = localStorage.getItem("Data")
    ? JSON.parse(localStorage.getItem("Data"))
    : null;

  return (
    <div>
      <Navheader />
      <div style={{ marginTop: "60px", backgroundColor: "white" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/doctorlogin" element={<Doctorlogin />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/userprofile" element={<Userprofile />} />
          <Route
            path="/doctorsprofile/:doctor_id"
            element={<DoctorsProfile />}
          />
          <Route
            path="*"
            element={<Navigate to={user ? "/doctors" : "/login"} replace />}
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;

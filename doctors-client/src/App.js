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
import Patients from "./comp/Patients";
import Zoom from "./comp/Zoom";
import JoinConference from "./comp/Joinconference";
import HelpCenter from "./comp/Help";
import { useSelector } from "react-redux";
import Allapointments from "./comp/Allapointments";

function App() {
  const token = localStorage.getItem("token");
  // console.log(token);
  const isAuthenticatedPatients = useSelector(
    (state) => state.patients.token !== null
  );
  const isAuthenticatedDoctors = useSelector(
    (state) => state.doctors.token !== null
  );
  const isAuthenticated = isAuthenticatedPatients || isAuthenticatedDoctors;

  return (
    <div>
      <Navheader />
      <div style={{ marginTop: "60px", backgroundColor: "white" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          {!isAuthenticated && (
            <>
              <Route path="/patientlogin" element={<Login />} />
              <Route path="/helpcentre" element={<HelpCenter />} />
              <Route path="/doctorlogin" element={<Doctorlogin />} />
            </>
          )}
          <Route
            path="/doctors"
            element={isAuthenticatedPatients && <Doctors />}
          />
          <Route
            path="/userprofile"
            element={isAuthenticatedPatients && <Userprofile />}
          />
          <Route
            path="/patients/:doctor_id"
            element={isAuthenticatedDoctors && <Patients />}
          />
          <Route
            path="/joinconference/:conference_id"
            element={isAuthenticated && <JoinConference />}
          />
          <Route
            path="/doctorsprofile/:doctor_id"
            element={isAuthenticated && <DoctorsProfile />}
          />
          <Route
            path="/allapointments"
            element={isAuthenticatedPatients && <Allapointments />}
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;

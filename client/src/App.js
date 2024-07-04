import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import Database from "./components/Database";
import Campaigns from "./components/Campaigns";
import CRM from "./components/CRM";
import VerifyEmail from "./components/VerifyEmail";

const App = () => {
  console.log("###########", process.env.REACT_APP_SERVER_URI);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify" element={<VerifyEmail />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/database" element={<Database />} />
        <Route path="/campaigns" element={<Campaigns />} />
        <Route path="/crm" element={<CRM />} />
      </Routes>
    </Router>
  );
};

export default App;

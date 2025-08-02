import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import EmployerDashboard from './pages/EmployerDashboard';
import ApplicantDashboard from './pages/ApplicantDashboard.js';
import PostJob from './pages/PostJob';
import EmployersInfo from './pages/EmployersInfo';
import ApplicantsInfo from './pages/ApplicantsInfo';
import AdminsInfo from './pages/AdminsInfo';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 
function App() {
  return (
    <Router>
      <div className="container py-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/employer" element={<EmployerDashboard />} />
          <Route path="/applicant" element={<ApplicantDashboard />} />
          <Route path="/post-job" element={<PostJob />} />
          <Route path="/info/employers" element={<EmployersInfo />} />
          <Route path="/info/applicants" element={<ApplicantsInfo />} />
          <Route path="/info/admins" element={<AdminsInfo />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;

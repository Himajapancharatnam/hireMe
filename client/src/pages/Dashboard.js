import React from 'react';
import { jwtDecode } from 'jwt-decode';

import AdminDashboard from './AdminDashboard';
import EmployerDashboard from './EmployerDashboard';
import ApplicantDashboard from './ApplicantDashboard.js';

const Dashboard = () => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <p>Please login to access the dashboard.</p>;
  }

  try {
    const decoded = jwtDecode(token);
    const role = decoded.role?.toLowerCase(); // Normalize role

    if (role === 'admin') {
      return <AdminDashboard />;
    } else if (role === 'employer') {
      return <EmployerDashboard />;
    } else if (role === 'applicant') {
      return <ApplicantDashboard />;
    } else {
      return <p>Invalid role.</p>;
    }
  } catch (err) {
    return <p>Invalid token. Please login again.</p>;
  }
};

export default Dashboard;

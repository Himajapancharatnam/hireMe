import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to HireMe</h1>
      <p className="home-subtitle">A modern job portal for Admins, Employers, and Applicants</p>

      <div className="role-section">
        <Link to="/info/employers" className="text-decoration-none">
          <div className="role-card role-employer">
            <div className="role-title">Employers</div>
            <div className="role-description">
              Post jobs, manage listings, and hire top talent with ease.
            </div>
          </div>
        </Link>

        <Link to="/info/applicants" className="text-decoration-none">
          <div className="role-card role-applicant">
            <div className="role-title">Applicants</div>
            <div className="role-description">
              Browse job listings and apply to your dream jobs.
            </div>
          </div>
        </Link>

        <Link to="/info/admins" className="text-decoration-none">
          <div className="role-card role-admin">
            <div className="role-title">Admins</div>
            <div className="role-description">
              Manage users, listings, and oversee the platform.
            </div>
          </div>
        </Link>
      </div>

      <div className="btn-group-home">
        <Link to="/login" className="btn btn-primary btn-home">Login</Link>
        <Link to="/register" className="btn btn-outline-primary btn-home">Register</Link>
      </div>
    </div>
  );
};

export default Home;

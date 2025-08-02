import React from "react";
import "./InfoPage.css";

const EmployersInfo = () => {
  return (
    <div className="info-page">
      <h1 className="info-title">👔 Employers</h1>
      <p className="info-subtitle">Empower your hiring journey</p>
      <ul className="info-list">
        <li>Post job listings with rich descriptions.</li>
        <li>Manage applications and shortlist top talent.</li>
        <li>Gain insights with applicant analytics.</li>
        <li>Communicate directly with candidates.</li>
      </ul>
      <img src="https://cdn-icons-png.flaticon.com/512/4333/4333609.png" alt="Employer" className="info-image" />
    </div>
  );
};

export default EmployersInfo;

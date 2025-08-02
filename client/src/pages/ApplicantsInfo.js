import React from "react";
import "./InfoPage.css";

const ApplicantsInfo = () => {
  return (
    <div className="info-page">
      <h1 className="info-title">📄 Applicants</h1>
      <p className="info-subtitle">Find and apply for your dream jobs</p>
      <ul className="info-list">
        <li>Browse and filter job listings.</li>
        <li>One-click apply with resume upload.</li>
        <li>Track your applications in your dashboard.</li>
        <li>Get updates and responses from employers.</li>
      </ul>
      <img src="https://cdn-icons-png.flaticon.com/512/3048/3048391.png" alt="Applicant" className="info-image" />
    </div>
  );
};

export default ApplicantsInfo;

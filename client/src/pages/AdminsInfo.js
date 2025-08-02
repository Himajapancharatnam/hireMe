import React from "react";
import "./InfoPage.css";

const AdminsInfo = () => {
  return (
    <div className="info-page">
      <h1 className="info-title">🛠️ Admins</h1>
      <p className="info-subtitle">Manage the entire platform efficiently</p>
      <ul className="info-list">
        <li>Oversee user activity and roles.</li>
        <li>Approve or reject employer listings.</li>
        <li>Handle reports and support tickets.</li>
        <li>Maintain a safe and secure platform.</li>
      </ul>
      <img src="https://cdn-icons-png.flaticon.com/512/3771/3771355.png" alt="Admin" className="info-image" />
    </div>
  );
};

export default AdminsInfo;

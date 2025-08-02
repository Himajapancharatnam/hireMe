import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    alert('👋 Logged out successfully!');
    navigate('/login');
  };

  return (
    <button onClick={handleLogout} className="btn btn-outline-danger ms-2">
      Logout
    </button>
  );
}

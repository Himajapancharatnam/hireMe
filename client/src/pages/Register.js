import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'applicant' // lowercase to match backend expectations
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:5003/api/auth/register', formData);
      alert('✅ Registered successfully!');
      navigate('/login');
    } catch (error) {
      alert(error.response?.data?.message || '❌ Registration failed');
    }
  };

  return (
    <div className="container col-md-6">
      <h2 className="mb-4">Register</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" onChange={handleChange} className="form-control mb-2" placeholder="Name" required />
        <input name="email" onChange={handleChange} className="form-control mb-2" type="email" placeholder="Email" required />
        <input name="password" onChange={handleChange} className="form-control mb-2" type="password" placeholder="Password" required />
        <select name="role" value={formData.role} onChange={handleChange} className="form-control mb-3">
          <option value="applicant">Applicant</option>
          <option value="employer">Employer</option>
        </select>
        <button className="btn btn-primary w-100">Register</button>
      </form>
    </div>
  );
}

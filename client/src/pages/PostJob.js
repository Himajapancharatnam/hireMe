import React, { useState } from 'react';
import axios from 'axios';

const PostJob = () => {
  const [form, setForm] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post(
        'http://localhost:5003/api/jobs',
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage('Job posted successfully!');
      setForm({ title: '', company: '', location: '', description: '' });
    } catch (err) {
      setMessage(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h2>Post a Job</h2>
        {message && <p className="text-success">{message}</p>}
        <form onSubmit={handleSubmit}>
          <input
            className="form-control mb-2"
            type="text"
            name="title"
            placeholder="Job Title"
            value={form.title}
            onChange={handleChange}
            required
          />
          <input
            className="form-control mb-2"
            type="text"
            name="company"
            placeholder="Company Name"
            value={form.company}
            onChange={handleChange}
            required
          />
          <input
            className="form-control mb-2"
            type="text"
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
            required
          />
          <textarea
            className="form-control mb-3"
            name="description"
            placeholder="Job Description"
            value={form.description}
            onChange={handleChange}
            required
          ></textarea>
          <button type="submit" className="btn btn-primary">Post Job</button>
        </form>
      </div>
    </div>
  );
};

export default PostJob;

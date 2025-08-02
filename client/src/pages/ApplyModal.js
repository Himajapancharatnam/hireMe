import React, { useState } from "react";
import axios from "axios";

const ApplyModal = ({ jobId, onClose }) => {
  const [resume, setResume] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setResume(e.target.files[0]);
    setMessage("");
    setError("");
  };

  const handleApply = async (e) => {
    e.preventDefault();

    if (!resume) {
      setError("Please select a resume to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("jobId", jobId);
    formData.append("resume", resume);

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post("http://localhost:5003/api/applications", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage(res.data.message || "Applied successfully!");
      setError("");
      setResume(null);

      // Optionally auto-close modal after 1s
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to apply. Try again later.");
    }
  };

  return (
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog">
        <form onSubmit={handleApply} className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Apply for Job</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <label htmlFor="resume" className="form-label">
              Upload Resume (.pdf/.doc/.docx)
            </label>
            <input
              type="file"
              className="form-control"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
            />

            {message && <div className="alert alert-success mt-2">{message}</div>}
            {error && <div className="alert alert-danger mt-2">{error}</div>}
          </div>
          <div className="modal-footer">
            <button type="submit" className="btn btn-primary">
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyModal;

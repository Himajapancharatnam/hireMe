import React, { useEffect, useState } from "react";
import axios from "axios";
import LogoutButton from "./LogoutButton";

function EmployerDashboard() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState({});
  const [newJob, setNewJob] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchJobs();
  }, []);

  // Fetch jobs and their applications
  const fetchJobs = async () => {
    try {
      const res = await axios.get("http://localhost:5003/api/employer/jobs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(res.data);

      // Fetch applications for each job
      const allApps = {};
      for (const job of res.data) {
        const appsRes = await axios.get(
          `http://localhost:5003/api/employer/applications/${job._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        allApps[job._id] = appsRes.data;
      }

      setApplications(allApps);
    } catch (err) {
      console.error("Failed to fetch jobs or applications:", err);
    }
  };

  const handleChange = (e) => {
    setNewJob({ ...newJob, [e.target.name]: e.target.value });
  };

  const handleAddJob = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5003/api/employer/jobs", newJob, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ Job posted successfully!");
      setNewJob({ title: "", company: "", location: "", description: "" });
      fetchJobs();
    } catch (err) {
      console.error("Failed to post job:", err);
      alert("❌ Failed to post job.");
    }
  };

  const handleDelete = async (jobId) => {
    try {
      await axios.delete(`http://localhost:5003/api/employer/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("🗑️ Job deleted successfully!");
      fetchJobs();
    } catch (err) {
      console.error("Failed to delete job:", err);
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:5003/api/applications/${appId}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchJobs(); // Refresh after status change
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  return (
    <div className="container mt-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">🏢 Employer Dashboard</h2>
        <LogoutButton />
      </div>

      {/* Job Posting Form */}
      <form onSubmit={handleAddJob} className="card p-4 mb-4 shadow-sm">
        <h4>Add New Job</h4>
        <input
          className="form-control my-2"
          type="text"
          name="title"
          value={newJob.title}
          onChange={handleChange}
          placeholder="Job Title"
          required
        />
        <input
          className="form-control my-2"
          type="text"
          name="company"
          value={newJob.company}
          onChange={handleChange}
          placeholder="Company Name"
          required
        />
        <input
          className="form-control my-2"
          type="text"
          name="location"
          value={newJob.location}
          onChange={handleChange}
          placeholder="Location"
        />
        <textarea
          className="form-control my-2"
          name="description"
          value={newJob.description}
          onChange={handleChange}
          placeholder="Job Description"
          required
        />
        <button className="btn btn-success">Add Job</button>
      </form>

      {/* Job Listings */}
      <h4>Your Job Listings</h4>
      {jobs.length === 0 ? (
        <p className="text-muted">No jobs posted yet.</p>
      ) : (
        <div className="row">
          {jobs.map((job) => (
            <div className="col-md-6" key={job._id}>
              <div className="card mb-3 border-primary">
                <div className="card-body">
                  <h5>{job.title}</h5>
                  <h6 className="text-muted">
                    {job.company} - {job.location}
                  </h6>
                  <p>{job.description}</p>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(job._id)}
                  >
                    Delete
                  </button>

                  {/* Applications Section */}
                  {applications[job._id] && applications[job._id].length > 0 && (
                    <>
                      <hr />
                      <h6>📄 Applications:</h6>
                      {applications[job._id].map((app) => (
                        <div key={app._id} className="border rounded p-2 my-2 bg-light">
                          <p className="mb-1">
                            Applicant ID: <strong>{app.applicantId}</strong>
                          </p>
                          <p className="mb-1">
                            Resume:{" "}
                            <a href={`http://localhost:5003/${app.resume}`} target="_blank" rel="noreferrer">
                              View Resume
                            </a>
                          </p>
                          <div className="d-flex align-items-center">
                            <label className="me-2 mb-0">Status:</label>
                            <select
                              className="form-select form-select-sm w-auto"
                              value={app.status}
                              onChange={(e) => handleStatusChange(app._id, e.target.value)}
                            >
                              <option value="pending">Pending</option>
                              <option value="accepted">Accepted</option>
                              <option value="rejected">Rejected</option>
                            </select>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EmployerDashboard;

// src/pages/ApplicantDashboard.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ApplicationDashboard.css";
import LogoutButton from "./LogoutButton";
import ApplyModal from "./ApplyModal";

function ApplicantDashboard() {
  const [jobs, setJobs] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  const [applicationStatuses, setApplicationStatuses] = useState({});
  const [loading, setLoading] = useState(true);
  const [viewAppliedOnly, setViewAppliedOnly] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchJobsAndApplications = async () => {
      try {
        const [jobsRes, appsRes] = await Promise.all([
          axios.get("http://localhost:5003/api/jobs"),
          axios.get("http://localhost:5003/api/applications/me", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setJobs(jobsRes.data);

        const appliedIds = appsRes.data.map((app) => app.jobId._id);
        setAppliedJobIds(appliedIds);

        const statusMap = {};
        appsRes.data.forEach((app) => {
          statusMap[app.jobId._id] = app.status;
        });
        setApplicationStatuses(statusMap);
      } catch (err) {
        console.error("Failed to fetch jobs or applications", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobsAndApplications();
  }, [token]);

  const toggleView = () => setViewAppliedOnly(!viewAppliedOnly);

  const openModal = (job) => {
    setSelectedJob(job);
    const modal = new window.bootstrap.Modal(document.getElementById("jobDetailsModal"));
    modal.show();
  };

  const openApplyModal = (job) => {
    setSelectedJob(job);
    setShowApplyModal(true);
  };

  const closeApplyModal = () => {
    setSelectedJob(null);
    setShowApplyModal(false);
  };

  const handleApplicationSuccess = (jobId) => {
    setAppliedJobIds((prev) => [...prev, jobId]);
    setApplicationStatuses((prev) => ({
      ...prev,
      [jobId]: "pending",
    }));
    closeApplyModal();
  };

  const displayedJobs = viewAppliedOnly
    ? jobs.filter((job) => appliedJobIds.includes(job._id))
    : jobs;

  return (
    <div className="container mt-5 applicant-dashboard">
      <div className="card shadow p-4 bg-light">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>👩‍💼 Applicant Dashboard</h2>
          <LogoutButton />
        </div>

        <div className="text-center mb-3">
          <button className="btn btn-secondary" onClick={toggleView}>
            {viewAppliedOnly ? "View All Jobs" : "View My Applications"}
          </button>
        </div>

        {loading ? (
          <p>Loading jobs...</p>
        ) : displayedJobs.length === 0 ? (
          <p>No jobs to display.</p>
        ) : (
          <div className="row">
            {displayedJobs.map((job) => (
              <div className="col-md-6 mb-4" key={job._id}>
                <div className="card h-100 border-primary">
                  <div className="card-body">
                    <h5>{job.title}</h5>
                    <h6 className="text-muted">{job.company} - {job.location}</h6>
                    <p className="text-truncate">{job.description}</p>

                    <div className="d-flex justify-content-between mt-3">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => openModal(job)}
                      >
                        View Details
                      </button>

                      {appliedJobIds.includes(job._id) ? (
                        <span className={`badge ${
                          applicationStatuses[job._id] === "accepted"
                            ? "bg-success"
                            : applicationStatuses[job._id] === "rejected"
                            ? "bg-danger"
                            : "bg-warning text-dark"
                        }`}>
                          {applicationStatuses[job._id]?.toUpperCase()}
                        </span>
                      ) : (
                        !viewAppliedOnly && (
                          <button
                            className="btn btn-sm btn-outline-success"
                            onClick={() => openApplyModal(job)}
                          >
                            Apply
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Job Details Modal */}
      <div
        className="modal fade"
        id="jobDetailsModal"
        tabIndex="-1"
        aria-labelledby="jobDetailsModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{selectedJob?.title}</h5>
              <button className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body">
              <h6>{selectedJob?.company}</h6>
              <p className="text-muted">{selectedJob?.location}</p>
              <hr />
              <p>{selectedJob?.description}</p>
              <p><strong>Requirements:</strong> {selectedJob?.requirements || "N/A"}</p>
              <p><strong>Salary:</strong> {selectedJob?.salary || "Not disclosed"}</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              {!appliedJobIds.includes(selectedJob?._id) && (
                <button
                  className="btn btn-primary"
                  onClick={() => openApplyModal(selectedJob)}
                  data-bs-dismiss="modal"
                >
                  Apply Now
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Resume Upload Modal */}
      {showApplyModal && selectedJob && (
        <ApplyModal
          jobId={selectedJob._id}
          onClose={closeApplyModal}
          onSuccess={handleApplicationSuccess}
        />
      )}
    </div>
  );
}

export default ApplicantDashboard;

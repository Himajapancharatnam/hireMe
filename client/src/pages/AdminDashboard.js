import React from 'react';

const AdminDashboard = () => {
  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h2 className="mb-3">Admin Dashboard</h2>
        <p>Welcome, Admin. You have full control over users and jobs.</p>

        <div className="row">
          <div className="col-md-4 mb-3">
            <div className="card border-success">
              <div className="card-body">
                <h5 className="card-title">Manage Users</h5>
                <p className="card-text">View, block, or delete users.</p>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="card border-info">
              <div className="card-body">
                <h5 className="card-title">Manage Jobs</h5>
                <p className="card-text">Monitor all job postings.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

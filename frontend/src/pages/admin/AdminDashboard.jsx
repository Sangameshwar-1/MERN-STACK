import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats').then(res => {
      setStats(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="loading-spinner large" />;

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>Admin Dashboard ⚙️</h1>
          <p>System overview and management</p>
        </div>
        <Link to="/admin/organizers" className="btn-primary">Manage Organizers</Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🏛️</div>
          <div className="stat-value">{stats.totalOrganizers}</div>
          <div className="stat-label">Organizers</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-value">{stats.totalParticipants}</div>
          <div className="stat-label">Participants</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🎟️</div>
          <div className="stat-value">{stats.totalEvents}</div>
          <div className="stat-label">Active Events</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-value">{stats.totalRegistrations}</div>
          <div className="stat-label">Total Registrations</div>
        </div>
      </div>

      <div className="section mt-5">
        <div className="card text-center p-5">
          <h3>Password Reset Requests</h3>
          <p className="text-gray mb-4">You have {stats.pendingResets} pending password reset requests from organizers.</p>
          <Link to="/admin/password-resets" className="btn-secondary">View Requests</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

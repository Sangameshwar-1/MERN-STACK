import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const OrgDashboard = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [logoPic, setLogoPic] = useState(user?.clubLogoUrl ? `http://localhost:5000${user.clubLogoUrl}` : null);

  useEffect(() => {
    api.get('/events/organizer/my-events').then(res => {
      setEvents(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const totalRegistrations = events.reduce((sum, e) => sum + e.currentRegistrations, 0);
  const activeEvents = events.filter(e => e.isActive && new Date(e.eventEndDate) > new Date());

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
      setUploading(true);
      const res = await api.post('/auth/upload-profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setLogoPic(`http://localhost:5000${res.data.fileUrl}`);
    } catch (err) {
      console.error(err);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div 
            style={{ 
              width: '60px', height: '60px', borderRadius: '8px', 
              backgroundColor: 'var(--surface-light)', display: 'flex', 
              alignItems: 'center', justifyContent: 'center', overflow: 'hidden'
            }}
          >
            {logoPic ? (
              <img src={logoPic} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ fontSize: '1.5rem' }}>🏢</span>
            )}
          </div>
          <div>
            <h1>{user?.name || 'Organizer Dashboard'} 📊</h1>
            <label style={{ fontSize: '0.8rem', cursor: 'pointer', color: 'var(--primary)' }}>
              {uploading ? 'Uploading...' : 'Change Club Logo'}
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileUpload} disabled={uploading} />
            </label>
          </div>
        </div>
        <Link to="/organizer/events/new" className="btn-primary">+ Create Event</Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🎟️</div>
          <div className="stat-value">{totalRegistrations}</div>
          <div className="stat-label">Total Registrations</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-value">{activeEvents.length}</div>
          <div className="stat-label">Active Events</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📂</div>
          <div className="stat-value">{events.length}</div>
          <div className="stat-label">Total Events</div>
        </div>
      </div>

      <div className="section">
        <h2>My Events</h2>
        {loading ? (
          <div className="loading-spinner" />
        ) : (
          <div className="registrations-list">
            {events.map(event => (
              <div key={event._id} className="registration-row">
                <div className="reg-info">
                  <h4>{event.eventName}</h4>
                  <p>{event.eventType} • {event.currentRegistrations} registered</p>
                  <p className="reg-date">
                    {new Date(event.eventStartDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
                  </p>
                </div>
                <div className="reg-meta">
                  <span className={`status-badge ${event.isActive ? 'confirmed' : 'cancelled'}`}>
                    {event.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <Link to={`/organizer/events/${event._id}`} className="btn-sm">Edit</Link>
                  <Link to={`/organizer/events/${event._id}/participants`} className="btn-sm">Participants</Link>
                </div>
              </div>
            ))}
            {events.length === 0 && (
              <div className="empty-state">
                <span>You haven&apos;t created any events yet.</span>
                <Link to="/organizer/events/new">Create your first event →</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrgDashboard;

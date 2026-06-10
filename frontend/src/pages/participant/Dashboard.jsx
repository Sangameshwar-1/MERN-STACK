import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    api.get('/registrations/my').then(res => {
      setRegistrations(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const now = new Date();
  const upcoming = registrations.filter(r => r.event && new Date(r.event.eventStartDate) > now && r.status !== 'cancelled');
  const normal = registrations.filter(r => r.registrationType === 'normal');
  const merchandise = registrations.filter(r => r.registrationType === 'merchandise');
  const completed = registrations.filter(r => r.status === 'completed' || (r.event && new Date(r.event.eventEndDate) < now));
  const cancelled = registrations.filter(r => r.status === 'cancelled' || r.status === 'rejected');

  const tabs = [
    { key: 'upcoming', label: '📅 Upcoming', data: upcoming },
    { key: 'normal', label: '🎯 Normal', data: normal },
    { key: 'merchandise', label: '🛍️ Merchandise', data: merchandise },
    { key: 'completed', label: '✅ Completed', data: completed },
    { key: 'cancelled', label: '❌ Cancelled', data: cancelled },
  ];

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>Welcome back, {user?.firstName || user?.name}! 👋</h1>
          <p>Here&apos;s your event activity overview</p>
        </div>
        <Link to="/events" className="btn-primary">Browse Events →</Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🎟️</div>
          <div className="stat-value">{registrations.length}</div>
          <div className="stat-label">Total Registrations</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-value">{upcoming.length}</div>
          <div className="stat-label">Upcoming Events</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-value">{completed.length}</div>
          <div className="stat-label">Events Attended</div>
        </div>
      </div>

      <div className="section">
        <h2>My Events</h2>
        <div className="tabs">
          {tabs.map(tab => (
            <button
              key={tab.key}
              className={`tab ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label} <span className="tab-count">{tab.data.length}</span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading-spinner" />
        ) : (
          <div className="registrations-list">
            {tabs.find(t => t.key === activeTab)?.data.map(reg => (
              <div key={reg._id} className="registration-row">
                <div className="reg-info">
                  <h4>{reg.event?.eventName || 'Event'}</h4>
                  <p>{reg.event?.organizer?.name || ''} · {reg.registrationType}</p>
                  <p className="reg-date">
                    {reg.event?.eventStartDate ? new Date(reg.event.eventStartDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }) : ''}
                  </p>
                </div>
                <div className="reg-meta">
                  <span className={`status-badge ${reg.status}`}>{reg.status}</span>
                  {reg.ticket && (
                    <Link to={`/ticket/${reg.ticket.ticketId}`} className="ticket-link">
                      🎫 {reg.ticket.ticketId}
                    </Link>
                  )}
                  {reg.event && (
                    <Link to={`/events/${reg.event._id}`} className="btn-sm">View Event</Link>
                  )}
                </div>
              </div>
            ))}
            {tabs.find(t => t.key === activeTab)?.data.length === 0 && (
              <div className="empty-state">
                <span>No events here yet.</span>
                <Link to="/events">Browse Events →</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

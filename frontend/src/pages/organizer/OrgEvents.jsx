import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const OrgEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await api.get('/events/organizer/my-events');
      setEvents(res.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading-spinner large" />;

  return (
    <div className="section animated-fade">
      <div className="dashboard-header">
        <h1>🗓️ My Events</h1>
        <Link to="/organizer/events/new" className="btn-primary">
          + Create New Event
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="empty-state">
          <h2>No events found</h2>
          <p>You haven't created any events yet. Click the button above to get started!</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Event Name</th>
                <th>Date</th>
                <th>Type</th>
                <th>Views</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map(event => (
                <tr key={event._id}>
                  <td style={{ fontWeight: 'bold' }}>{event.eventName}</td>
                  <td>{new Date(event.eventStartDate).toLocaleDateString()}</td>
                  <td><span className={`type-badge ${event.eventType}`}>{event.eventType}</span></td>
                  <td>{event.viewCount || 0}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Link to={`/organizer/events/${event._id}`} className="btn-sm">✏️ Edit</Link>
                      <Link to={`/organizer/events/${event._id}/participants`} className="btn-sm" style={{ borderColor: 'var(--accent)' }}>👥 Attendees</Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrgEvents;

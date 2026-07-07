import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const OrgEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadEvents = async () => {
      try {
        const res = await api.get('/events/organizer/my-events');
        if (active) setEvents(res.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadEvents();

    return () => {
      active = false;
    };
  }, []);

  if (loading) return <div className="loading-spinner large" />;

  return (
    <div className="section animated-fade">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-6 border-b border-zinc-800">
        <h1>️ My Events</h1>
        <Link to="/organizer/events/new" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 disabled:pointer-events-none disabled:opacity-50 bg-zinc-100 text-zinc-900 shadow-sm hover:bg-zinc-200/90 h-9 px-4 py-2">
          + Create New Event
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-800 p-8 text-center animate-in fade-in-50">
          <h2>No events found</h2>
          <p>You haven't created any events yet. Click the button above to get started!</p>
        </div>
      ) : (
        <div className="w-full overflow-auto rounded-md border border-zinc-800">
          <table className="w-full caption-bottom text-sm">
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
                      <Link to={`/organizer/events/${event._id}`} className="btn-sm">️ Edit</Link>
                      <Link to={`/organizer/events/${event._id}/participants`} className="btn-sm" style={{ borderColor: 'var(--accent)' }}> Attendees</Link>
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

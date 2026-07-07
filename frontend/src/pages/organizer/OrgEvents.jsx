import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { Plus } from 'lucide-react';

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

  if (loading) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <div className="loading-spinner w-10 h-10 border-2" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 animated-fade">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">My Events</h1>
          <p className="text-sm text-slate-400 mt-1">Manage and track your active club events and registrations</p>
        </div>
        <Link 
          to="/organizer/events/new" 
          className="inline-flex items-center justify-center gap-1.5 bg-white hover:bg-slate-200 text-black font-semibold py-2.5 px-4 rounded-xl text-sm transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Create Event
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 p-12 text-center bg-white/[0.01]">
          <h2 className="text-white font-medium text-lg">No events found</h2>
          <p className="text-slate-400 text-sm mt-1 mb-6">You haven't created any events yet.</p>
          <Link 
            to="/organizer/events/new" 
            className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium py-2 px-4 rounded-lg text-sm transition-all"
          >
            Create your first event
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map(event => (
            <div 
              key={event._id} 
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white/[0.02] border border-white/10 rounded-xl hover:bg-white/[0.03] transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="font-semibold text-white text-base">{event.eventName}</h3>
                  <span className={`text-[10px] py-0.5 px-2 rounded-full uppercase border font-medium ${
                    event.eventType === 'normal' 
                      ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' 
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}>
                    {event.eventType === 'normal' ? 'standard' : 'merchandise'}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                  <span>{new Date(event.eventStartDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                  <span className="hidden sm:inline h-3 w-px bg-white/10"></span>
                  <span>{event.viewCount || 0} views</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Link 
                  to={`/organizer/events/${event._id}`} 
                  className="flex-1 sm:flex-none text-center bg-white/5 border border-white/10 hover:bg-white/10 text-white text-sm font-medium py-2.5 px-4 rounded-lg transition-all"
                >
                  Edit
                </Link>
                <Link 
                  to={`/organizer/events/${event._id}/participants`} 
                  className="flex-1 sm:flex-none text-center bg-white text-black hover:bg-slate-200 text-sm font-medium py-2.5 px-4 rounded-lg transition-all"
                >
                  Attendees
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrgEvents;

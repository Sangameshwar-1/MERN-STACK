import { Link } from 'react-router-dom';
import { ShoppingBag, Target, Users, Calendar, Clock, IndianRupee } from 'lucide-react';

const EventCard = ({ event }) => {
  const isDeadlinePassed = new Date() > new Date(event.registrationDeadline);
  const isFull = event.registrationLimit && event.currentRegistrations >= event.registrationLimit;

  const typeColors = { normal: '#6366f1', merchandise: '#f59e0b' };
  const typeColor = typeColors[event.eventType] || '#6366f1';

  return (
    <div className="event-card">
      <div className="event-card-header" style={{ borderTopColor: typeColor }}>
        <span className="event-type-badge flex items-center" style={{ backgroundColor: typeColor }}>
          {event.eventType === 'merchandise' ? <><ShoppingBag className="w-3 h-3 mr-1" /> Merchandise</> : <><Target className="w-3 h-3 mr-1" /> Normal</>}
        </span>
        {event.isTeamEvent && <span className="team-badge flex items-center"><Users className="w-3 h-3 mr-1" /> Team Event</span>}
      </div>

      <div className="event-card-body">
        <h3 className="event-name">{event.eventName}</h3>
        <p className="event-organizer">by {event.organizer?.name || 'Felicity'}</p>
        <p className="event-description">
          {event.eventDescription?.substring(0, 100)}
          {event.eventDescription?.length > 100 ? '...' : ''}
        </p>

        <div className="event-meta">
          <span className="flex items-center"><Calendar className="w-4 h-4 mr-1.5" /> {new Date(event.eventStartDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          <span className="flex items-center"><Clock className="w-4 h-4 mr-1.5" /> Deadline: {new Date(event.registrationDeadline).toLocaleDateString('en-IN')}</span>
          {event.registrationFee > 0 && <span className="flex items-center"><IndianRupee className="w-4 h-4 mr-1.5" /> {event.registrationFee}</span>}
        </div>

        {event.tags?.length > 0 && (
          <div className="event-tags">
            {event.tags.slice(0, 3).map(tag => (
              <span key={tag} className="tag">#{tag}</span>
            ))}
          </div>
        )}
      </div>

      <div className="event-card-footer">
        {isDeadlinePassed ? (
          <span className="status-badge expired">Registration Closed</span>
        ) : isFull ? (
          <span className="status-badge full">Seats Full</span>
        ) : (
          <span className="status-badge open">
            {event.registrationLimit ? `${event.registrationLimit - event.currentRegistrations} spots left` : 'Open'}
          </span>
        )}
        <Link to={`/events/${event._id}`} className="btn-view">View Details →</Link>
      </div>
    </div>
  );
};

export default EventCard;

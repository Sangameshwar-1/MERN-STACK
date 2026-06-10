import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { QRCodeSVG } from 'qrcode.react';
import { io } from 'socket.io-client';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const EventDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { register, handleSubmit, reset } = useForm();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForum, setShowForum] = useState(false);
  const [messages, setMessages] = useState([]);
  const [msgText, setMsgText] = useState('');
  const [activeTab, setActiveTab] = useState('info');
  const [isRegistered, setIsRegistered] = useState(false);

  const socketRef = useRef(null);

  useEffect(() => {
    api.get(`/events/${id}`).then(res => { setEvent(res.data); setLoading(false); });
    if (user?.role === 'participant') {
      api.get('/registrations/my').then(res => {
        const reg = res.data.find(r => r.event?._id === id);
        if (reg) { setIsRegistered(true); setTicket(reg.ticket); }
      });
    }
  }, [id, user]);

  useEffect(() => {
    if (!showForum) return;
    api.get(`/forum/${id}`).then(res => setMessages(res.data));

    socketRef.current = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');
    socketRef.current.emit('join-forum', id);
    socketRef.current.on('new-message', (msg) => setMessages(prev => [...prev, msg]));
    socketRef.current.on('message-deleted', (msgId) => {
      setMessages(prev => prev.filter(m => m._id !== msgId));
    });
    return () => socketRef.current?.disconnect();
  }, [id, showForum]);

  const handleRegister = async (formData) => {
    setRegistering(true);
    setError('');
    try {
      const res = await api.post('/registrations/register', { eventId: id, formResponses: formData });
      setSuccess('🎉 Registered successfully! Check your email for the ticket.');
      setTicket(res.data.ticket);
      setIsRegistered(true);
      setEvent(prev => ({ ...prev, currentRegistrations: prev.currentRegistrations + 1 }));
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setRegistering(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!msgText.trim()) return;
    try {
      await api.post(`/forum/${id}`, { content: msgText });
      setMsgText('');
    } catch (err) {
      console.error(err);
    }
  };

  const submitFeedback = async (data) => {
    try {
      await api.post(`/feedback/${id}`, data);
      setSuccess('Thank you for your anonymous feedback!');
      reset();
    } catch (err) {
      setError(err.response?.data?.message || 'Feedback submission failed');
    }
  };

  if (loading) return <div className="loading-spinner large" />;
  if (!event) return <div className="error-page">Event not found.</div>;

  const isDeadlinePassed = new Date() > new Date(event.registrationDeadline);
  const isFull = event.registrationLimit && event.currentRegistrations >= event.registrationLimit;
  const canRegister = user?.role === 'participant' && !isRegistered && !isDeadlinePassed && !isFull;

  return (
    <div className="event-details-page">
      <div className="event-hero enhanced-hero" style={{ background: `linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)`, position: 'relative', overflow: 'hidden' }}>
        <div className="hero-overlay" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1 }}></div>
        <div className="event-hero-content" style={{ position: 'relative', zIndex: 2, padding: '4rem 2rem', textAlign: 'center' }}>
          <div className="event-badges" style={{ justifyContent: 'center', marginBottom: '1.5rem' }}>
            <span className={`type-badge ${event.eventType}`} style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>
              {event.eventType === 'merchandise' ? '🛍️ Merchandise' : '🎯 Normal Event'}
            </span>
            {event.isTeamEvent && <span className="type-badge team" style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>👥 Team Event</span>}
            <span className={`eligibility-badge`} style={{ fontSize: '1rem', padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.2)', color: 'white' }}>{event.eligibility}</span>
          </div>
          <h1 style={{ fontSize: '3.5rem', fontWeight: '800', textShadow: '0 4px 12px rgba(0,0,0,0.3)', marginBottom: '1rem' }}>{event.eventName}</h1>
          <p className="organizer-name" style={{ fontSize: '1.2rem', opacity: 0.9 }}>by <strong>{event.organizer?.name}</strong></p>
          
          <div className="event-date-info glass-panel" style={{ display: 'inline-flex', marginTop: '2rem', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', padding: '1rem 2rem', borderRadius: '50px', gap: '2rem', border: '1px solid rgba(255,255,255,0.2)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>📅 {new Date(event.eventStartDate).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
            {event.registrationFee > 0 && <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>💰 ₹{event.registrationFee}</span>}
            {event.registrationLimit && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>👥 {event.currentRegistrations}/{event.registrationLimit} slots</span>
            )}
          </div>
        </div>
      </div>

      <div className="event-tabs">
        {['info', 'register', 'forum', 'feedback'].map(tab => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => { setActiveTab(tab); if (tab === 'forum') setShowForum(true); }}
          >
            {tab === 'info' ? '📋 Info' : tab === 'register' ? '📝 Register' : tab === 'forum' ? '💬 Forum' : '⭐ Feedback'}
          </button>
        ))}
      </div>

      <div className="event-content">
        {activeTab === 'info' && (
          <div className="event-info">
            <div className="info-section">
              <h3>About this Event</h3>
              <p>{event.eventDescription}</p>
            </div>
            <div className="info-grid">
              <div className="info-item"><strong>Start:</strong> {new Date(event.eventStartDate).toLocaleString('en-IN')}</div>
              <div className="info-item"><strong>End:</strong> {new Date(event.eventEndDate).toLocaleString('en-IN')}</div>
              <div className="info-item"><strong>Registration Deadline:</strong> {new Date(event.registrationDeadline).toLocaleString('en-IN')}</div>
              <div className="info-item"><strong>Fee:</strong> {event.registrationFee > 0 ? `₹${event.registrationFee}` : 'Free'}</div>
              <div className="info-item"><strong>Eligibility:</strong> {event.eligibility}</div>
              <div className="info-item"><strong>Type:</strong> {event.eventType}</div>
            </div>
            {event.tags?.length > 0 && (
              <div className="tags-section">
                {event.tags.map(t => <span key={t} className="tag">#{t}</span>)}
              </div>
            )}
          </div>
        )}

        {activeTab === 'register' && (
          <div className="register-section">
            {success && <div className="alert alert-success">{success}</div>}
            {error && <div className="alert alert-error">{error}</div>}

            {ticket && (
              <div className="ticket-display" style={{ background: 'linear-gradient(to right, #1a1a2e, #16213e)', borderRadius: '16px', padding: '2rem', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-50px', left: '-50px', width: '100px', height: '100px', background: 'var(--primary)', filter: 'blur(50px)', opacity: 0.5 }}></div>
                <h3 style={{ color: 'var(--primary)', marginBottom: '1.5rem', fontSize: '1.8rem' }}>🎫 Your VIP Ticket</h3>
                <div className="ticket-card" style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', display: 'inline-block' }}>
                  <QRCodeSVG value={ticket.ticketId} size={200} />
                </div>
                <p style={{ marginTop: '1.5rem', fontSize: '1.2rem', fontFamily: 'monospace', color: '#a78bfa', letterSpacing: '2px' }}>{ticket.ticketId}</p>
                <p className="ticket-hint" style={{ color: '#9ca3af', marginTop: '0.5rem' }}>Show this QR at the event entrance</p>
              </div>
            )}

            {isRegistered && !ticket && <div className="alert alert-success">✅ You are registered for this event.</div>}

            {!user && <div className="alert alert-info">Please <a href="/login">login</a> to register.</div>}

            {isDeadlinePassed && <div className="alert alert-error">⏰ Registration deadline has passed.</div>}
            {isFull && <div className="alert alert-error">😔 Registration limit reached.</div>}

            {canRegister && (
              <form onSubmit={handleSubmit(handleRegister)} className="registration-form glass-panel" style={{ padding: '3rem', borderRadius: '24px', backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <h3>📝 Registration Form</h3>
                {event.customForm?.length > 0 ? (
                  event.customForm.map(field => (
                    <div key={field.fieldName} className="form-group">
                      <label>{field.label}{field.required && ' *'}</label>
                      {field.fieldType === 'dropdown' ? (
                        <select {...register(field.fieldName, { required: field.required })}>
                          <option value="">Select...</option>
                          {field.options?.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      ) : field.fieldType === 'textarea' ? (
                        <textarea rows={3} {...register(field.fieldName, { required: field.required })} />
                      ) : (
                        <input type={field.fieldType} {...register(field.fieldName, { required: field.required })} />
                      )}
                    </div>
                  ))
                ) : (
                  <p className="form-note">No additional information required. Click below to register.</p>
                )}
                <button type="submit" className="btn-primary btn-full" disabled={registering}>
                  {registering ? <span className="spinner" /> : '🎉 Register Now'}
                </button>
              </form>
            )}
          </div>
        )}

        {activeTab === 'forum' && (
          <div className="forum-section">
            <h3>💬 Event Discussion</h3>
            {!user && <div className="alert alert-info">Login and register to participate in the forum.</div>}
            <div className="messages-list">
              {messages.map(msg => (
                <div key={msg._id} className={`message ${msg.isAnnouncement ? 'announcement' : ''} ${msg.isPinned ? 'pinned' : ''}`}>
                  {msg.isPinned && <span className="pin-badge">📌 Pinned</span>}
                  {msg.isAnnouncement && <span className="announcement-badge">📢 Announcement</span>}
                  <div className="message-header">
                    <strong>{msg.author?.firstName || msg.author?.name}</strong>
                    <span className="role-badge">{msg.author?.role}</span>
                    <span className="msg-time">{new Date(msg.createdAt).toLocaleTimeString()}</span>
                  </div>
                  <p>{msg.content}</p>
                  <div className="reactions">
                    {['👍', '❤️', '😂', '😮'].map(emoji => (
                      <button key={emoji} className="reaction-btn" onClick={() => api.post(`/forum/message/${msg._id}/react`, { emoji })}>
                        {emoji} {msg.reactions?.filter(r => r.emoji === emoji).length || ''}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {(isRegistered || user?.role === 'organizer') && (
              <form className="message-form glass-panel" onSubmit={sendMessage} style={{ padding: '1rem', borderRadius: '16px', backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <input
                  type="text"
                  placeholder="Write a message..."
                  value={msgText}
                  onChange={e => setMsgText(e.target.value)}
                />
                <button type="submit" className="btn-primary">Send</button>
              </form>
            )}
          </div>
        )}

        {activeTab === 'feedback' && (
          <div className="feedback-section">
            <h3>⭐ Submit Anonymous Feedback</h3>
            {success && <div className="alert alert-success">{success}</div>}
            {error && <div className="alert alert-error">{error}</div>}
            {isRegistered ? (
              <form onSubmit={handleSubmit(submitFeedback)} className="feedback-form glass-panel" style={{ padding: '3rem', borderRadius: '24px', backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.1)', marginTop: '2rem' }}>
                <div className="form-group">
                  <label>Rating (1-5 stars)</label>
                  <div className="star-selector">
                    {[1, 2, 3, 4, 5].map(n => (
                      <label key={n} className="star-option">
                        <input type="radio" value={n} {...register('rating', { required: true })} />
                        ⭐
                      </label>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label>Comment (optional)</label>
                  <textarea rows={3} placeholder="Share your thoughts..." {...register('comment')} />
                </div>
                <button type="submit" className="btn-primary">Submit Anonymously</button>
              </form>
            ) : (
              <p className="empty-state">You must be registered for this event to submit feedback.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetails;

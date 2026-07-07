import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { ShoppingBag, Target, Users, Info, Ticket, MessageCircle, Star, Clock, Pin, Megaphone, ThumbsUp, Heart, PartyPopper, Rocket } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { QRCodeSVG } from 'qrcode.react';
import { io } from 'socket.io-client';
import api from '../../utils/api';
import useAuth from '../../context/useAuth';

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
      setSuccess(' Registered successfully! Check your email for the ticket.');
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
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animated-fade">
      {/* Event Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-white/10 p-6 sm:p-10 mb-8">
        <div className="relative z-10 flex flex-col items-center text-center space-y-4">
          <div className="flex flex-wrap justify-center gap-2">
            <span className={`text-[10px] py-0.5 px-2 rounded-full uppercase border font-medium ${
              event.eventType === 'merchandise' 
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
            }`}>
              {event.eventType === 'merchandise' ? 'Merchandise' : 'Standard Event'}
            </span>
            {event.isTeamEvent && (
              <span className="text-[10px] py-0.5 px-2 rounded-full uppercase border font-medium bg-blue-500/10 text-blue-400 border-blue-500/20">
                Team Event
              </span>
            )}
            <span className="text-[10px] py-0.5 px-2 rounded-full uppercase border font-medium bg-white/5 text-slate-300 border-white/10">
              {event.eligibility === 'all' ? 'Open for all' : event.eligibility === 'iiit-only' ? 'IIIT Only' : 'Non-IIIT Only'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">{event.eventName}</h1>
          <p className="text-sm text-slate-400">Organized by <span className="text-white font-medium">{event.organizer?.name || 'Felicity'}</span></p>
          
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 pt-4 text-xs sm:text-sm text-slate-300">
            <div className="bg-white/5 border border-white/5 rounded-full px-4 py-1.5">
              {new Date(event.eventStartDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}
            </div>
            {event.registrationFee > 0 ? (
              <div className="bg-white/5 border border-white/5 rounded-full px-4 py-1.5 font-semibold text-purple-400">
                ₹{event.registrationFee}
              </div>
            ) : (
              <div className="bg-white/5 border border-white/5 rounded-full px-4 py-1.5 font-semibold text-emerald-400">
                Free Entry
              </div>
            )}
            {event.registrationLimit && (
              <div className="bg-white/5 border border-white/5 rounded-full px-4 py-1.5">
                {event.currentRegistrations} / {event.registrationLimit} Registered
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10 pb-3 mb-6 overflow-x-auto whitespace-nowrap scrollbar-none">
        {['info', 'register', 'forum', 'feedback'].map(tab => (
          <button
            key={tab}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab 
                ? 'bg-white text-black' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
            onClick={() => { setActiveTab(tab); if (tab === 'forum') setShowForum(true); }}
          >
            {tab === 'info' && <Info className="w-4 h-4" />}
            {tab === 'register' && <Ticket className="w-4 h-4" />}
            {tab === 'forum' && <MessageCircle className="w-4 h-4" />}
            {tab === 'feedback' && <Star className="w-4 h-4" />}
            <span className="capitalize">{tab}</span>
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="bg-[#09090b] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl">
        {activeTab === 'info' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">About this Event</h3>
              <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">{event.eventDescription}</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/5">
              <div className="space-y-1">
                <span className="text-xs text-slate-500 uppercase font-medium">Starts</span>
                <p className="text-sm text-white font-medium">{new Date(event.eventStartDate).toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-slate-500 uppercase font-medium">Ends</span>
                <p className="text-sm text-white font-medium">{new Date(event.eventEndDate).toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-slate-500 uppercase font-medium">Registration Deadline</span>
                <p className="text-sm text-white font-medium">{new Date(event.registrationDeadline).toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-slate-500 uppercase font-medium">Eligibility</span>
                <p className="text-sm text-white font-medium capitalize">{event.eligibility}</p>
              </div>
            </div>

            {event.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
                {event.tags.map(t => (
                  <span key={t} className="text-xs text-slate-400 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg">
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'register' && (
          <div className="space-y-6">
            {success && (
              <div className="alert alert-success bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl text-emerald-200 text-sm">
                {success}
              </div>
            )}
            {error && (
              <div className="alert alert-error bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-200 text-sm">
                {error}
              </div>
            )}

            {ticket && (
              <div className="bg-white/[0.02] border border-white/10 rounded-xl p-6 text-center max-w-sm mx-auto shadow-md">
                <h3 className="text-lg font-semibold text-white mb-4">Your Ticket</h3>
                <div className="bg-white p-3 rounded-lg inline-block shadow-inner mb-4">
                  <QRCodeSVG value={ticket.ticketId} size={180} />
                </div>
                <p className="text-sm font-mono text-purple-400 tracking-wider mb-1">{ticket.ticketId}</p>
                <p className="text-xs text-slate-500">Present this QR code at the entrance</p>
              </div>
            )}

            {isRegistered && !ticket && (
              <div className="alert alert-success bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl text-emerald-200 text-sm">
                You are registered for this event.
              </div>
            )}

            {!user && (
              <div className="text-center py-6">
                <p className="text-slate-400 text-sm">
                  Please <a href="/login" className="text-white underline font-semibold">login</a> to register.
                </p>
              </div>
            )}

            {isDeadlinePassed && (
              <div className="alert alert-error bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-200 text-sm">
                Registration deadline has passed.
              </div>
            )}
            
            {isFull && (
              <div className="alert alert-error bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-200 text-sm">
                Registration limit reached.
              </div>
            )}

            {canRegister && (
              <form onSubmit={handleSubmit(handleRegister)} className="space-y-6 max-w-lg mx-auto">
                <h3 className="text-lg font-semibold text-white mb-4">Registration Form</h3>
                
                {event.customForm?.length > 0 ? (
                  <div className="space-y-4">
                    {event.customForm.map(field => (
                      <div key={field.fieldName} className="form-group">
                        <label className="block text-slate-300 text-sm font-medium mb-1.5">
                          {field.label}{field.required && ' *'}
                        </label>
                        {field.fieldType === 'dropdown' ? (
                          <select className="w-full" {...register(field.fieldName, { required: field.required })}>
                            <option value="">Select...</option>
                            {field.options?.map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        ) : field.fieldType === 'textarea' ? (
                          <textarea className="w-full" rows={3} {...register(field.fieldName, { required: field.required })} />
                        ) : (
                          <input className="w-full" type={field.fieldType} {...register(field.fieldName, { required: field.required })} />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 mb-4">No additional details needed. Press below to register.</p>
                )}

                <button 
                  type="submit" 
                  disabled={registering}
                  className="w-full bg-white hover:bg-slate-200 text-black font-semibold py-2.5 px-4 rounded-xl text-sm transition-all"
                >
                  {registering ? 'Processing...' : 'Register Now'}
                </button>
              </form>
            )}
          </div>
        )}

        {activeTab === 'forum' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Event Discussion</h3>
            {!user && <div className="alert alert-info bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl text-blue-200 text-sm">Login and register to participate in the forum.</div>}
            
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {messages.map(msg => (
                <div 
                  key={msg._id} 
                  className={`p-4 rounded-xl border ${
                    msg.isAnnouncement 
                      ? 'bg-amber-500/5 border-amber-500/20' 
                      : msg.isPinned 
                      ? 'bg-purple-500/5 border-purple-500/20' 
                      : 'bg-white/[0.02] border-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs mb-2">
                    <span className="font-semibold text-white">{msg.author?.firstName || msg.author?.name}</span>
                    <span className="text-[10px] py-0.5 px-2 bg-white/5 border border-white/10 rounded-full text-slate-400 font-medium capitalize">
                      {msg.author?.role}
                    </span>
                    <span className="text-slate-500 ml-auto font-mono">
                      {new Date(msg.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-sm text-slate-300">{msg.content}</p>
                  
                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    {[{id: 'like', icon: ThumbsUp}, {id: 'love', icon: Heart}, {id: 'party', icon: PartyPopper}, {id: 'rocket', icon: Rocket}].map(reaction => (
                      <button 
                        key={reaction.id} 
                        onClick={() => api.post(`/forum/message/${msg._id}/react`, { emoji: reaction.id })}
                        className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 hover:bg-white/10 px-2 py-1 rounded-md text-xs text-slate-400 hover:text-white transition-all"
                      >
                        <reaction.icon className="w-3 h-3" /> 
                        <span className="text-[10px]">{msg.reactions?.filter(r => r.emoji === reaction.id).length || ''}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {(isRegistered || user?.role === 'organizer') && (
              <form onSubmit={sendMessage} className="flex gap-2 pt-4 border-t border-white/5">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={msgText}
                  onChange={e => setMsgText(e.target.value)}
                  className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-purple-500/50"
                />
                <button 
                  type="submit" 
                  className="bg-white hover:bg-slate-200 text-black font-semibold px-4 py-2 rounded-xl text-sm transition-all"
                >
                  Send
                </button>
              </form>
            )}
          </div>
        )}

        {activeTab === 'feedback' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Submit Feedback</h3>
            {success && (
              <div className="alert alert-success bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl text-emerald-200 text-sm">
                {success}
              </div>
            )}
            {error && (
              <div className="alert alert-error bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-200 text-sm">
                {error}
              </div>
            )}
            
            {isRegistered ? (
              <form onSubmit={handleSubmit(submitFeedback)} className="space-y-5 max-w-lg mx-auto">
                <div className="form-group">
                  <label className="block text-slate-300 text-sm font-medium mb-1.5">Rating (1-5 stars)</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(n => (
                      <label key={n} className="cursor-pointer p-1 rounded hover:bg-white/5 transition-colors">
                        <input type="radio" className="hidden" value={n} {...register('rating', { required: true })} />
                        <Star className="w-6 h-6 text-yellow-500" />
                      </label>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label className="block text-slate-300 text-sm font-medium mb-1.5">Comment</label>
                  <textarea 
                    rows={3} 
                    placeholder="Share your thoughts anonymously..." 
                    {...register('comment')} 
                    className="w-full"
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-white hover:bg-slate-200 text-black font-semibold py-2.5 px-4 rounded-xl text-sm transition-all"
                >
                  Submit Anonymously
                </button>
              </form>
            ) : (
              <div className="text-center py-8 border border-dashed border-white/10 rounded-xl bg-white/[0.01]">
                <p className="text-slate-400 text-sm">You must be registered for this event to submit feedback.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetails;

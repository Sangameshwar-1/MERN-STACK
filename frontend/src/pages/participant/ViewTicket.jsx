import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../utils/api';

const ViewTicket = () => {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await api.get(`/registrations/ticket/${ticketId}`);
        setTicket(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load ticket');
      } finally {
        setLoading(false);
      }
    };
    fetchTicket();
  }, [ticketId]);

  if (loading) return <div className="loading-spinner large" />;
  if (error) return <div className="section"><div className="alert alert-error">{error}</div></div>;
  if (!ticket) return null;

  return (
    <div className="section animated-fade" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div className="ticket-rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-50 shadow p-6" style={{ width: '100%', maxWidth: '400px', padding: '2rem', textAlign: 'center', borderRadius: '16px' }}>
        <h2 style={{ marginBottom: '0.5rem', color: 'var(--primary)' }}>Felicity Ticket</h2>
        <div style={{ backgroundColor: 'var(--surface-light)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
          <h3 style={{ margin: 0 }}>{ticket.event?.eventName}</h3>
          <p className="text-muted" style={{ margin: 0 }}>{ticket.event?.eventType || ticket.ticketType}</p>
        </div>

        <div className="qr-container" style={{ background: 'white', padding: '1rem', borderRadius: '8px', display: 'inline-block', marginBottom: '1.5rem' }}>
          <img src={ticket.qrCode} alt="Ticket QR Code" style={{ width: '200px', height: '200px' }} />
        </div>

        <div className="ticket-details" style={{ textAlign: 'left', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
          <p><strong>Ticket ID:</strong> {ticket.ticketId}</p>
          <p><strong>Participant:</strong> {ticket.participant?.firstName} {ticket.participant?.lastName}</p>
          <p><strong>Email:</strong> {ticket.participant?.email}</p>
          <p><strong>Status:</strong> <span className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 border-transparent bg-zinc-100 text-zinc-900 shadow hover:bg-zinc-100/80 ${ticket.isValid ? 'approved' : 'rejected'}`}>{ticket.isValid ? 'Valid' : 'Used/Invalid'}</span></p>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <button onClick={() => window.print()} className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 disabled:pointer-events-none disabled:opacity-50 bg-zinc-800 text-zinc-50 hover:bg-zinc-800/80 h-9 px-4 py-2" style={{ width: '100%', marginBottom: '0.5rem' }}>️ Print Ticket</button>
          <Link to="/participant" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 disabled:pointer-events-none disabled:opacity-50 hover:bg-zinc-800 hover:text-zinc-50 h-9 px-4 py-2" style={{ width: '100%', display: 'block', textAlign: 'center' }}>← Back to Dashboard</Link>
        </div>
      </div>
    </div>
  );
};

export default ViewTicket;

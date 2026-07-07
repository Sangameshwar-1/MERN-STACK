import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../utils/api';
import { ArrowLeft, Printer } from 'lucide-react';

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

  if (loading) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <div className="loading-spinner w-10 h-10 border-2" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto py-12 px-4">
        <div className="alert alert-error bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-200 text-sm">
          {error}
        </div>
      </div>
    );
  }

  if (!ticket) return null;

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 animated-fade">
      <div className="bg-[#09090b] border border-white/10 rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-xl text-center">
        <h2 className="text-xl font-semibold text-white tracking-tight mb-2">Event Ticket</h2>
        
        <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl mb-6">
          <h3 className="text-base font-semibold text-white truncate">{ticket.event?.eventName}</h3>
          <p className="text-xs text-slate-400 mt-0.5 capitalize">{ticket.event?.eventType || ticket.ticketType}</p>
        </div>

        <div className="bg-white p-3 rounded-xl inline-block mb-6 shadow-inner">
          <img src={ticket.qrCode} alt="Ticket QR Code" className="w-44 h-44 sm:w-48 sm:h-48" />
        </div>

        <div className="text-left border-t border-white/10 pt-4 space-y-2 text-sm text-slate-300">
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">Ticket ID</span>
            <span className="font-mono text-xs">{ticket.ticketId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">Participant</span>
            <span className="font-medium text-white">{ticket.participant?.firstName} {ticket.participant?.lastName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">Email</span>
            <span className="text-slate-400 truncate max-w-[200px]">{ticket.participant?.email}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500 font-medium">Status</span>
            <span className={`text-[10px] py-0.5 px-2 rounded-full uppercase border font-medium ${
              ticket.isValid 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                : 'bg-red-500/10 text-red-400 border-red-500/20'
            }`}>
              {ticket.isValid ? 'Valid' : 'Used/Invalid'}
            </span>
          </div>
        </div>

        <div className="mt-8 space-y-2.5">
          <button 
            onClick={() => window.print()} 
            className="w-full flex items-center justify-center gap-1.5 bg-white hover:bg-slate-200 text-black font-semibold py-2.5 px-4 rounded-xl text-sm transition-all"
          >
            <Printer className="w-4 h-4" />
            Print Ticket
          </button>
          
          <Link 
            to="/participant" 
            className="w-full inline-flex items-center justify-center gap-1.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium py-2.5 px-4 rounded-xl text-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ViewTicket;

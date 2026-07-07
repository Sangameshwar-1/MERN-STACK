import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import QRScanner from '../../components/QRScanner';
import { ArrowLeft, Download, QrCode } from 'lucide-react';

const Participants = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showScanner, setShowScanner] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get(`/events/${id}`),
      api.get(`/registrations/event/${id}`)
    ]).then(([eventRes, regRes]) => {
      setEvent(eventRes.data);
      setRegistrations(regRes.data);
      setLoading(false);
    });
  }, [id]);

  const handleScan = async (ticketId) => {
    try {
      const res = await api.post('/registrations/attendance', { ticketId });
      setRegistrations(regs => regs.map(r => 
        r.participant._id === res.data.participant._id 
          ? { ...r, attendanceMarked: true, attendanceTimestamp: res.data.timestamp }
          : r
      ));
      alert(`Attendance marked for ${res.data.participant.firstName}`);
    } catch {
      alert('Invalid ticket');
    }
  };

  const downloadCSV = async () => {
    try {
      const res = await api.get(`/registrations/event/${id}/attendance-csv`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${event?.eventName}-attendance.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      console.error('Failed to download CSV');
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <div className="loading-spinner w-10 h-10 border-2" />
      </div>
    );
  }

  const presentCount = registrations.filter(r => r.attendanceMarked).length;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 animated-fade">
      {/* Navigation */}
      <button 
        onClick={() => navigate('/organizer/events')} 
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" /> 
        Back to events
      </button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Attendees</h1>
          <p className="text-sm text-slate-400 mt-1">Manage registrations for {event?.eventName}</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button 
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-sm font-semibold py-2.5 px-4 rounded-xl transition-all" 
            onClick={downloadCSV}
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button 
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 bg-white text-black hover:bg-slate-200 text-sm font-semibold py-2.5 px-4 rounded-xl transition-all" 
            onClick={() => setShowScanner(!showScanner)}
          >
            <QrCode className="w-4 h-4" />
            {showScanner ? 'Close Scanner' : 'Scan QR'}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4 text-center">
          <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Registered</div>
          <div className="text-2xl font-semibold text-white mt-1">{registrations.length}</div>
        </div>
        <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4 text-center">
          <div className="text-xs text-slate-400 font-medium uppercase tracking-wider text-emerald-400">Present</div>
          <div className="text-2xl font-semibold text-white mt-1">{presentCount}</div>
        </div>
        <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4 text-center">
          <div className="text-xs text-slate-400 font-medium uppercase tracking-wider text-red-400">Absent</div>
          <div className="text-2xl font-semibold text-white mt-1">{registrations.length - presentCount}</div>
        </div>
      </div>

      {/* Scanner Panel */}
      {showScanner && (
        <div className="mb-8 rounded-xl border border-white/10 bg-black/40 backdrop-blur-xl p-6">
          <QRScanner onScanSuccess={handleScan} />
        </div>
      )}

      {/* Attendees List */}
      <div className="space-y-4">
        {registrations.map(reg => (
          <div 
            key={reg._id} 
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white/[0.02] border border-white/10 rounded-xl hover:bg-white/[0.03] transition-all"
          >
            <div className="space-y-2">
              <div>
                <h3 className="font-semibold text-white text-base">
                  {reg.participant.firstName} {reg.participant.lastName}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">{reg.participant.email}</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-[10px] py-0.5 px-2 rounded-full uppercase border font-medium ${
                  reg.participant.participantType === 'iiit' 
                    ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' 
                    : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                }`}>
                  {reg.participant.participantType}
                </span>
                <span className={`text-[10px] py-0.5 px-2 rounded-full uppercase border font-medium ${
                  reg.status === 'confirmed' 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                }`}>
                  {reg.status}
                </span>
              </div>
            </div>

            <div className="flex flex-row sm:flex-col sm:items-end justify-between items-center gap-2 border-t border-white/5 pt-3 sm:border-0 sm:pt-0">
              <span className={`text-xs py-1 px-3 rounded-full font-medium ${
                reg.attendanceMarked 
                  ? 'bg-emerald-500/15 text-emerald-400' 
                  : 'bg-red-500/15 text-red-400'
              }`}>
                {reg.attendanceMarked ? 'Present' : 'Absent'}
              </span>
              {reg.attendanceTimestamp && (
                <span className="text-xs text-slate-500 font-mono">
                  Checked in: {new Date(reg.attendanceTimestamp).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </div>
          </div>
        ))}
        {registrations.length === 0 && (
          <div className="text-center py-12 border border-dashed border-white/10 rounded-xl bg-white/[0.01]">
            <p className="text-slate-400 text-sm">No participants registered yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Participants;

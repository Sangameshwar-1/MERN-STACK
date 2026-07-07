import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../utils/api';
import QRScanner from '../../components/QRScanner';

const Participants = () => {
  const { id } = useParams();
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
      // Update local state
      setRegistrations(regs => regs.map(r => 
        r.participant._id === res.data.participant._id 
          ? { ...r, attendanceMarked: true, attendanceTimestamp: res.data.timestamp }
          : r
      ));
      alert(` Attendance marked for ${res.data.participant.firstName}`);
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

  if (loading) return <div className="loading-spinner large" />;

  const presentCount = registrations.filter(r => r.attendanceMarked).length;

  return (
    <div className="participants-page section">
      <div className="flex-between">
        <div>
          <h1> Participants</h1>
          <p>Manage registrations for {event?.eventName}</p>
        </div>
        <div className="actions">
          <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 disabled:pointer-events-none disabled:opacity-50 bg-zinc-800 text-zinc-50 hover:bg-zinc-800/80 h-9 px-4 py-2" onClick={downloadCSV}>⬇️ Export CSV</button>
          <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 disabled:pointer-events-none disabled:opacity-50 bg-zinc-100 text-zinc-900 shadow-sm hover:bg-zinc-200/90 h-9 px-4 py-2" onClick={() => setShowScanner(!showScanner)}>
            {showScanner ? 'Close Scanner' : ' Scan QR Codes'}
          </button>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-pill">Total Registered: <strong>{registrations.length}</strong></div>
        <div className="stat-pill">Present: <strong>{presentCount}</strong></div>
        <div className="stat-pill">Absent: <strong>{registrations.length - presentCount}</strong></div>
      </div>

      {showScanner && (
        <div className="scanner-container rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-50 shadow p-6">
          <QRScanner onScanSuccess={handleScan} />
        </div>
      )}

      <div className="w-full overflow-auto rounded-md border border-zinc-800">
        <table className="w-full caption-bottom text-sm">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Type</th>
              <th>Status</th>
              <th>Attendance</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map(reg => (
              <tr key={reg._id}>
                <td>{reg.participant.firstName} {reg.participant.lastName}</td>
                <td>{reg.participant.email}</td>
                <td><span className={`type-badge sm ${reg.participant.participantType}`}>{reg.participant.participantType}</span></td>
                <td><span className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 border-transparent bg-zinc-100 text-zinc-900 shadow hover:bg-zinc-100/80 sm ${reg.status}`}>{reg.status}</span></td>
                <td>
                  <span className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 border-transparent bg-zinc-100 text-zinc-900 shadow hover:bg-zinc-100/80 sm ${reg.attendanceMarked ? 'confirmed' : 'pending'}`}>
                    {reg.attendanceMarked ? 'Present' : 'Absent'}
                  </span>
                </td>
                <td className="text-sm">
                  {reg.attendanceTimestamp ? new Date(reg.attendanceTimestamp).toLocaleTimeString() : '-'}
                </td>
              </tr>
            ))}
            {registrations.length === 0 && (
              <tr><td colSpan="6" className="text-center">No participants registered yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Participants;

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
      alert(`✅ Attendance marked for ${res.data.participant.firstName}`);
    } catch (err) {
      alert(err.response?.data?.message || 'Invalid ticket');
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
    } catch (err) {
      console.error('Failed to download CSV');
    }
  };

  if (loading) return <div className="loading-spinner large" />;

  const presentCount = registrations.filter(r => r.attendanceMarked).length;

  return (
    <div className="participants-page section">
      <div className="flex-between">
        <div>
          <h1>👥 Participants</h1>
          <p>Manage registrations for {event?.eventName}</p>
        </div>
        <div className="actions">
          <button className="btn-secondary" onClick={downloadCSV}>⬇️ Export CSV</button>
          <button className="btn-primary" onClick={() => setShowScanner(!showScanner)}>
            {showScanner ? 'Close Scanner' : '📷 Scan QR Codes'}
          </button>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-pill">Total Registered: <strong>{registrations.length}</strong></div>
        <div className="stat-pill">Present: <strong>{presentCount}</strong></div>
        <div className="stat-pill">Absent: <strong>{registrations.length - presentCount}</strong></div>
      </div>

      {showScanner && (
        <div className="scanner-container card">
          <QRScanner onScanSuccess={handleScan} />
        </div>
      )}

      <div className="table-responsive">
        <table className="data-table">
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
                <td><span className={`status-badge sm ${reg.status}`}>{reg.status}</span></td>
                <td>
                  <span className={`status-badge sm ${reg.attendanceMarked ? 'confirmed' : 'pending'}`}>
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

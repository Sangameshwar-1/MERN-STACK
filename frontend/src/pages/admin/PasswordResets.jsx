import { useState, useEffect } from 'react';
import api from '../../utils/api';

const PasswordResets = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const fetchRequests = async () => {
    try {
      const res = await api.get('/admin/password-resets');
      setRequests(res.data);
    } catch (error) {
      console.error('Error fetching password reset requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    const loadRequests = async () => {
      try {
        const res = await api.get('/admin/password-resets');
        if (active) setRequests(res.data);
      } catch (error) {
        console.error('Error fetching password reset requests:', error);
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadRequests();

    return () => {
      active = false;
    };
  }, []);

  const handleAction = async (id, status) => {
    if (!window.confirm(`Are you sure you want to ${status} this request?`)) return;
    setProcessingId(id);
    try {
      const action = status === 'approved' ? 'approve' : 'reject';
      await api.put(`/admin/password-resets/${id}`, { action });
      fetchRequests(); // Refresh list
    } catch (error) {
      console.error('Action failed:', error);
      alert('Action failed. Please try again.');
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) return <div className="loading-spinner large" />;

  return (
    <div className="section animated-fade">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-6 border-b border-zinc-800">
        <h1> Password Reset Requests</h1>
      </div>

      <div className="w-full overflow-auto rounded-md border border-zinc-800">
        <table className="w-full caption-bottom text-sm">
          <thead>
            <tr>
              <th>Club Name</th>
              <th>Email</th>
              <th>Reason</th>
              <th>Date Requested</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center" style={{ padding: '2rem' }}>No password reset requests found.</td>
              </tr>
            ) : (
              requests.map(req => (
                <tr key={req._id}>
                  <td style={{ fontWeight: 'bold' }}>{req.organizer?.name || 'Unknown'}</td>
                  <td className="text-muted">{req.organizer?.email || 'Unknown'}</td>
                  <td>{req.reason}</td>
                  <td>{new Date(req.createdAt).toLocaleDateString()}</td>
                  <td>
                    <span className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 border-transparent bg-zinc-100 text-zinc-900 shadow hover:bg-zinc-100/80 ${req.status}`}>
                      {req.status}
                    </span>
                  </td>
                  <td>
                    {req.status === 'pending' ? (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          className="btn-sm" 
                          style={{ borderColor: 'var(--success)', color: 'var(--success)' }}
                          onClick={() => handleAction(req._id, 'approved')}
                          disabled={processingId === req._id}
                        >
                          {processingId === req._id ? 'Processing...' : ' Approve & Reset'}
                        </button>
                        <button 
                          className="btn-sm" 
                          style={{ borderColor: 'var(--error)', color: 'var(--error)' }}
                          onClick={() => handleAction(req._id, 'rejected')}
                          disabled={processingId === req._id}
                        >
                           Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-muted">No actions</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PasswordResets;

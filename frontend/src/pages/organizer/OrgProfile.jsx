import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const OrgProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requestingReset, setRequestingReset] = useState(false);
  const [resetMessage, setResetMessage] = useState('');
  const [resetError, setResetError] = useState('');
  const [reason, setReason] = useState('');

  useEffect(() => {
    api.get('/participants/profile')
      .then(res => {
        setProfile(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handlePasswordResetRequest = async (e) => {
    e.preventDefault();
    setRequestingReset(true);
    setResetMessage('');
    setResetError('');
    try {
      const res = await api.post('/participants/request-password-reset', { reason });
      setResetMessage(res.data.message || 'Password reset requested successfully!');
      setReason('');
    } catch (err) {
      setResetError(err.response?.data?.message || 'Failed to request reset');
    } finally {
      setRequestingReset(false);
    }
  };

  if (loading) return <div className="loading-spinner large" />;

  return (
    <div className="section animated-fade">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-6 border-b border-white/[0.08]">
        <h1> Organizer Profile</h1>
      </div>

      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-icon">️</div>
          <div className="stat-label">Club Name</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>{profile?.name}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">️</div>
          <div className="stat-label">Category</div>
          <div style={{ fontSize: '1.2rem', color: 'white', marginTop: '0.5rem' }}>{profile?.category}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"></div>
          <div className="stat-label">Contact Email</div>
          <div style={{ fontSize: '1rem', color: 'var(--accent)', marginTop: '0.5rem' }}>{profile?.email}</div>
        </div>
      </div>

      <div className="card" style={{ maxWidth: '600px', margin: '0 auto', padding: '3rem', borderRadius: '24px', backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <h3> Request Password Reset</h3>
        <p className="text-muted" style={{ marginBottom: '1.5rem' }}>
          If you need to reset your club's password to the default system password, submit a request to the Admin here.
        </p>
        
        {resetMessage && <div className="alert alert-success">{resetMessage}</div>}
        {resetError && <div className="alert alert-error">{resetError}</div>}

        <form onSubmit={handlePasswordResetRequest}>
          <div className="form-group">
            <label>Reason for reset</label>
            <textarea 
              rows="3" 
              placeholder="E.g. Handing over club to new batch..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-primary" disabled={requestingReset}>
            {requestingReset ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
      </div>

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <Link to="/change-password" className="btn-secondary"> Change My Password</Link>
      </div>
    </div>
  );
};

export default OrgProfile;

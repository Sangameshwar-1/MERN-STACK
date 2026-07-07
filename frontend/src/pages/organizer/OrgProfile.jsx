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
    api.get('/auth/me')
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

  if (loading) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <div className="loading-spinner w-10 h-10 border-2" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 animated-fade">
      {/* Header */}
      <div className="pb-6 mb-8 border-b border-white/10">
        <h1 className="text-2xl font-semibold text-white tracking-tight">Profile Settings</h1>
        <p className="text-sm text-slate-400 mt-1">Manage your organizer profile and security requests</p>
      </div>

      {/* Info Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/[0.02] border border-white/10 rounded-xl p-5">
          <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Club Name</div>
          <div className="text-lg font-semibold text-white mt-1.5">{profile?.name}</div>
        </div>
        <div className="bg-white/[0.02] border border-white/10 rounded-xl p-5">
          <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Category</div>
          <div className="text-lg font-semibold text-white mt-1.5">{profile?.category || 'General'}</div>
        </div>
        <div className="bg-white/[0.02] border border-white/10 rounded-xl p-5">
          <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Contact Email</div>
          <div className="text-lg font-semibold text-purple-400 mt-1.5 truncate" title={profile?.email}>
            {profile?.email}
          </div>
        </div>
      </div>

      {/* Reset Request Card */}
      <div className="bg-[#09090b] border border-white/10 rounded-2xl p-6 sm:p-8 max-w-xl mx-auto shadow-xl">
        <h3 className="text-lg font-semibold text-white">Request Password Reset</h3>
        <p className="text-sm text-slate-400 mt-1 mb-6">
          If you need to reset your club password to the default system password, submit a request to the system administrator.
        </p>
        
        {resetMessage && (
          <div className="alert alert-success mb-6 bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl text-emerald-200 text-sm">
            {resetMessage}
          </div>
        )}
        {resetError && (
          <div className="alert alert-error mb-6 bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-200 text-sm">
            {resetError}
          </div>
        )}

        <form onSubmit={handlePasswordResetRequest} className="space-y-5">
          <div className="form-group">
            <label className="block text-slate-300 text-sm font-medium mb-1.5">Reason for reset</label>
            <textarea 
              rows="3" 
              placeholder="e.g., Transitioning club management to next batch..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              className="w-full"
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-white hover:bg-slate-200 text-black font-semibold py-2.5 px-4 rounded-xl text-sm transition-all duration-200" 
            disabled={requestingReset}
          >
            {requestingReset ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
      </div>

      {/* Action Footer Links */}
      <div className="text-center mt-8 pt-4">
        <Link 
          to="/change-password" 
          className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium py-2.5 px-5 rounded-xl text-sm transition-all"
        >
          Change Account Password
        </Link>
      </div>
    </div>
  );
};

export default OrgProfile;

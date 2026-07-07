import { useState } from 'react';
import api from '../../utils/api';
import useAuth from '../../context/useAuth';
import { Eye, EyeOff } from 'lucide-react';

const ChangePassword = () => {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (newPassword !== confirmPassword) {
      return setError('New passwords do not match');
    }

    if (newPassword.length < 6) {
      return setError('New password must be at least 6 characters long');
    }

    setLoading(true);
    try {
      const res = await api.put('/participants/change-password', {
        currentPassword,
        newPassword
      });
      setMessage(res.data.message || 'Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4 sm:px-6 animated-fade">
      <div className="bg-[#09090b] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl">
        <h2 className="text-xl font-semibold text-white tracking-tight">Change Password</h2>
        <p className="text-sm text-slate-400 mt-1 mb-6">Secure your account with a new password.</p>

        {message && (
          <div className="alert alert-success mb-6 bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl text-emerald-200 text-sm">
            {message}
          </div>
        )}
        {error && (
          <div className="alert alert-error mb-6 bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-200 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="form-group">
            <label className="block text-slate-300 text-sm font-medium mb-1.5">Current Password</label>
            <div className="relative">
              <input 
                type={showCurrent ? 'text' : 'password'} 
                value={currentPassword} 
                onChange={e => setCurrentPassword(e.target.value)} 
                required 
                className="w-full pr-10"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
              >
                {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="block text-slate-300 text-sm font-medium mb-1.5">New Password</label>
            <div className="relative">
              <input 
                type={showNew ? 'text' : 'password'} 
                value={newPassword} 
                onChange={e => setNewPassword(e.target.value)} 
                required 
                className="w-full pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
              >
                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="block text-slate-300 text-sm font-medium mb-1.5">Confirm New Password</label>
            <div className="relative">
              <input 
                type={showConfirm ? 'text' : 'password'} 
                value={confirmPassword} 
                onChange={e => setConfirmPassword(e.target.value)} 
                required 
                className="w-full pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-white hover:bg-slate-200 text-black font-semibold py-2.5 px-4 rounded-xl text-sm transition-all duration-200 mt-2" 
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;

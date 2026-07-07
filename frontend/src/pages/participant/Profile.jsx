import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../utils/api';
import useAuth from '../../context/useAuth';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    const fetchProfile = async () => {
      try {
        const res = await api.get('/participants/profile');
        if (active) setProfile(res.data);
      } catch (err) {
        console.error(err);
        if (active) setError('Failed to load profile. Please try again.');
      } finally {
        if (active) setLoading(false);
      }
    };

    void fetchProfile();

    return () => {
      active = false;
    };
  }, []);

  const profilePic = profile?.profilePictureUrl ? `http://localhost:5000${profile.profilePictureUrl}` : null;

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
      setUploading(true);
      const res = await api.post('/auth/upload-profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      // Optionally refresh user context if needed, or just update local state
      setProfile((current) => current ? { ...current, profilePictureUrl: res.data.fileUrl } : current);
    } catch (err) {
      console.error(err);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="section text-center p-5">
        <div className="loading-spinner large"></div>
        <p className="text-muted">Loading profile details...</p>
      </div>
    );
  }

  if (error || !profile) {
    return <div className="alert alert-error">{error || 'Profile not found'}</div>;
  }

  return (
    <div className="section animated-fade">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-6 border-b border-zinc-800">
        <div>
          <h1> My Profile</h1>
          <p className="text-muted">Manage your personal information and preferences.</p>
        </div>
      </div>

      <div className="form-grid">
        {/* Personal Details Card */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-50 shadow p-6">
          <h3 className="mb-4" style={{ fontSize: '1.5rem', color: 'white' }}>Personal Details</h3>
          
          <div className="mb-4 d-flex align-items-center" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div 
              style={{ 
                width: '80px', height: '80px', borderRadius: '50%', 
                backgroundColor: 'var(--surface-light)', display: 'flex', 
                alignItems: 'center', justifyContent: 'center', overflow: 'hidden'
              }}
            >
              {profilePic ? (
                <img src={profilePic} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: '2rem' }}></span>
              )}
            </div>
            <div>
              <label className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 disabled:pointer-events-none disabled:opacity-50 bg-zinc-800 text-zinc-50 hover:bg-zinc-800/80 h-9 px-4 py-2" style={{ cursor: 'pointer', display: 'inline-block' }}>
                {uploading ? 'Uploading...' : 'Change Picture'}
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileUpload} disabled={uploading} />
              </label>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-muted text-sm mb-2">Full Name</p>
            <p style={{ fontSize: '1.2rem', fontWeight: '600' }}>{user.name || user.firstName + ' ' + user.lastName}</p>
          </div>
          
          <div className="mb-4">
            <p className="text-muted text-sm mb-2">Email Address</p>
            <p style={{ fontSize: '1.1rem' }}>{user.email}</p>
          </div>
          
          <div className="mb-4">
            <p className="text-muted text-sm mb-2">Roll Number / IIIT ID</p>
            <p style={{ fontSize: '1.1rem', fontFamily: 'monospace', letterSpacing: '1px' }}>{profile.rollNumber || 'N/A'}</p>
          </div>
        </div>

        {/* Preferences Card */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-50 shadow p-6" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 className="mb-4" style={{ fontSize: '1.5rem', color: 'white' }}>My Preferences</h3>
          
          <div className="mb-4">
            <p className="text-muted text-sm mb-2">Interests</p>
            {profile.interests && profile.interests.length > 0 ? (
              <div className="event-tags mt-2">
                {profile.interests.map(interest => (
                  <span key={interest} className="tag" style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#a78bfa', borderColor: 'rgba(139, 92, 246, 0.4)' }}>
                    {interest}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-muted">No interests selected.</p>
            )}
          </div>
          
          <div className="mb-5">
            <p className="text-muted text-sm mb-2">Followed Clubs</p>
            <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
              <span style={{ color: 'var(--primary)' }}>{profile.followedClubs?.length || 0}</span> Clubs
            </p>
          </div>
          
          <div style={{ marginTop: 'auto' }}>
            <button 
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 disabled:pointer-events-none disabled:opacity-50 bg-zinc-800 text-zinc-50 hover:bg-zinc-800/80 h-9 px-4 py-2 btn-full"
              onClick={() => navigate('/onboarding')}
            >
              Edit Preferences ️
            </button>
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <Link to="/change-password" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 disabled:pointer-events-none disabled:opacity-50 bg-zinc-800 text-zinc-50 hover:bg-zinc-800/80 h-9 px-4 py-2"> Change My Password</Link>
      </div>
    </div>
  );
};

export default Profile;

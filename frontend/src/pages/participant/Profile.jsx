import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../utils/api';
import useAuth from '../../context/useAuth';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { User, Edit2, Lock, Camera } from 'lucide-react';

const Profile = () => {
  const SERVER_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);

  const { user, logout, logoutFromAll } = useAuth();
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

  const profilePic = profile?.profilePictureUrl ? `${SERVER_URL}${profile.profilePictureUrl}` : null;

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
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 text-center">
        <div className="loading-spinner large"></div>
        <p className="text-slate-400 mt-4">Loading profile details...</p>
      </div>
    );
  }

  if (error || !profile) {
    return <div className="max-w-7xl mx-auto px-4 md:px-8 py-8"><div className="alert alert-error">{error || 'Profile not found'}</div></div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 animated-fade">
      <PageHeader 
        title="My Profile"
        description="Manage your personal information and preferences."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Details Card */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6 mb-8">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center overflow-hidden border border-white/10 relative group">
                {profilePic ? (
                  <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-8 h-8 text-slate-400" />
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity pointer-events-none">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <label className="btn-secondary cursor-pointer inline-flex items-center px-4 py-2 rounded-full text-sm font-medium">
                  {uploading ? 'Uploading...' : 'Change Picture'}
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                </label>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-sm font-medium text-slate-400 mb-1">Full Name</p>
                <p className="text-lg font-semibold text-white">{user.name || user.firstName + ' ' + user.lastName}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-slate-400 mb-1">Email Address</p>
                <p className="text-lg text-slate-200">{user.email}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-slate-400 mb-1">Roll Number / IIIT ID</p>
                <p className="text-lg font-mono text-slate-300 tracking-wider">{profile.rollNumber || 'N/A'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preferences Card */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>My Preferences</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col flex-1">
            <div className="mb-6">
              <p className="text-sm font-medium text-slate-400 mb-3">Interests</p>
              {profile.interests && profile.interests.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map(interest => (
                    <span key={interest} className="px-3 py-1 text-xs font-medium rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 capitalize">
                      {interest}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 text-sm">No interests selected.</p>
              )}
            </div>
            
            <div className="mb-8">
              <p className="text-sm font-medium text-slate-400 mb-1">Followed Clubs</p>
              <p className="text-xl font-bold text-white">
                <span className="text-purple-400 mr-2">{profile.followedClubs?.length || 0}</span>
                Clubs
              </p>
            </div>
            
            <div className="mt-auto pt-6 border-t border-white/5">
              <Button 
                variant="secondary"
                className="w-full flex items-center justify-center gap-2"
                onClick={() => navigate('/onboarding')}
              >
                <Edit2 className="w-4 h-4" /> Edit Preferences
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4 max-w-sm mx-auto mt-12 text-center">
        <Link to="/change-password">
          <Button variant="outline" className="w-full flex items-center justify-center gap-2">
            <Lock className="w-4 h-4" /> Change My Password
          </Button>
        </Link>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200 bg-white/5 border border-white/10 text-white hover:bg-white/10"
          >
            Logout
          </button>
          <button 
            onClick={logoutFromAll}
            className="w-full flex items-center justify-center py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/20"
          >
            Logout from All Devices
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;

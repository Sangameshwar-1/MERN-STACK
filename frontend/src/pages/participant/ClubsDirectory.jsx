import { useState, useEffect } from 'react';
import api from '../../utils/api';

const ClubsDirectory = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [followedClubs, setFollowedClubs] = useState([]);
  const [updatingFollow, setUpdatingFollow] = useState(false);

  useEffect(() => {
    let active = true;

    const loadData = async () => {
      setLoading(true);
      try {
        const clubsRes = await api.get('/participants/organizers');
        const profileRes = await api.get('/participants/profile');

        if (!active) return;

        setClubs(clubsRes.data);
        const followedIds = (profileRes.data.followedClubs || []).map(c => typeof c === 'object' ? c._id : c);
        setFollowedClubs(followedIds);
      } catch (err) {
        console.error(err);
        if (active) setError('Failed to load clubs. Please try again later.');
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadData();

    return () => {
      active = false;
    };
  }, []);

  const handleToggleFollow = async (clubId) => {
    if (updatingFollow) return;
    setUpdatingFollow(true);
    
    try {
      const isFollowing = followedClubs.includes(clubId);
      const newFollowedList = isFollowing 
        ? followedClubs.filter(id => id !== clubId)
        : [...followedClubs, clubId];
      
      await api.put('/participants/profile', {
        followedClubs: newFollowedList
      });
      
      setFollowedClubs(newFollowedList);
    } catch (err) {
      console.error("Failed to update follow status", err);
      alert("Failed to update. Please try again.");
    } finally {
      setUpdatingFollow(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <div className="loading-spinner w-10 h-10 border-2" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="alert alert-error bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-200 text-sm">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animated-fade">
      {/* Header */}
      <div className="pb-6 mb-8 border-b border-white/10">
        <h1 className="text-3xl font-bold text-white tracking-tight">Clubs Directory</h1>
        <p className="text-sm text-slate-400 mt-1">Discover and follow student organizations at Felicity</p>
      </div>

      {clubs.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-white/10 rounded-xl bg-white/[0.01]">
          <p className="text-slate-400 text-sm">No clubs or organizers found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs.map(club => {
            const isFollowing = followedClubs.includes(club._id);
            return (
              <div 
                key={club._id} 
                className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center hover:bg-white/[0.04] transition-all"
              >
                {/* Logo/Avatar */}
                <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden mb-4 shadow-sm">
                  {club.clubLogoUrl ? (
                    <img 
                      src={club.clubLogoUrl.startsWith('http') ? club.clubLogoUrl : `http://localhost:5000${club.clubLogoUrl}`} 
                      alt={club.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-slate-400">{club.name.charAt(0)}</span>
                  )}
                </div>

                <h3 className="text-lg font-semibold text-white tracking-tight mb-1">{club.name}</h3>
                <p className="text-xs text-slate-400 mb-6 truncate w-full">{club.email}</p>
                
                <button 
                  onClick={() => handleToggleFollow(club._id)}
                  disabled={updatingFollow}
                  className={`w-full py-2 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isFollowing 
                      ? 'bg-white/10 border border-white/10 text-white hover:bg-white/20' 
                      : 'bg-white text-black hover:bg-slate-200'
                  }`}
                >
                  {isFollowing ? 'Following' : 'Follow Club'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ClubsDirectory;

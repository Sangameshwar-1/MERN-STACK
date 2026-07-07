import { useState, useEffect } from 'react';
import api from '../../utils/api';

const ClubsDirectory = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // State for user's profile to track followed clubs
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
      <div className="section text-center p-5">
        <div className="loading-spinner large"></div>
        <p className="text-muted">Loading clubs directory...</p>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  return (
    <div className="section animated-fade">
      <div className="dashboard-header">
        <div>
          <h1>🏛️ Clubs Directory</h1>
          <p className="text-muted">Discover and follow student organizations at Felicity.</p>
        </div>
      </div>

      {clubs.length === 0 ? (
        <div className="empty-state">
          <p>No clubs or organizers found.</p>
        </div>
      ) : (
        <div className="events-grid">
          {clubs.map(club => {
            const isFollowing = followedClubs.includes(club._id);
            return (
              <div key={club._id} className="event-card">
                <div className="event-card-body text-center" style={{ padding: '2.5rem 1.5rem' }}>
                  <div className="club-avatar mx-auto mb-4" style={{ margin: '0 auto 1.5rem auto', width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--surface-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {club.clubLogoUrl ? (
                      <img src={club.clubLogoUrl.startsWith('http') ? club.clubLogoUrl : `http://localhost:5000${club.clubLogoUrl}`} alt={club.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontSize: '2.5rem' }}>{club.name.charAt(0)}</span>
                    )}
                  </div>
                  <h3 className="event-name" style={{ marginBottom: '0.5rem' }}>{club.name}</h3>
                  <p className="text-muted mb-4">{club.email}</p>
                  
                  <button 
                    className={`btn-primary btn-full ${isFollowing ? 'btn-secondary' : ''}`}
                    onClick={() => handleToggleFollow(club._id)}
                    disabled={updatingFollow}
                    style={{ transition: 'all 0.3s' }}
                  >
                    {isFollowing ? '✓ Following' : '+ Follow Club'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ClubsDirectory;

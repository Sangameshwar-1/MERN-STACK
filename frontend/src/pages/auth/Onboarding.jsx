import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import useAuth from '../../context/useAuth';

const INTERESTS = [
  'Technology', 'Music', 'Dance', 'Sports', 'Robotics',
  'AI/ML', 'Gaming', 'Photography', 'Art', 'Literature',
  'Science', 'Entrepreneurship', 'Coding', 'Film', 'Debate'
];

const Onboarding = () => {
  const { updateUser } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [organizers, setOrganizers] = useState([]);
  const [followedClubs, setFollowedClubs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/participants/organizers').then(res => setOrganizers(res.data));
  }, []);

  const toggleInterest = (interest) => {
    setSelectedInterests(prev =>
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const toggleClub = (id) => {
    setFollowedClubs(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await api.post('/auth/onboarding', { interests: selectedInterests, followedClubs });
      updateUser({ onboardingComplete: true, interests: selectedInterests, followedClubs });
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="onboarding-page">
      <div className="onboarding-card glass-panel" style={{ padding: '3rem', borderRadius: '24px', backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <div className="onboarding-progress">
          <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>1</div>
          <div className="progress-line" />
          <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>2</div>
        </div>

        {step === 1 && (
          <div className="onboarding-step">
            <h2>🎯 What are your interests?</h2>
            <p>Help us recommend events tailored for you</p>
            <div className="interests-grid">
              {INTERESTS.map(interest => (
                <button
                  key={interest}
                  className={`interest-chip ${selectedInterests.includes(interest) ? 'selected' : ''}`}
                  onClick={() => toggleInterest(interest)}
                >
                  {interest}
                </button>
              ))}
            </div>
            <div className="onboarding-actions">
              <button className="btn-ghost" onClick={() => setStep(2)}>Skip</button>
              <button className="btn-primary" onClick={() => setStep(2)}>Continue →</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="onboarding-step">
            <h2>🏛️ Follow Clubs & Organizers</h2>
            <p>Stay updated with events from your favourite clubs</p>
            <div className="clubs-list">
              {organizers.map(org => (
                <div
                  key={org._id}
                  className={`club-item ${followedClubs.includes(org._id) ? 'followed' : ''}`}
                  onClick={() => toggleClub(org._id)}
                >
                  <div className="club-avatar">{org.name.charAt(0)}</div>
                  <div>
                    <strong>{org.name}</strong>
                    <p>{org.category}</p>
                  </div>
                  <span className="follow-badge">{followedClubs.includes(org._id) ? '✓ Following' : '+ Follow'}</span>
                </div>
              ))}
              {organizers.length === 0 && <p className="empty-state">No clubs registered yet.</p>}
            </div>
            <div className="onboarding-actions">
              <button className="btn-ghost" onClick={handleSubmit} disabled={loading}>Skip & Finish</button>
              <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
                {loading ? <span className="spinner" /> : 'Finish Setup 🎉'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;

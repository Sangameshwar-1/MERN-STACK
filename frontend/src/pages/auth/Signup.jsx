import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';

const Signup = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const participantType = watch('participantType', 'non-iiit');

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      await registerUser(data);
      navigate('/onboarding');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card glass-panel" style={{ maxWidth: '520px', padding: '3rem', borderRadius: '24px', backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <div className="auth-header">
          <div className="auth-logo">🎪</div>
          <h1>Create Account</h1>
          <p>Join Felicity as a Participant</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                placeholder="John"
                {...register('firstName', { required: 'Required' })}
                className={errors.firstName ? 'input-error' : ''}
              />
              {errors.firstName && <span className="field-error">{errors.firstName.message}</span>}
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                placeholder="Doe"
                {...register('lastName', { required: 'Required' })}
                className={errors.lastName ? 'input-error' : ''}
              />
              {errors.lastName && <span className="field-error">{errors.lastName.message}</span>}
            </div>
          </div>

          <div className="form-group">
            <label>Participant Type</label>
            <div className="radio-group">
              <label className="radio-option">
                <input type="radio" value="iiit" {...register('participantType')} defaultChecked={false} />
                <span>IIIT Student</span>
              </label>
              <label className="radio-option">
                <input type="radio" value="non-iiit" {...register('participantType')} defaultChecked />
                <span>Non-IIIT Participant</span>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder={participantType === 'iiit' ? 'yourname@students.iiit.ac.in' : 'your@email.com'}
              {...register('email', { required: 'Email is required' })}
              className={errors.email ? 'input-error' : ''}
            />
            {participantType === 'iiit' && (
              <span className="field-hint">Must be an IIIT-issued email (@iiit.ac.in)</span>
            )}
            {errors.email && <span className="field-error">{errors.email.message}</span>}
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Min 8 characters"
              {...register('password', { required: 'Required', minLength: { value: 8, message: 'Min 8 characters' } })}
              className={errors.password ? 'input-error' : ''}
            />
            {errors.password && <span className="field-error">{errors.password.message}</span>}
          </div>

          <div className="form-group">
            <label>Contact Number</label>
            <input
              type="tel"
              placeholder="+91 98765 43210"
              {...register('contactNumber')}
            />
          </div>

          <div className="form-group">
            <label>College / Organization</label>
            <input
              type="text"
              placeholder="IIIT Hyderabad / Company Name"
              {...register('collegeOrOrg')}
            />
          </div>

          <button type="submit" className="btn-primary btn-full" disabled={loading}>
            {loading ? <span className="spinner" /> : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;

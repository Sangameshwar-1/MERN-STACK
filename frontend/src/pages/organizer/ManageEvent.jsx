import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../../utils/api';
import FormBuilder from '../../components/FormBuilder';

const ManageEvent = () => {
  const { id } = useParams();
  const isNew = id === 'new';
  const navigate = useNavigate();
  const { register, handleSubmit, reset, watch } = useForm({
    defaultValues: { eventType: 'normal', eligibility: 'all' }
  });

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [customForm, setCustomForm] = useState([]);
  const eventType = watch('eventType');
  const isTeamEvent = watch('isTeamEvent');

  useEffect(() => {
    if (!isNew) {
      api.get(`/events/${id}`).then(res => {
        const event = res.data;
        // Format dates for input type="datetime-local"
        event.eventStartDate = new Date(event.eventStartDate).toISOString().slice(0, 16);
        event.eventEndDate = new Date(event.eventEndDate).toISOString().slice(0, 16);
        event.registrationDeadline = new Date(event.registrationDeadline).toISOString().slice(0, 16);
        event.tags = event.tags?.join(', ');
        reset(event);
        setCustomForm(event.customForm || []);
        setLoading(false);
      }).catch(() => {
        setError('Failed to load event');
        setLoading(false);
      });
    }
  }, [id, isNew, reset]);

  const onSubmit = async (data) => {
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...data,
        tags: data.tags ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        customForm
      };

      if (isNew) {
        await api.post('/events', payload);
      } else {
        await api.put(`/events/${id}`, payload);
      }
      navigate('/organizer');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save event');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this event? This cannot be undone.')) return;
    try {
      await api.delete(`/events/${id}`);
      navigate('/organizer');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete event');
    }
  };

  if (loading) return <div className="loading-spinner large" />;

  return (
    <div className="manage-event-page section animated-fade">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-6 border-b border-white/[0.08]" style={{ borderBottom: 'none', marginBottom: '1rem' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {isNew ? ' Create New Event' : '️ Edit Event'}
        </h1>
        {!isNew && <button onClick={handleDelete} className="btn-ghost" style={{ color: 'var(--error)', border: '1px solid var(--error)', borderRadius: '8px', padding: '0.5rem 1rem' }}>️ Delete Event</button>}
      </div>

      <div className="card" style={{ padding: '3rem', maxWidth: '900px', margin: '0 auto', borderRadius: '24px', backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-grid">
            <div className="form-group full-width">
              <label>Event Name *</label>
              <input type="text" placeholder="E.g. Hackathon 2024" style={{ fontSize: '1.2rem', padding: '1rem' }} {...register('eventName', { required: true })} />
            </div>

            <div className="form-group full-width">
              <label>Description *</label>
              <textarea rows="5" placeholder="Describe the awesome things that will happen..." {...register('eventDescription', { required: true })} />
            </div>

            <div className="form-group">
              <label>Event Type *</label>
              <select {...register('eventType', { required: true })}>
                <option value="normal">️ Normal Event</option>
                <option value="merchandise"> Merchandise</option>
              </select>
            </div>

            <div className="form-group">
              <label>Eligibility *</label>
              <select {...register('eligibility', { required: true })}>
                <option value="all"> Everyone</option>
                <option value="iiit-only"> IIIT Only</option>
                <option value="non-iiit-only"> Non-IIIT Only</option>
              </select>
            </div>

            <div className="form-group">
              <label>Start Date & Time *</label>
              <input type="datetime-local" {...register('eventStartDate', { required: true })} />
            </div>

            <div className="form-group">
              <label>End Date & Time *</label>
              <input type="datetime-local" {...register('eventEndDate', { required: true })} />
            </div>

            <div className="form-group">
              <label>Registration Deadline *</label>
              <input type="datetime-local" {...register('registrationDeadline', { required: true })} />
            </div>

            <div className="form-group">
              <label>Tags (comma separated)</label>
              <input type="text" placeholder="tech, coding, fun" {...register('tags')} />
            </div>

            <div className="form-group">
              <label>Registration Fee (₹)</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>₹</span>
                <input type="number" min="0" placeholder="0 for Free" style={{ paddingLeft: '2.5rem' }} {...register('registrationFee')} />
              </div>
            </div>

            <div className="form-group">
              <label>Max Registrations Limit</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}></span>
                <input type="number" min="1" placeholder="Leave blank for unlimited" style={{ paddingLeft: '2.5rem' }} {...register('registrationLimit')} />
              </div>
            </div>

            {eventType === 'normal' && (
              <div className="form-group full-width" style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
                <label className="checkbox-filter" style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-main)' }}>
                  <input type="checkbox" {...register('isTeamEvent')} style={{ transform: 'scale(1.2)' }} />
                  Enable Team Registration
                </label>
                {isTeamEvent && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label>Min Team Size</label>
                      <input type="number" min="1" {...register('minTeamSize')} />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label>Max Team Size</label>
                      <input type="number" min="1" {...register('maxTeamSize')} />
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="form-group full-width" style={{ marginTop: '1rem', borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}> Custom Registration Form</h3>
              <p className="text-muted" style={{ marginBottom: '1.5rem' }}>Add custom text fields, dropdowns, or checkboxes that participants must fill out during registration.</p>
              <FormBuilder formFields={customForm} setFormFields={setCustomForm} />
            </div>

            <div className="form-group full-width" style={{ marginTop: '1rem' }}>
              <button type="submit" className="btn-primary btn-full" disabled={saving} style={{ padding: '1rem', fontSize: '1.1rem' }}>
                {saving ? <span className="spinner" /> : (isNew ? ' Launch Event' : ' Save Changes')}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManageEvent;

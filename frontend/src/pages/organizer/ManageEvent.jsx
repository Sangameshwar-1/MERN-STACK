import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../../utils/api';
import FormBuilder from '../../components/FormBuilder';

const ManageEvent = () => {
  const { id } = useParams();
  const isNew = id === 'new';
  const navigate = useNavigate();
  const { register, handleSubmit, reset, watch, setValue } = useForm({
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
    <div className="manage-event-page section">
      <div className="flex-between">
        <h1>{isNew ? '✨ Create Event' : '✏️ Edit Event'}</h1>
        {!isNew && <button onClick={handleDelete} className="btn-ghost" style={{ color: 'red' }}>Delete Event</button>}
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="card form-grid">
        <div className="form-group full-width">
          <label>Event Name *</label>
          <input type="text" {...register('eventName', { required: true })} />
        </div>

        <div className="form-group full-width">
          <label>Description *</label>
          <textarea rows="4" {...register('eventDescription', { required: true })} />
        </div>

        <div className="form-group">
          <label>Event Type *</label>
          <select {...register('eventType', { required: true })}>
            <option value="normal">Normal Event</option>
            <option value="merchandise">Merchandise</option>
          </select>
        </div>

        <div className="form-group">
          <label>Eligibility *</label>
          <select {...register('eligibility', { required: true })}>
            <option value="all">Everyone</option>
            <option value="iiit-only">IIIT Only</option>
            <option value="non-iiit-only">Non-IIIT Only</option>
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
          <label>Registration Fee (₹)</label>
          <input type="number" min="0" {...register('registrationFee')} />
        </div>

        <div className="form-group">
          <label>Max Registrations Limit</label>
          <input type="number" min="1" placeholder="Leave blank for unlimited" {...register('registrationLimit')} />
        </div>

        <div className="form-group">
          <label>Tags (comma separated)</label>
          <input type="text" placeholder="tech, coding, fun" {...register('tags')} />
        </div>

        {eventType === 'normal' && (
          <div className="form-group full-width">
            <label className="checkbox-filter">
              <input type="checkbox" {...register('isTeamEvent')} />
              Enable Team Registration
            </label>
          </div>
        )}

        {isTeamEvent && (
          <>
            <div className="form-group">
              <label>Min Team Size</label>
              <input type="number" min="1" {...register('minTeamSize')} />
            </div>
            <div className="form-group">
              <label>Max Team Size</label>
              <input type="number" min="1" {...register('maxTeamSize')} />
            </div>
          </>
        )}

        <div className="form-group full-width">
          <hr />
          <h3>Custom Registration Form</h3>
          <p className="text-sm">Add custom fields participants must fill during registration.</p>
          <FormBuilder formFields={customForm} setFormFields={setCustomForm} />
        </div>

        <div className="form-group full-width" style={{ marginTop: '20px' }}>
          <button type="submit" className="btn-primary btn-full" disabled={saving}>
            {saving ? <span className="spinner" /> : 'Save Event'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ManageEvent;

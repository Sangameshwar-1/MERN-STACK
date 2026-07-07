import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../../utils/api';
import FormBuilder from '../../components/FormBuilder';
import { ArrowLeft, Trash2, Save } from 'lucide-react';
import { Select } from '../../components/ui/Select';

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
  const eligibility = watch('eligibility');
  const isTeamEvent = watch('isTeamEvent');

  useEffect(() => {
    if (!isNew) {
      api.get(`/events/${id}`).then(res => {
        const event = res.data;
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

  if (loading) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <div className="loading-spinner w-10 h-10 border-2" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 animated-fade">
      <button 
        onClick={() => navigate('/organizer')} 
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" /> 
        Back to organizer dashboard
      </button>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            {isNew ? 'Create Event' : 'Edit Event'}
          </h1>
        </div>
        
        {!isNew && (
          <button 
            type="button"
            onClick={handleDelete} 
            className="flex items-center gap-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/25 px-4 py-2 rounded-lg text-sm font-medium transition-all"
          >
            <Trash2 className="w-4 h-4" />
            Delete Event
          </button>
        )}
      </div>

      <div className="bg-[#09090b] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl">
        {error && (
          <div className="alert alert-error mb-6 bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-200 text-sm">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          
          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">1. General</h2>

            <div className="grid grid-cols-1 gap-5">
              <div className="form-group">
                <label className="block text-slate-300 text-sm font-medium mb-1.5">
                  Event Name <span className="text-red-400">*</span>
                </label>
                <input 
                  type="text" 
                  placeholder="Hackathon 2026" 
                  className="w-full"
                  {...register('eventName', { required: true })} 
                />
              </div>

              <div className="form-group">
                <label className="block text-slate-300 text-sm font-medium mb-1.5">
                  Description <span className="text-red-400">*</span>
                </label>
                <textarea 
                  rows="5" 
                  placeholder="Provide details about the event schedule, guidelines, and prizes..." 
                  className="w-full"
                  {...register('eventDescription', { required: true })} 
                />
              </div>

              <div className="form-group">
                <label className="block text-slate-300 text-sm font-medium mb-1.5">
                  Tags (comma separated)
                </label>
                <input 
                  type="text" 
                  placeholder="coding, tech, design" 
                  className="w-full"
                  {...register('tags')} 
                />
              </div>
            </div>
          </div>

          <hr className="border-white/10" />

          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">2. Schedule & Eligibility</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="form-group">
                <label className="block text-slate-300 text-sm font-medium mb-1.5">
                  Start Date & Time <span className="text-red-400">*</span>
                </label>
                <input 
                  type="datetime-local" 
                  className="w-full"
                  {...register('eventStartDate', { required: true })} 
                />
              </div>

              <div className="form-group">
                <label className="block text-slate-300 text-sm font-medium mb-1.5">
                  End Date & Time <span className="text-red-400">*</span>
                </label>
                <input 
                  type="datetime-local" 
                  className="w-full"
                  {...register('eventEndDate', { required: true })} 
                />
              </div>

              <div className="form-group">
                <label className="block text-slate-300 text-sm font-medium mb-1.5">
                  Registration Deadline <span className="text-red-400">*</span>
                </label>
                <input 
                  type="datetime-local" 
                  className="w-full"
                  {...register('registrationDeadline', { required: true })} 
                />
              </div>

              <div className="form-group">
                <label className="block text-slate-300 text-sm font-medium mb-1.5">
                  Eligible Participants <span className="text-red-400">*</span>
                </label>
                <Select
                  value={eligibility}
                  onChange={(val) => setValue('eligibility', val)}
                  options={[
                    { value: 'all', label: 'Open for everyone' },
                    { value: 'iiit-only', label: 'IIIT students only' },
                    { value: 'non-iiit-only', label: 'Non-IIIT participants only' }
                  ]}
                />
              </div>

              <div className="form-group">
                <label className="block text-slate-300 text-sm font-medium mb-1.5">
                  Event Type <span className="text-red-400">*</span>
                </label>
                <Select
                  value={eventType}
                  onChange={(val) => setValue('eventType', val)}
                  options={[
                    { value: 'normal', label: 'Standard event' },
                    { value: 'merchandise', label: 'Merchandise purchase' }
                  ]}
                />
              </div>
            </div>
          </div>

          <hr className="border-white/10" />

          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">3. Pricing & Limits</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="form-group">
                <label className="block text-slate-300 text-sm font-medium mb-1.5">
                  Registration Fee
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
                  <input 
                    type="number" 
                    min="0" 
                    placeholder="0 (Free)" 
                    className="w-full pl-8" 
                    {...register('registrationFee')} 
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="block text-slate-300 text-sm font-medium mb-1.5">
                  Max Registration Limit
                </label>
                <input 
                  type="number" 
                  min="1" 
                  placeholder="Unlimited slots" 
                  className="w-full" 
                  {...register('registrationLimit')} 
                />
              </div>

              {eventType === 'normal' && (
                <div className="col-span-1 md:col-span-2 bg-white/[0.02] border border-white/10 p-5 rounded-xl space-y-4">
                  <label className="flex items-center gap-3 text-slate-200 font-medium cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded text-purple-600 bg-black/40 border-white/10"
                      {...register('isTeamEvent')} 
                    />
                    Enable team registration
                  </label>
                  
                  {isTeamEvent && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div className="form-group">
                        <label className="block text-slate-300 text-xs font-medium mb-1">Min Team Size</label>
                        <input type="number" min="1" className="w-full py-2 px-3 text-sm" {...register('minTeamSize')} />
                      </div>
                      <div className="form-group">
                        <label className="block text-slate-300 text-xs font-medium mb-1">Max Team Size</label>
                        <input type="number" min="1" className="w-full py-2 px-3 text-sm" {...register('maxTeamSize')} />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <hr className="border-white/10" />

          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">4. Custom Fields</h2>
            <FormBuilder formFields={customForm} setFormFields={setCustomForm} />
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={saving} 
              className="w-full bg-white hover:bg-slate-200 text-black font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-base"
            >
              {saving ? (
                <>
                  <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4.5 h-4.5" />
                  <span>{isNew ? 'Create Event' : 'Save Changes'}</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ManageEvent;

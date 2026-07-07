import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../utils/api';

const ManageOrganizers = () => {
  const [organizers, setOrganizers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  
  const { register, handleSubmit, reset } = useForm();

  const fetchOrganizers = async () => {
    try {
      const res = await api.get('/admin/organizers');
      setOrganizers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    const loadOrganizers = async () => {
      try {
        const res = await api.get('/admin/organizers');
        if (active) setOrganizers(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadOrganizers();

    return () => {
      active = false;
    };
  }, []);

  const onSubmit = async (data) => {
    try {
      const res = await api.post('/admin/organizers', data);
      setSuccessMsg(`Organizer created! Login: ${res.data.credentials.loginEmail} | Password: ${res.data.credentials.password}`);
      reset();
      fetchOrganizers();
      setShowAddForm(false);
    } catch {
      alert('Failed to create organizer');
    }
  };

  const toggleStatus = async (id) => {
    try {
      await api.put(`/admin/organizers/${id}/toggle`);
      fetchOrganizers();
    } catch {
      alert('Failed to update status');
    }
  };

  if (loading) return <div className="loading-spinner large" />;

  return (
    <div className="manage-organizers-page section">
      <div className="flex-between mb-4">
        <div>
          <h1>️ Manage Clubs & Organizers</h1>
          <p>Create and manage organizer accounts</p>
        </div>
        <button className="btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : '+ Add Organizer'}
        </button>
      </div>

      {successMsg && (
        <div className="alert alert-success" style={{ wordBreak: 'break-all' }}>
          <strong>{successMsg}</strong>
          <p className="text-sm mt-2">Make sure to copy these credentials. They have also been emailed to you.</p>
        </div>
      )}

      {showAddForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="card mb-5" style={{ padding: '3rem', borderRadius: '24px', backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <h3>Create New Organizer</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Club/Organizer Name</label>
              <input type="text" {...register('name', { required: true })} />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select {...register('category', { required: true })}>
                <option value="Tech Club">Tech Club</option>
                <option value="Cultural Club">Cultural Club</option>
                <option value="Sports Council">Sports Council</option>
                <option value="Fest Team">Fest Team</option>
              </select>
            </div>
          </div>
          <div className="form-group full-width">
            <label>Contact Email (Public)</label>
            <input type="email" {...register('contactEmail', { required: true })} />
          </div>
          <div className="form-group full-width">
            <label>Description</label>
            <textarea rows="3" {...register('description', { required: true })} />
          </div>
          <button type="submit" className="btn-primary">Create Account</button>
        </form>
      )}

      <div className="w-full overflow-auto table-responsive">
        <table className="w-full caption-bottom text-sm">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Login Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {organizers.map(org => (
              <tr key={org._id}>
                <td style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {org.clubLogoUrl ? (
                    <img src={`http://localhost:5000${org.clubLogoUrl}`} alt="logo" style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontSize: '1.5rem' }}></span>
                  )}
                  <strong>{org.name}</strong>
                </td>
                <td><span className="type-badge sm normal">{org.category}</span></td>
                <td>{org.email}</td>
                <td>
                  <span className={`status-badge sm ${org.isActive ? 'confirmed' : 'cancelled'}`}>
                    {org.isActive ? 'Active' : 'Disabled'}
                  </span>
                </td>
                <td>
                  <button onClick={() => toggleStatus(org._id)} className="btn-sm btn-ghost">
                    {org.isActive ? 'Disable' : 'Enable'}
                  </button>
                </td>
              </tr>
            ))}
            {organizers.length === 0 && (
              <tr><td colSpan="5" className="text-center">No organizers created yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageOrganizers;

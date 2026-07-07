import { useState } from 'react';

const FormBuilder = ({ formFields, setFormFields }) => {
  const [newField, setNewField] = useState({ fieldName: '', fieldType: 'text', label: '', required: false, options: '' });

  const addField = () => {
    if (!newField.fieldName || !newField.label) return alert('Field Name (camelCase) and Label are required');
    const fieldToAdd = { 
      ...newField, 
      options: ['dropdown', 'checkbox'].includes(newField.fieldType) ? newField.options.split(',').map(o => o.trim()) : []
    };
    setFormFields([...formFields, fieldToAdd]);
    setNewField({ fieldName: '', fieldType: 'text', label: '', required: false, options: '' });
  };

  const removeField = (index) => {
    setFormFields(formFields.filter((_, i) => i !== index));
  };

  return (
    <div className="form-builder">
      <div className="current-fields mb-4">
        {formFields.map((field, i) => (
          <div key={i} className="field-item card-sm flex-between mb-2">
            <div>
              <strong>{field.label}</strong> <span className="text-sm">({field.fieldType}) {field.required && '*'}</span>
              <p className="text-sm text-gray">{field.fieldName}</p>
              {field.options?.length > 0 && <p className="text-sm text-gray">Options: {field.options.join(', ')}</p>}
            </div>
            <button type="button" onClick={() => removeField(i)} className="btn-ghost" style={{ color: 'red' }}>✖</button>
          </div>
        ))}
      </div>

      <div className="add-field-card card bg-light">
        <h4>Add New Field</h4>
        <div className="form-row">
          <div className="form-group">
            <label>Field Name (e.g., tShirtSize)</label>
            <input type="text" value={newField.fieldName} onChange={e => setNewField({...newField, fieldName: e.target.value})} placeholder="No spaces" />
          </div>
          <div className="form-group">
            <label>Field Label (e.g., T-Shirt Size)</label>
            <input type="text" value={newField.label} onChange={e => setNewField({...newField, label: e.target.value})} />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Type</label>
            <select value={newField.fieldType} onChange={e => setNewField({...newField, fieldType: e.target.value})}>
              <option value="text">Text</option>
              <option value="email">Email</option>
              <option value="number">Number</option>
              <option value="textarea">Text Area</option>
              <option value="dropdown">Dropdown</option>
            </select>
          </div>
          <div className="form-group">
            <label className="checkbox-filter mt-4">
              <input type="checkbox" checked={newField.required} onChange={e => setNewField({...newField, required: e.target.checked})} />
              Required Field
            </label>
          </div>
        </div>

        {['dropdown', 'checkbox'].includes(newField.fieldType) && (
          <div className="form-group full-width">
            <label>Options (comma separated)</label>
            <input type="text" value={newField.options} onChange={e => setNewField({...newField, options: e.target.value})} placeholder="Small, Medium, Large" />
          </div>
        )}

        <button type="button" onClick={addField} className="btn-secondary">Add Field</button>
      </div>
    </div>
  );
};

export default FormBuilder;

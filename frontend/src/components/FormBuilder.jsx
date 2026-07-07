import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Select } from './ui/Select';

const FormBuilder = ({ formFields, setFormFields }) => {
  const [newField, setNewField] = useState({ fieldName: '', fieldType: 'text', label: '', required: false, options: '' });

  const addField = () => {
    if (!newField.fieldName || !newField.label) return alert('Field ID and Label are required');
    
    const cleanedFieldName = newField.fieldName
      .replace(/[^a-zA-Z0-9]/g, '')
      .replace(/^[A-Z]/, c => c.toLowerCase());

    const fieldToAdd = { 
      ...newField, 
      fieldName: cleanedFieldName,
      options: ['dropdown'].includes(newField.fieldType) && newField.options 
        ? newField.options.split(',').map(o => o.trim()).filter(Boolean) 
        : []
    };
    setFormFields([...formFields, fieldToAdd]);
    setNewField({ fieldName: '', fieldType: 'text', label: '', required: false, options: '' });
  };

  const removeField = (index) => {
    setFormFields(formFields.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Current Fields List */}
      {formFields.length > 0 && (
        <div className="space-y-3">
          <label className="block text-slate-300 text-sm font-semibold">
            Active Fields ({formFields.length})
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {formFields.map((field, i) => (
              <div 
                key={i} 
                className="bg-white/[0.02] border border-white/10 rounded-xl p-4 flex items-center justify-between transition-all hover:bg-white/[0.04]"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-white font-medium text-sm">{field.label}</strong>
                    {field.required && <span className="text-[10px] bg-red-500/10 text-red-400 px-2 py-0.5 rounded-full border border-red-500/20 font-medium">Required</span>}
                  </div>
                  <div className="flex flex-col gap-0.5 mt-1">
                    <span className="text-xs text-slate-400 font-mono">{field.fieldName} ({field.fieldType})</span>
                    {field.options?.length > 0 && (
                      <p className="text-xs text-slate-500 truncate max-w-[200px]">
                        Options: {field.options.join(', ')}
                      </p>
                    )}
                  </div>
                </div>
                <button 
                  type="button" 
                  onClick={() => removeField(i)} 
                  className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                  title="Remove Field"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add New Field Box */}
      <div className="bg-white/[0.02] border border-white/10 rounded-xl p-5 space-y-4">
        <h4 className="text-white font-medium text-sm">
          Add Custom Field
        </h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="form-group">
            <label className="block text-slate-300 text-xs font-medium mb-1.5">Field ID (camelCase)</label>
            <input 
              type="text" 
              value={newField.fieldName} 
              onChange={e => setNewField({...newField, fieldName: e.target.value})} 
              placeholder="e.g. foodPreference" 
              className="w-full text-sm py-2 px-3"
            />
          </div>
          <div className="form-group">
            <label className="block text-slate-300 text-xs font-medium mb-1.5">Field Label</label>
            <input 
              type="text" 
              value={newField.label} 
              onChange={e => setNewField({...newField, label: e.target.value})} 
              placeholder="e.g. Food Preference" 
              className="w-full text-sm py-2 px-3"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="form-group">
            <label className="block text-slate-300 text-xs font-medium mb-1.5">Input Type</label>
            <Select 
              value={newField.fieldType} 
              onChange={val => setNewField({...newField, fieldType: val})}
              options={[
                { value: 'text', label: 'Short Text' },
                { value: 'email', label: 'Email Address' },
                { value: 'number', label: 'Numeric Value' },
                { value: 'textarea', label: 'Paragraph / Text Area' },
                { value: 'dropdown', label: 'Dropdown Choices' }
              ]}
            />
          </div>
          
          <div className="flex items-center pt-5">
            <label className="flex items-center gap-3 text-slate-300 text-sm font-medium cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={newField.required} 
                onChange={e => setNewField({...newField, required: e.target.checked})}
                className="w-4 h-4 rounded text-purple-600 bg-black/40 border-white/10"
              />
              Required Field
            </label>
          </div>
        </div>

        {newField.fieldType === 'dropdown' && (
          <div className="form-group">
            <label className="block text-slate-300 text-xs font-medium mb-1.5">Dropdown Options (comma separated)</label>
            <input 
              type="text" 
              value={newField.options} 
              onChange={e => setNewField({...newField, options: e.target.value})} 
              placeholder="Veg, Non-Veg, Vegan" 
              className="w-full text-sm py-2 px-3"
            />
          </div>
        )}

        <button 
          type="button" 
          onClick={addField} 
          className="inline-flex items-center justify-center gap-1.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium py-2 px-4 rounded-lg text-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Field
        </button>
      </div>
    </div>
  );
};

export default FormBuilder;

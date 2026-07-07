import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export const Select = ({ value, onChange, options = [], placeholder = 'Select...', className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-2.5 px-4 bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 rounded-xl text-white outline-none transition-all focus:border-purple-500/50 text-left text-sm"
      >
        <span className={selectedOption ? 'text-white' : 'text-slate-500'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-[#0c0c12]/95 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="py-1">
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-between px-5 py-3 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors text-left"
              >
                <span>{opt.label}</span>
                {value === opt.value && <Check className="w-4 h-4 text-purple-400" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

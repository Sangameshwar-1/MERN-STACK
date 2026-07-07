import React from 'react';

export const Badge = ({ className = '', variant = 'default', children, ...props }) => {
  const baseStyles = 'status-badge';
  
  const variants = {
    default: 'border-purple-500/30 bg-purple-500/10 text-purple-300',
    secondary: 'border-white/10 bg-white/5 text-slate-300',
    destructive: 'border-red-500/30 bg-red-500/10 text-red-300',
    outline: 'border-white/20 text-slate-200 bg-transparent',
    success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
  };

  const variantStyle = variants[variant] || variants.default;

  return (
    <div className={`${baseStyles} ${variantStyle} ${className}`} {...props}>
      {children}
    </div>
  );
};
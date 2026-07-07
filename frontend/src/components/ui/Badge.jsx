import React from 'react';

export const Badge = ({ className = '', variant = 'default', children, ...props }) => {
  const baseStyles = 'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2';
  
  const variants = {
    default: 'border-transparent bg-zinc-100 text-zinc-900 shadow hover:bg-zinc-100/80',
    secondary: 'border-transparent bg-zinc-800 text-zinc-100 hover:bg-zinc-800/80',
    destructive: 'border-transparent bg-red-900 text-zinc-100 shadow hover:bg-red-900/80',
    outline: 'text-zinc-100 border-zinc-800',
    success: 'border-transparent bg-emerald-900 text-emerald-100 shadow hover:bg-emerald-900/80'
  };

  const variantStyle = variants[variant] || variants.default;

  return (
    <div className={`${baseStyles} ${variantStyle} ${className}`} {...props}>
      {children}
    </div>
  );
};
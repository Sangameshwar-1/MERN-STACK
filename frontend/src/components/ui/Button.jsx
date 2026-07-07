import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = React.forwardRef(({ className = '', variant = 'primary', size = 'default', isLoading, children, ...props }, ref) => {
  const baseStyles = 'inline-flex items-center justify-center whitespace-nowrap transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 disabled:pointer-events-none disabled:opacity-50';
  
  const variants = {
    primary: 'btn-primary',
    destructive: 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 rounded-full px-6 py-2 shadow-sm',
    outline: 'border border-white/10 bg-transparent shadow-sm hover:bg-white/5 text-white rounded-full px-6 py-2',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
    link: 'text-purple-400 underline-offset-4 hover:underline'
  };

  const sizes = {
    default: '',
    sm: 'btn-sm',
    lg: 'px-10 py-4 text-lg rounded-full',
    icon: 'h-10 w-10 p-0 rounded-full flex items-center justify-center'
  };

  const variantStyle = variants[variant] || variants.primary;
  const sizeStyle = sizes[size] || sizes.default;

  return (
    <button ref={ref} className={`${baseStyles} ${variantStyle} ${sizeStyle} ${className}`} disabled={isLoading} {...props}>
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
});
Button.displayName = 'Button';
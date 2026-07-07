import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = React.forwardRef(({ className = '', variant = 'primary', size = 'default', isLoading, children, ...props }, ref) => {
  const baseStyles = 'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 disabled:pointer-events-none disabled:opacity-50';
  
  const variants = {
    primary: 'bg-zinc-100 text-zinc-900 shadow-sm hover:bg-zinc-200/90',
    destructive: 'bg-red-900 text-zinc-100 hover:bg-red-900/90',
    outline: 'border border-zinc-800 bg-transparent shadow-sm hover:bg-zinc-800 hover:text-zinc-50',
    secondary: 'bg-zinc-800 text-zinc-50 hover:bg-zinc-800/80',
    ghost: 'hover:bg-zinc-800 hover:text-zinc-50',
    link: 'text-zinc-50 underline-offset-4 hover:underline'
  };

  const sizes = {
    default: 'h-9 px-4 py-2',
    sm: 'h-8 rounded-md px-3 text-xs',
    lg: 'h-10 rounded-md px-8',
    icon: 'h-9 w-9'
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
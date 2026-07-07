import React from 'react';

export const Card = React.forwardRef(({ className = '', ...props }, ref) => (
  <div ref={ref} className={`glass-panel text-white ${className}`} {...props} />
));
Card.displayName = 'Card';

export const CardHeader = React.forwardRef(({ className = '', ...props }, ref) => (
  <div ref={ref} className={`flex flex-col space-y-1.5 p-8 pb-6 border-b border-white/5 ${className}`} {...props} />
));
CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef(({ className = '', ...props }, ref) => (
  <h3 ref={ref} className={`font-semibold leading-none tracking-tight ${className}`} {...props} />
));
CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef(({ className = '', ...props }, ref) => (
  <p ref={ref} className={`text-sm text-slate-400 ${className}`} {...props} />
));
CardDescription.displayName = 'CardDescription';

export const CardContent = React.forwardRef(({ className = '', ...props }, ref) => (
  <div ref={ref} className={`p-8 pt-6 ${className}`} {...props} />
));
CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef(({ className = '', ...props }, ref) => (
  <div ref={ref} className={`flex items-center p-8 pt-0 ${className}`} {...props} />
));
CardFooter.displayName = 'CardFooter';
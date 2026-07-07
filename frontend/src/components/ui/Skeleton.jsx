import React from 'react';

export const Skeleton = ({ className = '', ...props }) => {
  return (
    <div
      className={`animate-pulse rounded-md bg-white/[0.05] ${className}`}
      {...props}
    />
  );
};
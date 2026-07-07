import React from 'react';

export const PageHeader = ({ title, description, actions }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-6 border-b border-white/[0.08]">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">{title}</h1>
        {description && <p className="text-slate-400 mt-1">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
};
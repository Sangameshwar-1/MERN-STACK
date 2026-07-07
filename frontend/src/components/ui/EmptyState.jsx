import React from 'react';

export const EmptyState = ({ title, description, icon: Icon, action }) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 p-8 text-center animate-in fade-in-50 bg-black/10 backdrop-blur-sm">
      {Icon && (
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.05] mb-4">
          <Icon className="h-6 w-6 text-slate-400" />
        </div>
      )}
      <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
      <p className="mb-4 mt-2 text-sm text-slate-400 max-w-sm mx-auto">{description}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
};
import React from 'react';

export const EmptyState = ({ title, description, icon: Icon, action }) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-800 p-8 text-center animate-in fade-in-50">
      {Icon && (
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 mb-4">
          <Icon className="h-6 w-6 text-zinc-400" />
        </div>
      )}
      <h3 className="mt-4 text-lg font-semibold text-zinc-100">{title}</h3>
      <p className="mb-4 mt-2 text-sm text-zinc-400 max-w-sm mx-auto">{description}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
};
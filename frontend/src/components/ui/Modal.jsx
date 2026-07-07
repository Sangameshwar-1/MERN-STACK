import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, description, children, footer }) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => document.body.style.overflow = 'unset';
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
      <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border glass-panel p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] duration-200 md:w-full">
        <div className="flex flex-col space-y-1.5 text-center sm:text-left">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold leading-none tracking-tight text-white">{title}</h2>
            <button onClick={onClose} className="rounded-sm opacity-70 ring-offset-zinc-950 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-zinc-800 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-white/[0.05] data-[state=open]:text-slate-400">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </div>
          {description && <p className="text-sm text-slate-400">{description}</p>}
        </div>
        <div className="py-4">
          {children}
        </div>
        {footer && (
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
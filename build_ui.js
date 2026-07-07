const fs = require('fs');
const path = require('path');

const uiDir = path.join(__dirname, 'frontend', 'src', 'components', 'ui');
if (!fs.existsSync(uiDir)) fs.mkdirSync(uiDir, { recursive: true });

const components = {
  'Button.jsx': `
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
    <button ref={ref} className={\`\${baseStyles} \${variantStyle} \${sizeStyle} \${className}\`} disabled={isLoading} {...props}>
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
});
Button.displayName = 'Button';
`,

  'Card.jsx': `
import React from 'react';

export const Card = React.forwardRef(({ className = '', ...props }, ref) => (
  <div ref={ref} className={\`rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-50 shadow \${className}\`} {...props} />
));
Card.displayName = 'Card';

export const CardHeader = React.forwardRef(({ className = '', ...props }, ref) => (
  <div ref={ref} className={\`flex flex-col space-y-1.5 p-6 \${className}\`} {...props} />
));
CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef(({ className = '', ...props }, ref) => (
  <h3 ref={ref} className={\`font-semibold leading-none tracking-tight \${className}\`} {...props} />
));
CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef(({ className = '', ...props }, ref) => (
  <p ref={ref} className={\`text-sm text-zinc-400 \${className}\`} {...props} />
));
CardDescription.displayName = 'CardDescription';

export const CardContent = React.forwardRef(({ className = '', ...props }, ref) => (
  <div ref={ref} className={\`p-6 pt-0 \${className}\`} {...props} />
));
CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef(({ className = '', ...props }, ref) => (
  <div ref={ref} className={\`flex items-center p-6 pt-0 \${className}\`} {...props} />
));
CardFooter.displayName = 'CardFooter';
`,

  'Badge.jsx': `
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
    <div className={\`\${baseStyles} \${variantStyle} \${className}\`} {...props}>
      {children}
    </div>
  );
};
`,

  'Input.jsx': `
import React from 'react';

export const Input = React.forwardRef(({ className = '', type = 'text', ...props }, ref) => {
  return (
    <input
      type={type}
      className={\`flex h-9 w-full rounded-md border border-zinc-800 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 disabled:cursor-not-allowed disabled:opacity-50 \${className}\`}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = 'Input';
`,

  'Label.jsx': `
import React from 'react';

export const Label = React.forwardRef(({ className = '', ...props }, ref) => (
  <label
    ref={ref}
    className={\`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 \${className}\`}
    {...props}
  />
));
Label.displayName = 'Label';
`,

  'DataTable.jsx': `
import React from 'react';

export const DataTable = ({ columns, data, emptyMessage = "No results." }) => {
  return (
    <div className="w-full overflow-auto rounded-md border border-zinc-800">
      <table className="w-full caption-bottom text-sm">
        <thead className="[&_tr]:border-b [&_tr]:border-zinc-800">
          <tr className="border-b transition-colors hover:bg-zinc-900/50 data-[state=selected]:bg-zinc-800">
            {columns.map((col, i) => (
              <th key={i} className="h-10 px-4 text-left align-middle font-medium text-zinc-400">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="[&_tr:last-child]:border-0">
          {data.length > 0 ? (
            data.map((row, i) => (
              <tr key={i} className="border-b border-zinc-800 transition-colors hover:bg-zinc-900/50 data-[state=selected]:bg-zinc-800">
                {columns.map((col, j) => (
                  <td key={j} className="p-4 align-middle text-zinc-300">
                    {col.render ? col.render(row) : row[col.accessorKey]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="h-24 text-center text-zinc-500">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
`,

  'PageHeader.jsx': `
import React from 'react';

export const PageHeader = ({ title, description, actions }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-6 border-b border-zinc-800">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-100">{title}</h1>
        {description && <p className="text-zinc-400 mt-1">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
};
`,

  'StatsCard.jsx': `
import React from 'react';
import { Card, CardContent } from './Card';

export const StatsCard = ({ title, value, icon: Icon, description }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <h3 className="tracking-tight text-sm font-medium text-zinc-400">{title}</h3>
          {Icon && <Icon className="h-4 w-4 text-zinc-500" />}
        </div>
        <div className="text-2xl font-bold text-zinc-100">{value}</div>
        {description && <p className="text-xs text-zinc-500 mt-1">{description}</p>}
      </CardContent>
    </Card>
  );
};
`,

  'EmptyState.jsx': `
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
`,

  'Skeleton.jsx': `
import React from 'react';

export const Skeleton = ({ className = '', ...props }) => {
  return (
    <div
      className={\`animate-pulse rounded-md bg-zinc-800 \${className}\`}
      {...props}
    />
  );
};
`,
  'Modal.jsx': `
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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
      <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-zinc-800 bg-zinc-950 p-6 shadow-lg duration-200 sm:rounded-lg md:w-full">
        <div className="flex flex-col space-y-1.5 text-center sm:text-left">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold leading-none tracking-tight text-zinc-100">{title}</h2>
            <button onClick={onClose} className="rounded-sm opacity-70 ring-offset-zinc-950 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-zinc-800 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-zinc-800 data-[state=open]:text-zinc-400">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </div>
          {description && <p className="text-sm text-zinc-400">{description}</p>}
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
`
};

for (const [filename, content] of Object.entries(components)) {
  fs.writeFileSync(path.join(uiDir, filename), content.trim());
}

console.log('UI Components built successfully.');

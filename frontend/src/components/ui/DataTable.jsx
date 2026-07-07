import React from 'react';

export const DataTable = ({ columns, data, emptyMessage = "No results." }) => {
  return (
    <div className="w-full overflow-auto table-responsive">
      <table className="w-full caption-bottom text-sm">
        <thead className="[&_tr]:border-b [&_tr]:border-white/[0.08]">
          <tr className="border-b transition-colors hover:bg-white/[0.05]/50 data-[state=selected]:bg-white/[0.05]">
            {columns.map((col, i) => (
              <th key={i} className="h-10 px-4 text-left align-middle font-medium text-slate-400">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="[&_tr:last-child]:border-0">
          {data.length > 0 ? (
            data.map((row, i) => (
              <tr key={i} className="border-b border-white/[0.08] transition-colors hover:bg-white/[0.05]/50 data-[state=selected]:bg-white/[0.05]">
                {columns.map((col, j) => (
                  <td key={j} className="p-4 align-middle text-slate-300">
                    {col.render ? col.render(row) : row[col.accessorKey]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="h-24 text-center text-slate-500">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
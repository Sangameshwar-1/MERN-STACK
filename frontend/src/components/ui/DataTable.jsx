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
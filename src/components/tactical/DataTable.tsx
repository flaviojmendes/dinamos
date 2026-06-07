import React from 'react';
import { cn } from './cn';

export interface Column<T> {
  key: string;
  header: React.ReactNode;
  render: (row: T) => React.ReactNode;
  className?: string;
  /** Right-align (use for numeric columns). */
  align?: 'left' | 'right' | 'center';
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  /** Optional expanded content rendered under a row. */
  renderExpanded?: (row: T) => React.ReactNode;
  expandedKey?: string | null;
  empty?: React.ReactNode;
  className?: string;
}

const alignClass = { left: 'text-left', right: 'text-right', center: 'text-center' } as const;

/** Tactical data table with a sticky uppercase mono header and optional expandable rows. */
export function DataTable<T>({
  columns,
  rows,
  rowKey,
  onRowClick,
  renderExpanded,
  expandedKey,
  empty,
  className,
}: DataTableProps<T>) {
  return (
    <div className={cn('w-full overflow-x-auto', className)}>
      <table className="w-full border-collapse text-sm">
        <thead className="sticky top-0 z-10">
          <tr className="bg-slate-50 dark:bg-tactical-surface">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  'label-mono border-b border-slate-200 dark:border-tactical-border px-3 py-2.5',
                  alignClass[col.align ?? 'left'],
                  col.className,
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td
                colSpan={columns.length}
                className="px-3 py-10 text-center font-sans text-sm text-slate-500 dark:text-tactical-dim"
              >
                {empty ?? 'No records'}
              </td>
            </tr>
          )}
          {rows.map((row) => {
            const key = rowKey(row);
            const isExpanded = expandedKey === key;
            return (
              <React.Fragment key={key}>
                <tr
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cn(
                    'border-b border-slate-100 dark:border-tactical-border/60 transition-colors',
                    onRowClick && 'cursor-pointer hover:bg-slate-50 dark:hover:bg-tactical-raised',
                    isExpanded && 'bg-slate-50 dark:bg-tactical-raised',
                  )}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        'px-3 py-3 font-sans text-slate-800 dark:text-tactical-text align-middle',
                        alignClass[col.align ?? 'left'],
                        col.className,
                      )}
                    >
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
                {isExpanded && renderExpanded && (
                  <tr className="bg-slate-50 dark:bg-tactical-raised/60">
                    <td colSpan={columns.length} className="px-3 pb-4 pt-0">
                      {renderExpanded(row)}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;

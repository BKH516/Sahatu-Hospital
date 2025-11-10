import React from 'react';

type Align = 'left' | 'center' | 'right';
type Tone = 'slate' | 'blue' | 'green' | 'purple' | 'indigo' | 'teal' | 'amber';

export interface EnhancedTableColumn<T> {
  id: string;
  header: React.ReactNode;
  render: (row: T, index: number) => React.ReactNode;
  align?: Align;
  minWidth?: string;
  className?: string;
}

export interface EmptyStateConfig {
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
}

interface EnhancedTableProps<T> {
  data: T[];
  columns: EnhancedTableColumn<T>[];
  getRowId: (row: T, index: number) => React.Key;
  isRTL?: boolean;
  loading?: boolean;
  loadingLabel?: React.ReactNode;
  emptyState?: EmptyStateConfig;
  renderMobileCard?: (row: T, index: number) => React.ReactNode;
  zebra?: boolean;
  className?: string;
  tone?: Tone;
  primaryColumnId?: string;
}

const toneStyles: Record<
  Tone,
  {
    container: string;
    mobileBorder: string;
    headerBackground: string;
    headerText: string;
    divider: string;
    zebraA: string;
    zebraB: string;
    hover: string;
    spinner: string;
    accentBorder: string;
  }
> = {
  slate: {
    container:
      'border-slate-200/80 dark:border-slate-700/60 bg-gradient-to-br from-white/95 via-white/90 to-slate-50/70 dark:from-slate-900/85 dark:via-slate-900/70 dark:to-slate-800/60 shadow-slate-100/30 dark:shadow-none',
    mobileBorder: 'border-slate-200/80 dark:border-slate-700/60',
    headerBackground:
      'from-slate-50/95 via-slate-100/90 to-slate-200/70 dark:from-slate-900/60 dark:via-slate-900/45 dark:to-slate-800/35',
    headerText: 'text-slate-500 dark:text-slate-300',
    divider: 'border-slate-200/70 dark:border-slate-700/60',
    zebraA: 'bg-white/96 dark:bg-slate-900/65',
    zebraB: 'bg-slate-50/80 dark:bg-slate-900/45',
    hover: 'hover:bg-slate-100/80 dark:hover:bg-slate-800/60',
    spinner: 'border-slate-400',
    accentBorder: 'border-s-slate-400 dark:border-s-slate-500'
  },
  blue: {
    container:
      'border-sky-200/80 dark:border-sky-900/40 bg-gradient-to-br from-white/95 via-sky-50/80 to-cyan-50/60 dark:from-slate-900/85 dark:via-sky-900/40 dark:to-cyan-900/35 shadow-sky-100/40 dark:shadow-none',
    mobileBorder: 'border-sky-200/80 dark:border-sky-900/50',
    headerBackground:
      'from-sky-100/90 via-sky-200/80 to-cyan-200/70 dark:from-sky-900/55 dark:via-sky-900/45 dark:to-cyan-900/35',
    headerText: 'text-sky-700 dark:text-sky-200',
    divider: 'border-sky-200/70 dark:border-sky-900/40',
    zebraA: 'bg-white/96 dark:bg-slate-900/60',
    zebraB: 'bg-sky-50/80 dark:bg-sky-900/30',
    hover: 'hover:bg-sky-100/70 dark:hover:bg-sky-900/45',
    spinner: 'border-sky-400',
    accentBorder: 'border-s-sky-400 dark:border-s-sky-500'
  },
  green: {
    container:
      'border-emerald-200/80 dark:border-emerald-900/40 bg-gradient-to-br from-white/95 via-emerald-50/80 to-lime-50/60 dark:from-slate-900/85 dark:via-emerald-900/40 dark:to-lime-900/35 shadow-emerald-100/40 dark:shadow-none',
    mobileBorder: 'border-emerald-200/80 dark:border-emerald-900/50',
    headerBackground:
      'from-emerald-100/90 via-emerald-200/80 to-teal-200/70 dark:from-emerald-900/55 dark:via-emerald-900/45 dark:to-teal-900/35',
    headerText: 'text-emerald-700 dark:text-emerald-200',
    divider: 'border-emerald-200/70 dark:border-emerald-900/40',
    zebraA: 'bg-white/96 dark:bg-slate-900/60',
    zebraB: 'bg-emerald-50/80 dark:bg-emerald-900/30',
    hover: 'hover:bg-emerald-100/70 dark:hover:bg-emerald-900/45',
    spinner: 'border-emerald-400',
    accentBorder: 'border-s-emerald-400 dark:border-s-emerald-500'
  },
  purple: {
    container:
      'border-violet-200/80 dark:border-violet-900/40 bg-gradient-to-br from-white/95 via-violet-50/80 to-indigo-50/60 dark:from-slate-900/85 dark:via-violet-900/40 dark:to-indigo-900/35 shadow-violet-100/40 dark:shadow-none',
    mobileBorder: 'border-violet-200/80 dark:border-violet-900/50',
    headerBackground:
      'from-violet-100/90 via-violet-200/80 to-indigo-200/70 dark:from-violet-900/55 dark:via-violet-900/45 dark:to-indigo-900/35',
    headerText: 'text-violet-700 dark:text-violet-200',
    divider: 'border-violet-200/70 dark:border-violet-900/40',
    zebraA: 'bg-white/96 dark:bg-slate-900/60',
    zebraB: 'bg-violet-50/80 dark:bg-violet-900/30',
    hover: 'hover:bg-violet-100/70 dark:hover:bg-violet-900/45',
    spinner: 'border-violet-400',
    accentBorder: 'border-s-violet-400 dark:border-s-violet-500'
  },
  indigo: {
    container:
      'border-indigo-200/80 dark:border-indigo-900/40 bg-gradient-to-br from-white/95 via-indigo-50/75 to-slate-50/60 dark:from-slate-900/85 dark:via-indigo-900/40 dark:to-slate-900/35 shadow-indigo-100/40 dark:shadow-none',
    mobileBorder: 'border-indigo-200/80 dark:border-indigo-900/50',
    headerBackground:
      'from-indigo-100/90 via-indigo-200/80 to-slate-200/70 dark:from-indigo-900/55 dark:via-indigo-900/45 dark:to-slate-900/35',
    headerText: 'text-indigo-700 dark:text-indigo-200',
    divider: 'border-indigo-200/70 dark:border-indigo-900/40',
    zebraA: 'bg-white/96 dark:bg-slate-900/60',
    zebraB: 'bg-indigo-50/80 dark:bg-indigo-900/30',
    hover: 'hover:bg-indigo-100/70 dark:hover:bg-indigo-900/45',
    spinner: 'border-indigo-400',
    accentBorder: 'border-s-indigo-400 dark:border-s-indigo-500'
  },
  teal: {
    container:
      'border-teal-200/80 dark:border-teal-900/40 bg-gradient-to-br from-white/95 via-teal-50/80 to-cyan-50/60 dark:from-slate-900/85 dark:via-teal-900/40 dark:to-cyan-900/35 shadow-teal-100/40 dark:shadow-none',
    mobileBorder: 'border-teal-200/80 dark:border-teal-900/50',
    headerBackground:
      'from-teal-100/90 via-teal-200/80 to-cyan-200/70 dark:from-teal-900/55 dark:via-teal-900/45 dark:to-cyan-900/35',
    headerText: 'text-teal-700 dark:text-teal-200',
    divider: 'border-teal-200/70 dark:border-teal-900/40',
    zebraA: 'bg-white/96 dark:bg-slate-900/60',
    zebraB: 'bg-teal-50/80 dark:bg-teal-900/30',
    hover: 'hover:bg-teal-100/70 dark:hover:bg-teal-900/45',
    spinner: 'border-teal-400',
    accentBorder: 'border-s-teal-400 dark:border-s-teal-500'
  },
  amber: {
    container:
      'border-amber-200/80 dark:border-amber-900/40 bg-gradient-to-br from-white/95 via-amber-50/80 to-orange-50/60 dark:from-slate-900/85 dark:via-amber-900/40 dark:to-orange-900/35 shadow-amber-100/40 dark:shadow-none',
    mobileBorder: 'border-amber-200/80 dark:border-amber-900/50',
    headerBackground:
      'from-amber-100/90 via-amber-200/80 to-orange-200/70 dark:from-amber-900/55 dark:via-amber-900/45 dark:to-orange-900/35',
    headerText: 'text-amber-700 dark:text-amber-200',
    divider: 'border-amber-200/70 dark:border-amber-900/40',
    zebraA: 'bg-white/96 dark:bg-slate-900/60',
    zebraB: 'bg-amber-50/80 dark:bg-amber-900/30',
    hover: 'hover:bg-amber-100/70 dark:hover:bg-amber-900/45',
    spinner: 'border-amber-400',
    accentBorder: 'border-s-amber-400 dark:border-s-amber-500'
  }
};

const getAlignmentClass = (align: Align | undefined, isRTL?: boolean) => {
  if (align === 'center') return 'text-center';
  if (align === 'right') return isRTL ? 'text-left' : 'text-right';
  return isRTL ? 'text-right' : 'text-left';
};

const EnhancedTable = <T,>({
  data,
  columns,
  getRowId,
  isRTL,
  loading,
  loadingLabel,
  emptyState,
  renderMobileCard,
  zebra = true,
  className,
  tone = 'slate',
  primaryColumnId
}: EnhancedTableProps<T>) => {
  const styles = toneStyles[tone];

  return (
    <div className={`space-y-4 ${className ?? ''}`}>
      {/* Mobile layout */}
      <div className="grid gap-3 md:hidden">
        {loading && (
          <div className={`rounded-2xl border ${styles.mobileBorder} bg-white/96 dark:bg-slate-900/75 p-4 animate-pulse`}>
            <div className="space-y-3">
              <div className="h-4 w-1/2 bg-slate-200/80 dark:bg-slate-700 rounded" />
              <div className="h-3 w-full bg-slate-200/70 dark:bg-slate-800 rounded" />
              <div className="h-3 w-3/4 bg-slate-200/70 dark:bg-slate-800 rounded" />
            </div>
          </div>
        )}
        {!loading && data.length === 0 && emptyState && (
          <div
            className={`rounded-2xl border ${styles.mobileBorder} bg-white/98 dark:bg-slate-900/78 p-6 text-center space-y-3 shadow-sm`}
          >
            {emptyState.icon && <div className="flex justify-center text-3xl">{emptyState.icon}</div>}
            <div className="space-y-1">
              <p className="text-base font-semibold text-slate-900 dark:text-slate-100">{emptyState.title}</p>
              {emptyState.description && (
                <p className="text-sm text-slate-500 dark:text-slate-400">{emptyState.description}</p>
              )}
            </div>
            {emptyState.action}
          </div>
        )}
        {!loading &&
          data.length > 0 &&
          data.map((row, index) => (
            <div
              key={getRowId(row, index)}
              className={`rounded-2xl border ${styles.mobileBorder} bg-white/98 dark:bg-slate-900/78 shadow-xl shadow-black/5 dark:shadow-none`}
            >
              {renderMobileCard ? (
                renderMobileCard(row, index)
              ) : (
                <div className="p-5 space-y-4">
                  {columns.map((column) => (
                    <div key={column.id} className="flex flex-col gap-1">
                      <span className={`text-xs font-semibold uppercase tracking-wide ${styles.headerText}`}>
                        {column.header}
                      </span>
                      <span className="text-sm text-slate-800 dark:text-slate-100">
                        {column.render(row, index)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
      </div>

      {/* Desktop layout */}
      <div className="hidden md:block">
        <div className={`overflow-hidden rounded-3xl border ${styles.container} backdrop-blur-md`}>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm text-slate-700 dark:text-slate-200">
              <thead className={`bg-gradient-to-r ${styles.headerBackground}`}>
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.id}
                      style={{ minWidth: column.minWidth }}
                      className={`px-5 py-4 text-[0.7rem] font-semibold uppercase tracking-[0.14em] ${styles.headerText} ${getAlignmentClass(
                        column.align,
                        isRTL
                      )} border-b ${styles.divider} ${column.className ?? ''}`}
                    >
                      <span className="inline-flex items-center gap-2 whitespace-nowrap">
                        {column.header}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={columns.length} className="px-6 py-14">
                      <div className="flex flex-col items-center gap-3 text-center">
                        <div className={`animate-spin rounded-full h-10 w-10 border-b-2 ${styles.spinner}`} />
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {loadingLabel ?? 'Loading data...'}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
                {!loading && data.length === 0 && emptyState && (
                  <tr>
                    <td colSpan={columns.length} className="px-6 py-14 text-center text-slate-500 dark:text-slate-400">
                      <div className="flex flex-col items-center gap-4">
                        {emptyState.icon && <div className="text-4xl">{emptyState.icon}</div>}
                        <div className="space-y-1">
                          <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">{emptyState.title}</p>
                          {emptyState.description && (
                            <p className="text-sm text-slate-500 dark:text-slate-400">{emptyState.description}</p>
                          )}
                        </div>
                        {emptyState.action}
                      </div>
                    </td>
                  </tr>
                )}
                {!loading &&
                  data.map((row, index) => (
                    <tr
                      key={getRowId(row, index)}
                      className={`transition-all duration-200 ${
                        zebra && index % 2 === 1 ? styles.zebraB : styles.zebraA
                      } ${styles.hover} border-b ${styles.divider}`}
                    >
                      {columns.map((column) => {
                        const isPrimary = primaryColumnId && column.id === primaryColumnId;
                        const accentClass = isPrimary
                          ? `border-s-4 ${styles.accentBorder} ps-4 pe-2 font-semibold text-slate-900 dark:text-slate-100`
                          : '';
                        return (
                          <td
                            key={column.id}
                            className={`px-5 py-4 align-middle ${getAlignmentClass(column.align, isRTL)} ${
                              column.className ?? ''
                            } ${accentClass}`}
                          >
                            {column.render(row, index)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedTable;



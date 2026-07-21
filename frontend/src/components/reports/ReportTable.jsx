import StatusBadge from '../common/StatusBadge';
import Skeleton from '../common/Skeleton';
import EmptyState from '../common/EmptyState';

/**
 * ReportTable - Tabular view of reports.
 *
 * @param {object} props
 * @param {Array} [props.reports]
 * @param {boolean} [props.loading=false]
 * @param {function} [props.onRowClick]
 * @param {function} [props.onDownload]
 * @param {Array<{key:string, label:string, render?:function}>} [props.columns]
 * @param {string} [props.className]
 */
function ReportTable({
  reports,
  loading = false,
  onRowClick,
  onDownload,
  columns,
  className = '',
}) {
  const defaultColumns = [
    { key: 'title', label: 'Report' },
    { key: 'type', label: 'Type' },
    {
      key: 'format',
      label: 'Format',
      render: (item) => item.format && <span className="uppercase text-xs font-mono font-medium text-gray-600 dark:text-gray-400">{item.format}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (item) => item.status ? <StatusBadge status={item.status} size="sm" /> : '—',
    },
    { key: 'date', label: 'Date' },
    {
      key: 'size',
      label: 'Size',
      render: (item) => {
        if (!item.size) return '—';
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(item.size) / Math.log(1024));
        return `${(item.size / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
      },
    },
    {
      key: 'actions',
      label: '',
      render: (item) =>
        onDownload ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDownload(item);
            }}
            className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
            aria-label={`Download ${item.title}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </button>
        ) : null,
    },
  ];

  const activeColumns = columns || defaultColumns;

  if (loading) {
    return (
      <div className={className}>
        <Skeleton.Table rows={5} columns={activeColumns.length} />
      </div>
    );
  }

  if (!reports || reports.length === 0) {
    return (
      <EmptyState
        title="No reports found"
        message="There are no reports matching your criteria."
      />
    );
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700" role="table" aria-label="Reports table">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            {activeColumns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
          {reports.map((report, index) => (
            <tr
              key={report.id || index}
              onClick={() => onRowClick?.(report)}
              className={`
                transition-colors
                ${onRowClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50' : ''}
              `}
              role="row"
              aria-label={`Report: ${report.title}`}
            >
              {activeColumns.map((col) => (
                <td
                  key={col.key}
                  className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap"
                >
                  {col.render ? col.render(report) : report[col.key] ?? '—'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReportTable;

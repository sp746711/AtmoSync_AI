import RiskBadge from './RiskBadge';
import Skeleton from '../common/Skeleton';
import EmptyState from '../common/EmptyState';

/**
 * RiskTable - Tabular view of risk assessments.
 *
 * @param {object} props
 * @param {Array} [props.risks]
 * @param {boolean} [props.loading=false]
 * @param {function} [props.onRowClick]
 * @param {Array<{key:string, label:string, render?:function}>} [props.columns]
 * @param {string} [props.className]
 */
function RiskTable({
  risks,
  loading = false,
  onRowClick,
  columns,
  className = '',
}) {
  const defaultColumns = [
    { key: 'title', label: 'Risk' },
    {
      key: 'level',
      label: 'Level',
      render: (item) => <RiskBadge level={item.level} size="sm" />,
    },
    { key: 'category', label: 'Category' },
    { key: 'region', label: 'Region' },
    {
      key: 'score',
      label: 'Score',
      render: (item) =>
        item.score != null ? (
          <div className="flex items-center gap-2">
            <div className="flex-1 max-w-[100px]">
              <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    item.score > 75
                      ? 'bg-red-500'
                      : item.score > 50
                      ? 'bg-orange-500'
                      : item.score > 25
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                  }`}
                  style={{ width: `${item.score}%` }}
                />
              </div>
            </div>
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{item.score}</span>
          </div>
        ) : (
          '—'
        ),
    },
    { key: 'date', label: 'Date' },
  ];

  const activeColumns = columns || defaultColumns;

  if (loading) {
    return (
      <div className={className}>
        <Skeleton.Table rows={5} columns={activeColumns.length} />
      </div>
    );
  }

  if (!risks || risks.length === 0) {
    return (
      <EmptyState
        title="No risks found"
        message="There are no risk assessments matching your criteria."
      />
    );
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700" role="table" aria-label="Risk assessments table">
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
          {risks.map((risk, index) => (
            <tr
              key={risk.id || index}
              onClick={() => onRowClick?.(risk)}
              className={`
                transition-colors
                ${onRowClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50' : ''}
              `}
              role="row"
              aria-label={`Risk: ${risk.title}`}
            >
              {activeColumns.map((col) => (
                <td
                  key={col.key}
                  className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap"
                >
                  {col.render ? col.render(risk) : risk[col.key] ?? '—'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RiskTable;

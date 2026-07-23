import Card from '../common/Card';
import Skeleton from '../common/Skeleton';

/**
 * StatusCard - Displays a key operational status with icon and supporting metrics.
 *
 * @param {object} props
 * @param {string} props.title
 * @param {string|number} props.value
 * @param {string} [props.status] - 'active'|'warning'|'critical'|'inactive'
 * @param {React.ReactNode} [props.icon]
 * @param {Array<{label:string, value:string|number}>} [props.metrics]
 * @param {boolean} [props.loading=false]
 * @param {function} [props.onClick]
 * @param {string} [props.className]
 */
function StatusCard({ title, value, status = 'active', icon, metrics, loading = false, onClick, className = '' }) {
  if (loading) {
    return (
      <Card padding="lg" className={className}>
        <Skeleton.Card />
      </Card>
    );
  }

  const statusColors = {
    active: { dot: 'bg-green-500', bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-700 dark:text-green-300' },
    warning: { dot: 'bg-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20', text: 'text-yellow-700 dark:text-yellow-300' },
    critical: { dot: 'bg-red-500', bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-700 dark:text-red-300' },
    inactive: { dot: 'bg-gray-400', bg: 'bg-gray-50 dark:bg-gray-800', text: 'text-gray-500 dark:text-gray-400' },
  };

  const colors = statusColors[status] || statusColors.active;

  return (
    <Card padding="lg" hoverable={!!onClick} onClick={onClick} className={className} ariaLabel={`Status: ${title}`}>
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{title}</p>
          <p className={`mt-1 text-2xl font-bold text-gray-900 dark:text-white truncate`}>{value ?? '—'}</p>
        </div>
        {icon && (
          <div className={`shrink-0 ml-3 p-2.5 rounded-lg ${colors.bg} ${colors.text}`} aria-hidden="true">
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 mt-3">
        <span className={`w-2 h-2 rounded-full ${colors.dot}`} aria-hidden="true" />
        <span className={`text-xs font-medium capitalize ${colors.text}`}>{status}</span>
      </div>

      {metrics && metrics.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 grid grid-cols-2 gap-2">
          {metrics.map((metric) => (
            <div key={metric.label}>
              <p className="text-xs text-gray-400 dark:text-gray-500">{metric.label}</p>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{metric.value}</p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

export default StatusCard;


import Card from '../common/Card';
import StatusBadge from '../common/StatusBadge';
import Skeleton from '../common/Skeleton';

/**
 * AlertCard - Displays a single alert with severity, message, and timestamp.
 *
 * @param {object} props
 * @param {object} props.alert
 * @param {string} props.alert.id
 * @param {string} props.alert.type - 'temperature'|'humidity'|'battery'|'delay'|'shock'|'risk'
 * @param {string} props.alert.severity - 'critical'|'high'|'medium'|'low'
 * @param {string} props.alert.title
 * @param {string} [props.alert.message]
 * @param {string} [props.alert.shipmentId]
 * @param {string} [props.alert.timestamp]
 * @param {boolean} [props.alert.isRead]
 * @param {boolean} [props.loading=false]
 * @param {function} [props.onClick]
 * @param {function} [props.onDismiss]
 * @param {string} [props.className]
 */
function AlertCard({ alert, loading = false, onClick, onDismiss, className = '' }) {
  if (loading) {
    return (
      <Card padding="md" className={className}>
        <Skeleton.Card />
      </Card>
    );
  }

  if (!alert) return null;

  const severityConfig = {
    critical: { color: 'bg-red-500', badge: 'critical' },
    high: { color: 'bg-orange-500', badge: 'high' },
    medium: { color: 'bg-yellow-500', badge: 'warning' },
    low: { color: 'bg-blue-500', badge: 'info' },
  };

  const typeIcons = {
    temperature: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8V4m0 4a4 4 0 014 4v4a4 4 0 01-4 4m0-8a4 4 0 00-4 4v4a4 4 0 004 4" />
      </svg>
    ),
    humidity: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    battery: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    delay: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    shock: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
      </svg>
    ),
    risk: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  };

  const config = severityConfig[alert.severity?.toLowerCase()] || severityConfig.medium;
  const icon = typeIcons[alert.type?.toLowerCase()] || typeIcons.risk;

  return (
    <Card
      padding="md"
      hoverable={!!onClick}
      onClick={() => onClick?.(alert)}
      className={`border-l-4 ${config.color.replace('bg-', 'border-')} ${className}`}
      ariaLabel={`Alert: ${alert.title}`}
    >
      <div className="flex items-start gap-3">
        {/* Severity indicator */}
        <div className={`shrink-0 p-2 rounded-lg ${config.color} bg-opacity-10 dark:bg-opacity-20 text-white`}>
          <span className="text-current opacity-80">{icon}</span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {alert.title}
            </p>
            <StatusBadge status={config.badge} size="sm" />
          </div>

          {alert.message && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
              {alert.message}
            </p>
          )}

          <div className="flex items-center gap-3 mt-2">
            {alert.shipmentId && (
              <span className="text-xs text-gray-400 dark:text-gray-500">
                Shipment: {alert.shipmentId}
              </span>
            )}
            {alert.timestamp && (
              <span className="text-xs text-gray-400 dark:text-gray-500">{alert.timestamp}</span>
            )}
          </div>
        </div>

        {/* Dismiss */}
        {onDismiss && (
          <button
            onClick={(e) => { e.stopPropagation(); onDismiss(alert); }}
            className="shrink-0 p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Dismiss alert"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </Card>
  );
}

export default AlertCard;


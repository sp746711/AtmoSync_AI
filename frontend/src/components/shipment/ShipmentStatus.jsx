import StatusBadge from '../common/StatusBadge';

/**
 * ShipmentStatus - Enhanced shipment status display.
 *
 * @param {object} props
 * @param {object} props.shipment
 * @param {boolean} [props.showDetails=true]
 * @param {'sm'|'md'|'lg'} [props.size='md']
 * @param {string} [props.className]
 */
function ShipmentStatus({
  shipment,
  showDetails = true,
  size = 'md',
  className = '',
}) {
  if (!shipment) return null;

  const statusDetails = {
    in_transit: {
      label: 'In Transit',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      text: 'text-blue-700 dark:text-blue-300',
    },
    pending: {
      label: 'Pending',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      text: 'text-yellow-700 dark:text-yellow-300',
    },
    completed: {
      label: 'Completed',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bg: 'bg-green-50 dark:bg-green-900/20',
      text: 'text-green-700 dark:text-green-300',
    },
    delayed: {
      label: 'Delayed',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bg: 'bg-red-50 dark:bg-red-900/20',
      text: 'text-red-700 dark:text-red-300',
    },
    at_risk: {
      label: 'At Risk',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      bg: 'bg-orange-50 dark:bg-orange-900/20',
      text: 'text-orange-700 dark:text-orange-300',
    },
    failed: {
      label: 'Failed',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
      bg: 'bg-red-50 dark:bg-red-900/20',
      text: 'text-red-700 dark:text-red-300',
    },
  };

  const status = shipment.status?.toLowerCase() || 'pending';
  const config = statusDetails[status] || {
    label: shipment.status || 'Unknown',
    icon: null,
    bg: 'bg-gray-50 dark:bg-gray-800',
    text: 'text-gray-700 dark:text-gray-300',
  };

  const sizeStyles = {
    sm: { icon: 'w-4 h-4', text: 'text-xs', padding: 'p-2' },
    md: { icon: 'w-5 h-5', text: 'text-sm', padding: 'p-3' },
    lg: { icon: 'w-6 h-6', text: 'text-base', padding: 'p-4' },
  };

  const s = sizeStyles[size] || sizeStyles.md;

  return (
    <div className={`${className}`}>
      {/* Status Badge */}
      <div className={`inline-flex items-center gap-2 rounded-lg ${config.bg} ${config.text} ${s.padding}`}>
        {config.icon && <span className={s.icon}>{config.icon}</span>}
        <span className={`font-medium ${s.text}`}>{config.label}</span>
      </div>

      {/* Details */}
      {showDetails && (
        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-medium text-gray-700 dark:text-gray-300">ID:</span>
            <span>{shipment.id || shipment.trackingNumber || '—'}</span>
          </div>

          {(shipment.origin || shipment.destination) && (
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-medium text-gray-700 dark:text-gray-300">Route:</span>
              <span>
                {shipment.origin || '—'} → {shipment.destination || '—'}
              </span>
            </div>
          )}

          {shipment.eta && (
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-medium text-gray-700 dark:text-gray-300">ETA:</span>
              <span>{shipment.eta}</span>
            </div>
          )}

          {shipment.temperature != null && (
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium text-gray-700 dark:text-gray-300">Temperature:</span>
              <span
                className={`font-medium ${
                  shipment.temperature > 8
                    ? 'text-red-600 dark:text-red-400'
                    : shipment.temperature < 2
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-green-600 dark:text-green-400'
                }`}
              >
                {shipment.temperature}°C
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ShipmentStatus;

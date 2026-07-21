import StatusBadge from '../common/StatusBadge';
import Skeleton from '../common/Skeleton';
import EmptyState from '../common/EmptyState';

/**
 * RecentShipments - Compact list of recent shipments.
 *
 * @param {object} props
 * @param {Array} [props.shipments]
 * @param {boolean} [props.loading=false]
 * @param {number} [props.maxItems=5]
 * @param {function} [props.onShipmentClick]
 * @param {string} [props.className]
 */
function RecentShipments({
  shipments,
  loading = false,
  maxItems = 5,
  onShipmentClick,
  className = '',
}) {
  if (loading) {
    return (
      <div className={`space-y-3 ${className}`}>
        <Skeleton variant="text" count={5} />
      </div>
    );
  }

  if (!shipments || shipments.length === 0) {
    return (
      <EmptyState
        title="No recent shipments"
        message="There are no recent shipments to display."
        size="sm"
      />
    );
  }

  const displayed = shipments.slice(0, maxItems);

  return (
    <div className={className} role="list" aria-label="Recent shipments">
      <div className="space-y-2">
        {displayed.map((shipment, index) => (
          <button
            key={shipment.id || index}
            onClick={() => onShipmentClick?.(shipment)}
            className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left focus:outline-none focus:ring-2 focus:ring-primary-500"
            role="listitem"
            aria-label={`Shipment ${shipment.id || shipment.trackingNumber || ''}`}
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {shipment.id || shipment.trackingNumber || `Shipment #${index + 1}`}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                {shipment.origin} → {shipment.destination}
              </p>
            </div>

            <div className="flex items-center gap-3 ml-3 shrink-0">
              {/* Temperature indicator */}
              {shipment.temperature != null && (
                <span
                  className={`text-xs font-medium ${
                    shipment.temperature > 8
                      ? 'text-red-600 dark:text-red-400'
                      : shipment.temperature < 2
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-green-600 dark:text-green-400'
                  }`}
                >
                  {shipment.temperature}°C
                </span>
              )}
              <StatusBadge status={shipment.status} size="sm" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default RecentShipments;

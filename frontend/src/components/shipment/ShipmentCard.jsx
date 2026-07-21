import Card from '../common/Card';
import StatusBadge from '../common/StatusBadge';
import Skeleton from '../common/Skeleton';

/**
 * ShipmentCard - Shipment information card.
 *
 * @param {object} props
 * @param {object} props.shipment
 * @param {string} props.shipment.id
 * @param {string} [props.shipment.trackingNumber]
 * @param {string} props.shipment.status
 * @param {string} [props.shipment.origin]
 * @param {string} [props.shipment.destination]
 * @param {number} [props.shipment.temperature]
 * @param {number} [props.shipment.humidity]
 * @param {string} [props.shipment.product]
 * @param {string} [props.shipment.eta]
 * @param {string} [props.shipment.lastUpdated]
 * @param {number} [props.shipment.batteryLevel]
 * @param {boolean} [props.loading=false]
 * @param {function} [props.onClick]
 * @param {string} [props.className]
 */
function ShipmentCard({
  shipment,
  loading = false,
  onClick,
  className = '',
}) {
  if (loading) {
    return (
      <Card padding="lg" className={className}>
        <Skeleton.Card />
      </Card>
    );
  }

  if (!shipment) return null;

  return (
    <Card
      padding="lg"
      hoverable={!!onClick}
      onClick={() => onClick?.(shipment)}
      className={className}
      ariaLabel={`Shipment ${shipment.trackingNumber || shipment.id}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
            {shipment.trackingNumber || shipment.id}
          </p>
          {shipment.product && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{shipment.product}</p>
          )}
        </div>
        <StatusBadge status={shipment.status} size="sm" />
      </div>

      {/* Route */}
      {(shipment.origin || shipment.destination) && (
        <div className="flex items-center gap-2 mb-3 text-sm text-gray-600 dark:text-gray-400">
          <span className="truncate">{shipment.origin || '—'}</span>
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
          <span className="truncate">{shipment.destination || '—'}</span>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
        {/* Temperature */}
        {shipment.temperature != null && (
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Temperature</p>
            <p className={`text-sm font-medium mt-0.5 ${
              shipment.temperature > 8 ? 'text-red-600 dark:text-red-400' :
              shipment.temperature < 2 ? 'text-blue-600 dark:text-blue-400' :
              'text-green-600 dark:text-green-400'
            }`}>
              {shipment.temperature}°C
            </p>
          </div>
        )}

        {/* Humidity */}
        {shipment.humidity != null && (
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Humidity</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">
              {shipment.humidity}%
            </p>
          </div>
        )}

        {/* ETA */}
        {shipment.eta && (
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">ETA</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5 truncate">
              {shipment.eta}
            </p>
          </div>
        )}

        {/* Battery */}
        {shipment.batteryLevel != null && (
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Battery</p>
            <p className={`text-sm font-medium mt-0.5 ${
              shipment.batteryLevel < 20 ? 'text-red-600 dark:text-red-400' :
              shipment.batteryLevel < 50 ? 'text-amber-600 dark:text-amber-400' :
              'text-green-600 dark:text-green-400'
            }`}>
              {shipment.batteryLevel}%
            </p>
          </div>
        )}

        {/* Last Updated */}
        {shipment.lastUpdated && (
          <div className="col-span-2">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Updated {shipment.lastUpdated}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}

export default ShipmentCard;

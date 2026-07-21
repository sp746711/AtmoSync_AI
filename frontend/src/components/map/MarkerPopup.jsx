import StatusBadge from '../common/StatusBadge';

/**
 * MarkerPopup - Popup content for map markers.
 *
 * @param {object} props
 * @param {object} props.marker
 * @param {string} [props.marker.title]
 * @param {string} [props.marker.status]
 * @param {string} [props.marker.description]
 * @param {number} [props.marker.temperature]
 * @param {string} [props.marker.eta]
 * @param {string} [props.marker.origin]
 * @param {string} [props.marker.destination]
 * @param {Array} [props.fields] - Additional fields to display
 */
function MarkerPopup({ marker, fields }) {
  if (!marker) return null;

  const additionalFields = fields || [
    { key: 'origin', label: 'Origin' },
    { key: 'destination', label: 'Destination' },
    { key: 'eta', label: 'ETA' },
    { key: 'temperature', label: 'Temperature', render: (v) => (v != null ? `${v}°C` : null) },
    { key: 'humidity', label: 'Humidity', render: (v) => (v != null ? `${v}%` : null) },
  ];

  return (
    <div className="min-w-[200px] max-w-[300px]">
      {/* Title */}
      <div className="mb-2">
        <p className="text-sm font-semibold text-gray-900 truncate">
          {marker.title || marker.id || marker.trackingNumber || 'Shipment'}
        </p>
        {marker.status && (
          <div className="mt-1">
            <StatusBadge status={marker.status} size="sm" />
          </div>
        )}
      </div>

      {/* Description */}
      {marker.description && (
        <p className="text-xs text-gray-500 mb-2">{marker.description}</p>
      )}

      {/* Details */}
      <div className="space-y-1">
        {additionalFields.map((field) => {
          const value = marker[field.key];
          if (value == null) return null;

          const displayValue = field.render ? field.render(value) : value;

          return (
            <div key={field.key} className="flex justify-between gap-2 text-xs">
              <span className="text-gray-500">{field.label}</span>
              <span className="font-medium text-gray-700 truncate max-w-[140px]">
                {displayValue}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MarkerPopup;

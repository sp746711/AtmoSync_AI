/**
 * MapLegend - Legend explaining marker colors on the map.
 *
 * @param {object} props
 * @param {Array} [props.markers]
 * @param {Array<{status:string, label:string, color:string}>} [props.items]
 * @param {string} [props.title='Legend']
 * @param {string} [props.className]
 */
function MapLegend({
  markers,
  items,
  title = 'Legend',
  className = '',
}) {
  // Derive unique status/color combinations from markers
  const legendItems =
    items ||
    (markers
      ? [...new Set(markers.filter((m) => m.status).map((m) => m.status))]
          .map((status) => ({
            status,
            label: status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' '),
            color: getStatusColor(status),
          }))
      : []);

  if (legendItems.length === 0) return null;

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 border border-gray-200 dark:border-gray-700 ${className}`}
      role="complementary"
      aria-label="Map legend"
    >
      <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
        {title}
      </h4>
      <div className="space-y-1.5">
        {legendItems.map((item) => (
          <div key={item.status || item.label} className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full border-2 border-white shadow-sm shrink-0"
              style={{ backgroundColor: item.color || getStatusColor(item.status) }}
              aria-hidden="true"
            />
            <span className="text-xs text-gray-600 dark:text-gray-400">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function getStatusColor(status) {
  const colorMap = {
    active: '#22c55e',
    in_transit: '#3b82f6',
    completed: '#22c55e',
    success: '#22c55e',
    pending: '#eab308',
    delayed: '#ef4444',
    at_risk: '#f97316',
    risk: '#f97316',
    failed: '#ef4444',
    error: '#ef4444',
    warning: '#eab308',
    critical: '#ef4444',
    scheduled: '#8b5cf6',
    idle: '#9ca3af',
    offline: '#6b7280',
  };
  return colorMap[status?.toLowerCase()] || '#6366f1';
}

export default MapLegend;

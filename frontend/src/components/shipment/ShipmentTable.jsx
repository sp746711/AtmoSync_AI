import StatusBadge from '../common/StatusBadge';
import Skeleton from '../common/Skeleton';
import EmptyState from '../common/EmptyState';

/**
 * ShipmentTable - Tabular view of shipments.
 *
 * @param {object} props
 * @param {Array} [props.shipments]
 * @param {boolean} [props.loading=false]
 * @param {boolean} [props.sortable=false]
 * @param {function} [props.onRowClick]
 * @param {Array<{key:string, label:string, render?:function}>} [props.columns]
 * @param {string} [props.className]
 */
function ShipmentTable({
  shipments,
  loading = false,
  sortable = false,
  onRowClick,
  columns,
  className = '',
}) {
  const defaultColumns = [
    { key: 'trackingNumber', label: 'Tracking #' },
    { key: 'product', label: 'Product' },
    {
      key: 'origin',
      label: 'Route',
      render: (item) => (
        <span className="truncate max-w-[200px] inline-block">
          {item.origin} → {item.destination}
        </span>
      ),
    },
    {
      key: 'temperature',
      label: 'Temp',
      render: (item) =>
        item.temperature != null ? (
          <span
            className={`font-medium ${
              item.temperature > 8
                ? 'text-red-600 dark:text-red-400'
                : item.temperature < 2
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-green-600 dark:text-green-400'
            }`}
          >
            {item.temperature}°C
          </span>
        ) : (
          '—'
        ),
    },
    { key: 'status', label: 'Status', render: (item) => <StatusBadge status={item.status} size="sm" /> },
    { key: 'eta', label: 'ETA' },
  ];

  const activeColumns = columns || defaultColumns;

  if (loading) {
    return (
      <div className={className}>
        <Skeleton.Table rows={5} columns={activeColumns.length} />
      </div>
    );
  }

  if (!shipments || shipments.length === 0) {
    return (
      <EmptyState
        title="No shipments found"
        message="There are no shipments matching your criteria."
      />
    );
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700" role="table" aria-label="Shipments table">
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
          {shipments.map((shipment, index) => (
            <tr
              key={shipment.id || index}
              onClick={() => onRowClick?.(shipment)}
              className={`
                transition-colors
                ${onRowClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50' : ''}
              `}
              role="row"
              aria-label={`Shipment ${shipment.trackingNumber || shipment.id}`}
            >
              {activeColumns.map((col) => (
                <td
                  key={col.key}
                  className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap"
                >
                  {col.render ? col.render(shipment) : shipment[col.key] ?? '—'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ShipmentTable;

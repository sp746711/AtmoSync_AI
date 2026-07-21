import Skeleton from '../common/Skeleton';
import EmptyState from '../common/EmptyState';

/**
 * TemperatureHistory - Temperature reading history display.
 *
 * @param {object} props
 * @param {Array} [props.readings]
 * @param {number} [props.readings[].value]
 * @param {string} [props.readings[].timestamp]
 * @param {number} [props.minTemp=2]
 * @param {number} [props.maxTemp=8]
 * @param {boolean} [props.loading=false]
 * @param {boolean} [props.showChart=false]
 * @param {number} [props.maxItems=10]
 * @param {string} [props.className]
 */
function TemperatureHistory({
  readings,
  minTemp = 2,
  maxTemp = 8,
  loading = false,
  showChart = false,
  maxItems = 10,
  className = '',
}) {
  if (loading) {
    return (
      <div className={className}>
        <Skeleton variant="rect" height={200} />
      </div>
    );
  }

  if (!readings || readings.length === 0) {
    return (
      <EmptyState
        title="No temperature data"
        message="No temperature readings are available for this shipment."
        size="sm"
      />
    );
  }

  const getTempColor = (value) => {
    if (value > maxTemp) return 'bg-red-500';
    if (value < minTemp) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getTempTextColor = (value) => {
    if (value > maxTemp) return 'text-red-600 dark:text-red-400';
    if (value < minTemp) return 'text-blue-600 dark:text-blue-400';
    return 'text-green-600 dark:text-green-400';
  };

  const isInRange = (value) => value >= minTemp && value <= maxTemp;

  const displayed = readings.slice(0, maxItems);

  // Calculate bar chart dimensions
  const allValues = readings.map((r) => r.value ?? 0);
  const minValue = Math.min(...allValues, minTemp - 2);
  const maxValue = Math.max(...allValues, maxTemp + 2);
  const range = maxValue - minValue || 1;

  return (
    <div className={className}>
      {/* Compact bar visualization */}
      {showChart && (
        <div className="mb-4">
          {/* Threshold lines */}
          <div className="relative h-40 flex items-end gap-1">
            {displayed.map((reading, index) => {
              const value = reading.value ?? 0;
              const heightPercent = ((value - minValue) / range) * 100;
              const height = Math.max(8, Math.min(heightPercent, 100));

              return (
                <div
                  key={index}
                  className="flex-1 flex flex-col items-center justify-end"
                  title={`${value}°C at ${reading.timestamp || ''}`}
                >
                  <div
                    className={`w-full rounded-t ${getTempColor(value)} transition-all duration-300`}
                    style={{ height: `${height}%`, minHeight: '4px' }}
                    aria-label={`${value}°C`}
                  />
                </div>
              );
            })}
          </div>

          {/* Threshold indicators */}
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-green-500" aria-hidden="true" />
              <span>Normal ({minTemp}–{maxTemp}°C)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-red-500" aria-hidden="true" />
              <span>Above range</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-blue-500" aria-hidden="true" />
              <span>Below range</span>
            </div>
          </div>
        </div>
      )}

      {/* Readings list */}
      <div className="space-y-2" role="list" aria-label="Temperature readings">
        {displayed.map((reading, index) => (
          <div
            key={reading.id || index}
            className="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-50 dark:bg-gray-800/50"
            role="listitem"
          >
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${getTempColor(reading.value)}`} aria-hidden="true" />
              <span className={`text-sm font-medium ${getTempTextColor(reading.value)}`}>
                {reading.value != null ? `${reading.value}°C` : '—'}
              </span>
              {!isInRange(reading.value) && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {reading.value > maxTemp ? 'Above threshold' : 'Below threshold'}
                </span>
              )}
            </div>
            {reading.timestamp && (
              <span className="text-xs text-gray-400 dark:text-gray-500">{reading.timestamp}</span>
            )}
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {readings.length} readings recorded
        </p>
      </div>
    </div>
  );
}

export default TemperatureHistory;

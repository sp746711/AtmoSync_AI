import StatusBadge from '../common/StatusBadge';
import Skeleton from '../common/Skeleton';
import EmptyState from '../common/EmptyState';

/**
 * ActivityTimeline - Vertical timeline of activities.
 *
 * @param {object} props
 * @param {Array} [props.activities]
 * @param {boolean} [props.loading=false]
 * @param {number} [props.maxItems=10]
 * @param {string} [props.className]
 */
function ActivityTimeline({
  activities,
  loading = false,
  maxItems = 10,
  className = '',
}) {
  if (loading) {
    return (
      <div className={className}>
        <Skeleton variant="text" count={5} />
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <EmptyState
        title="No recent activity"
        message="There are no recent activities to display."
        size="sm"
      />
    );
  }

  const displayed = activities.slice(0, maxItems);

  return (
    <div className={`flow-root ${className}`} role="list" aria-label="Activity timeline">
      <ul className="space-y-3">
        {displayed.map((activity, index) => (
          <li key={activity.id || index} className="relative flex gap-3" role="listitem">
            {/* Timeline dot and line */}
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-gray-800 shrink-0 mt-1.5
                  ${activity.color || getDefaultColor(activity.type || activity.status)}
                `}
                aria-hidden="true"
              />
              {index < displayed.length - 1 && (
                <div className="w-px flex-1 bg-gray-200 dark:bg-gray-700 mt-1" aria-hidden="true" />
              )}
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1 pb-3">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {activity.title}
                </p>
                {(activity.status || activity.type) && (
                  <StatusBadge
                    status={activity.status || activity.type}
                    size="sm"
                    dot={false}
                  />
                )}
              </div>

              {activity.description && (
                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                  {activity.description}
                </p>
              )}

              <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
                {activity.time || activity.timestamp || ''}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function getDefaultColor(type) {
  const colorMap = {
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    critical: 'bg-red-500',
    shipment: 'bg-primary-500',
    alert: 'bg-amber-500',
    risk: 'bg-orange-500',
  };
  return colorMap[type?.toLowerCase()] || 'bg-gray-400';
}

export default ActivityTimeline;

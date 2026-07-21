import StatusBadge from '../common/StatusBadge';
import Skeleton from '../common/Skeleton';
import EmptyState from '../common/EmptyState';

/**
 * ShipmentTimeline - Step-by-step shipment journey timeline.
 *
 * @param {object} props
 * @param {Array} [props.events]
 * @param {string} [props.events[].status]
 * @param {string} [props.events[].title]
 * @param {string} [props.events[].description]
 * @param {string} [props.events[].timestamp]
 * @param {string} [props.events[].location]
 * @param {boolean} [props.loading=false]
 * @param {boolean} [props.completed=true] - Whether to show the final completed state
 * @param {string} [props.className]
 */
function ShipmentTimeline({
  events,
  loading = false,
  completed = true,
  className = '',
}) {
  if (loading) {
    return (
      <div className={className}>
        <Skeleton variant="text" count={4} />
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <EmptyState
        title="No tracking events"
        message="There are no tracking events available for this shipment."
        size="sm"
      />
    );
  }

  const steps = completed ? [...events, { status: 'completed', title: 'Delivered', timestamp: '' }] : events;

  return (
    <div className={className} role="list" aria-label="Shipment timeline">
      <div className="space-y-0">
        {steps.map((event, index) => {
          const isLast = index === steps.length - 1;
          const isActive = index === 0;

          return (
            <div key={event.id || index} className="relative flex gap-4 pb-4" role="listitem">
              {/* Step indicator */}
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center shrink-0
                    ${isLast
                      ? 'bg-green-500'
                      : isActive
                      ? 'bg-primary-500 ring-4 ring-primary-100 dark:ring-primary-900/30'
                      : 'bg-gray-200 dark:bg-gray-700'
                    }
                  `}
                  aria-hidden="true"
                >
                  {isLast ? (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-white' : 'bg-gray-400 dark:bg-gray-500'}`} />
                  )}
                </div>
                {!isLast && <div className="w-0.5 flex-1 bg-gray-200 dark:bg-gray-700 mt-1" aria-hidden="true" />}
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1 pt-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className={`text-sm font-medium ${isLast ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>
                    {event.title || event.status}
                  </p>
                  {event.status && !isLast && (
                    <StatusBadge status={event.status} size="sm" dot={false} />
                  )}
                </div>

                {event.description && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {event.description}
                  </p>
                )}

                {(event.timestamp || event.location) && (
                  <div className="flex items-center gap-3 mt-1">
                    {event.timestamp && (
                      <span className="text-xs text-gray-400 dark:text-gray-500">{event.timestamp}</span>
                    )}
                    {event.location && (
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        {event.location}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ShipmentTimeline;

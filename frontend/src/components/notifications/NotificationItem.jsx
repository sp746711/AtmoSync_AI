import { useCallback } from 'react';

/**
 * NotificationItem - Single notification item.
 *
 * @param {object} props
 * @param {object} props.notification
 * @param {string} props.notification.id
 * @param {string} props.notification.title
 * @param {string} [props.notification.message]
 * @param {string} [props.notification.type]
 * @param {boolean} [props.notification.isRead]
 * @param {string} [props.notification.timestamp]
 * @param {string} [props.notification.timeAgo]
 * @param {function} [props.onClick]
 * @param {function} [props.onMarkRead]
 * @param {function} [props.onDismiss]
 */
function NotificationItem({
  notification,
  onClick,
  onMarkRead,
  onDismiss,
}) {
  if (!notification) return null;

  const handleClick = useCallback(() => {
    onClick?.(notification);
    if (!notification.isRead) {
      onMarkRead?.(notification);
    }
  }, [notification, onClick, onMarkRead]);

  const handleMarkRead = useCallback(
    (e) => {
      e.stopPropagation();
      onMarkRead?.(notification);
    },
    [notification, onMarkRead]
  );

  const handleDismiss = useCallback(
    (e) => {
      e.stopPropagation();
      onDismiss?.(notification);
    },
    [notification, onDismiss]
  );

  const typeIcons = {
    alert: (
      <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
        <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
    ),
    warning: (
      <div className="w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
        <svg className="w-4 h-4 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
    ),
    success: (
      <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
        <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
    ),
    info: (
      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
        <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    ),
    shipment: (
      <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
        <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
        </svg>
      </div>
    ),
  };

  const icon = typeIcons[notification.type?.toLowerCase()] || typeIcons.info;

  return (
    <div
      className={`
        flex items-start gap-3 p-3 rounded-lg transition-colors cursor-pointer
        ${notification.isRead
          ? 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
          : 'bg-primary-50/50 dark:bg-primary-900/10 hover:bg-primary-50 dark:hover:bg-primary-900/20'
        }
      `}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={`${notification.title}${notification.isRead ? '' : ' (unread)'}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {/* Icon */}
      <div className="shrink-0">{icon}</div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p
            className={`text-sm ${
              notification.isRead
                ? 'text-gray-600 dark:text-gray-400'
                : 'font-semibold text-gray-900 dark:text-white'
            }`}
          >
            {notification.title}
          </p>

          {/* Unread dot */}
          {!notification.isRead && (
            <span className="w-2 h-2 rounded-full bg-primary-500 shrink-0 mt-1.5" aria-hidden="true" />
          )}
        </div>

        {notification.message && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
            {notification.message}
          </p>
        )}

        {(notification.timestamp || notification.timeAgo) && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            {notification.timeAgo || notification.timestamp}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        {!notification.isRead && onMarkRead && (
          <button
            onClick={handleMarkRead}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="Mark as read"
            title="Mark as read"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </button>
        )}
        {onDismiss && (
          <button
            onClick={handleDismiss}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="Dismiss notification"
            title="Dismiss"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

export default NotificationItem;

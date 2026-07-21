import { useRef, useEffect, useCallback } from 'react';
import NotificationItem from './NotificationItem';
import Button from '../common/Button';
import EmptyState from '../common/EmptyState';
import Skeleton from '../common/Skeleton';

/**
 * NotificationPanel - Dropdown panel displaying notifications list.
 *
 * @param {object} props
 * @param {boolean} props.isOpen
 * @param {function} [props.onClose]
 * @param {Array} [props.notifications]
 * @param {number} [props.unreadCount]
 * @param {boolean} [props.loading=false]
 * @param {function} [props.onNotificationClick]
 * @param {function} [props.onMarkRead]
 * @param {function} [props.onMarkAllRead]
 * @param {function} [props.onDismiss]
 * @param {function} [props.onViewAll]
 * @param {number} [props.maxItems=5]
 * @param {string} [props.className]
 */
function NotificationPanel({
  isOpen,
  onClose,
  notifications,
  unreadCount = 0,
  loading = false,
  onNotificationClick,
  onMarkRead,
  onMarkAllRead,
  onDismiss,
  onViewAll,
  maxItems = 5,
  className = '',
}) {
  const panelRef = useRef(null);

  const handleClickOutside = useCallback(
    (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose?.();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, handleClickOutside]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      return () => document.removeEventListener('keydown', handleEsc);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const displayed = notifications?.slice(0, maxItems);

  return (
    <div
      ref={panelRef}
      className={`
        absolute right-0 mt-2 w-96 max-w-[calc(100vw-2rem)]
        bg-white dark:bg-gray-800 rounded-2xl shadow-2xl
        ring-1 ring-black/5 dark:ring-white/10
        border border-gray-200 dark:border-gray-700
        z-50 flex flex-col
        ${className}
      `}
      role="dialog"
      aria-label="Notifications panel"
      aria-modal="false"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</h3>
          {unreadCount > 0 && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ({unreadCount} unread)
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {unreadCount > 0 && onMarkAllRead && (
            <button
              onClick={onMarkAllRead}
              className="text-xs font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Mark all read
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Close notifications"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Notification List */}
      <div className="overflow-y-auto max-h-[400px] p-2 space-y-1">
        {loading ? (
          <div className="p-3 space-y-3">
            <Skeleton variant="text" count={4} />
          </div>
        ) : !displayed || displayed.length === 0 ? (
          <div className="py-8">
            <EmptyState
              title="No notifications"
              message="You're all caught up! No new notifications."
              size="sm"
            />
          </div>
        ) : (
          displayed.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onClick={onNotificationClick}
              onMarkRead={onMarkRead}
              onDismiss={onDismiss}
            />
          ))
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
        <Button
          variant="ghost"
          size="sm"
          fullWidth
          onClick={onViewAll}
          className="text-center"
        >
          View all notifications
        </Button>
      </div>
    </div>
  );
}

export default NotificationPanel;

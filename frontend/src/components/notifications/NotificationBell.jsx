import { useState, useRef, useEffect, useCallback } from 'react';
import NotificationBadge from './NotificationBadge';

/**
 * NotificationBell - Notification bell icon with badge and dropdown.
 *
 * @param {object} props
 * @param {number} [props.unreadCount=0]
 * @param {function} [props.onClick]
 * @param {boolean} [props.isOpen]
 * @param {function} [props.onToggle]
 * @param {string} [props.className]
 */
function NotificationBell({
  unreadCount = 0,
  onClick,
  isOpen: controlledOpen,
  onToggle,
  className = '',
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;
  const bellRef = useRef(null);

  const handleClickOutside = useCallback((e) => {
    if (bellRef.current && !bellRef.current.contains(e.target)) {
      if (!isControlled) setInternalOpen(false);
    }
  }, [isControlled]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  const handleToggle = useCallback(() => {
    if (isControlled) {
      onToggle?.();
    } else {
      setInternalOpen((prev) => !prev);
    }
    onClick?.();
  }, [isControlled, onToggle, onClick]);

  return (
    <div ref={bellRef} className={`relative ${className}`}>
      <button
        onClick={handleToggle}
        className="relative p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {/* Badge */}
        {unreadCount > 0 && (
          <NotificationBadge count={unreadCount} size="sm" className="absolute -top-0.5 -right-0.5" />
        )}
      </button>
    </div>
  );
}

export default NotificationBell;

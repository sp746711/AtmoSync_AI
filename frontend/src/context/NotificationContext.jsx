import {
  createContext,
  useState,
  useCallback,
  useMemo,
  useContext,
} from 'react';

/**
 * NotificationContext
 *
 * Global frontend state for in-app notifications.
 *
 * Responsibilities:
 * - Store notification list (client-side only)
 * - Derive unread count
 * - Provide addNotification() / removeNotification() / markAsRead() / markAllAsRead() / clearNotifications()
 *
 * Frontend notification state only.
 * No API calls — does NOT fetch from backend.
 * No WebSocket logic — can be connected externally via addNotification().
 * No business logic — purely notification queue management.
 */

export const NotificationContext = createContext(null);

/**
 * Generates a unique ID for client-side notifications.
 */
let idCounter = 0;
function generateId() {
  idCounter += 1;
  return `notification-${Date.now()}-${idCounter}`;
}

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications],
  );

  const addNotification = useCallback((notification) => {
    const entry = {
      id: generateId(),
      title: notification.title || '',
      message: notification.message || '',
      type: notification.type || 'info', // 'info' | 'success' | 'warning' | 'error'
      read: false,
      timestamp: notification.timestamp || new Date().toISOString(),
      data: notification.data || null,
    };

    setNotifications((prev) => [entry, ...prev]);
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const markAsRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true })),
    );
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      addNotification,
      removeNotification,
      markAsRead,
      markAllAsRead,
      clearNotifications,
    }),
    [
      notifications,
      unreadCount,
      addNotification,
      removeNotification,
      markAsRead,
      markAllAsRead,
      clearNotifications,
    ],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

/**
 * useNotifications
 *
 * Custom hook to consume NotificationContext.
 * Throws if used outside NotificationProvider.
 */
export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error('useNotifications must be used within a <NotificationProvider>');
  }
  return ctx;
}


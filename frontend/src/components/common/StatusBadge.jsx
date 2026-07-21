/**
 * StatusBadge - Compact status indicator.
 *
 * @param {object} props
 * @param {string} props.status - Status key (e.g., 'active', 'inactive', 'pending', 'completed', 'error', 'warning', 'info')
 * @param {string} [props.label] - Optional display label (defaults to status)
 * @param {'sm'|'md'|'lg'} [props.size='md']
 * @param {boolean} [props.dot=true]
 * @param {string} [props.className]
 */
function StatusBadge({
  status,
  label,
  size = 'md',
  dot = true,
  className = '',
}) {
  const statusConfig = {
    active: {
      bg: 'bg-green-100 dark:bg-green-900/30',
      text: 'text-green-800 dark:text-green-300',
      dot: 'bg-green-500',
      label: 'Active',
    },
    completed: {
      bg: 'bg-green-100 dark:bg-green-900/30',
      text: 'text-green-800 dark:text-green-300',
      dot: 'bg-green-500',
      label: 'Completed',
    },
    success: {
      bg: 'bg-green-100 dark:bg-green-900/30',
      text: 'text-green-800 dark:text-green-300',
      dot: 'bg-green-500',
      label: 'Success',
    },
    on_track: {
      bg: 'bg-green-100 dark:bg-green-900/30',
      text: 'text-green-800 dark:text-green-300',
      dot: 'bg-green-500',
      label: 'On Track',
    },
    pending: {
      bg: 'bg-yellow-100 dark:bg-yellow-900/30',
      text: 'text-yellow-800 dark:text-yellow-300',
      dot: 'bg-yellow-500',
      label: 'Pending',
    },
    warning: {
      bg: 'bg-yellow-100 dark:bg-yellow-900/30',
      text: 'text-yellow-800 dark:text-yellow-300',
      dot: 'bg-yellow-500',
      label: 'Warning',
    },
    at_risk: {
      bg: 'bg-orange-100 dark:bg-orange-900/30',
      text: 'text-orange-800 dark:text-orange-300',
      dot: 'bg-orange-500',
      label: 'At Risk',
    },
    error: {
      bg: 'bg-red-100 dark:bg-red-900/30',
      text: 'text-red-800 dark:text-red-300',
      dot: 'bg-red-500',
      label: 'Error',
    },
    failed: {
      bg: 'bg-red-100 dark:bg-red-900/30',
      text: 'text-red-800 dark:text-red-300',
      dot: 'bg-red-500',
      label: 'Failed',
    },
    critical: {
      bg: 'bg-red-100 dark:bg-red-900/30',
      text: 'text-red-800 dark:text-red-300',
      dot: 'bg-red-500',
      label: 'Critical',
    },
    delayed: {
      bg: 'bg-red-100 dark:bg-red-900/30',
      text: 'text-red-800 dark:text-red-300',
      dot: 'bg-red-500',
      label: 'Delayed',
    },
    in_transit: {
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      text: 'text-blue-800 dark:text-blue-300',
      dot: 'bg-blue-500',
      label: 'In Transit',
    },
    info: {
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      text: 'text-blue-800 dark:text-blue-300',
      dot: 'bg-blue-500',
      label: 'Info',
    },
    inactive: {
      bg: 'bg-gray-100 dark:bg-gray-800',
      text: 'text-gray-600 dark:text-gray-400',
      dot: 'bg-gray-400 dark:bg-gray-500',
      label: 'Inactive',
    },
    idle: {
      bg: 'bg-gray-100 dark:bg-gray-800',
      text: 'text-gray-600 dark:text-gray-400',
      dot: 'bg-gray-400 dark:bg-gray-500',
      label: 'Idle',
    },
    offline: {
      bg: 'bg-gray-100 dark:bg-gray-800',
      text: 'text-gray-600 dark:text-gray-400',
      dot: 'bg-gray-400 dark:bg-gray-500',
      label: 'Offline',
    },
    scheduled: {
      bg: 'bg-indigo-100 dark:bg-indigo-900/30',
      text: 'text-indigo-800 dark:text-indigo-300',
      dot: 'bg-indigo-500',
      label: 'Scheduled',
    },
  };

  const config = statusConfig[status?.toLowerCase()] || {
    bg: 'bg-gray-100 dark:bg-gray-800',
    text: 'text-gray-600 dark:text-gray-400',
    dot: 'bg-gray-400',
    label: status || 'Unknown',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-0.5 text-xs gap-1.5',
    lg: 'px-3 py-1 text-sm gap-1.5',
  };

  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  };

  return (
    <span
      className={`
        inline-flex items-center rounded-full font-medium
        ${config.bg} ${config.text}
        ${sizeStyles[size] || sizeStyles.md}
        ${className}
      `}
      role="status"
      aria-label={`Status: ${label || config.label}`}
    >
      {dot && (
        <span
          className={`${dotSizes[size] || dotSizes.md} rounded-full ${config.dot} shrink-0`}
          aria-hidden="true"
        />
      )}
      <span>{label || config.label}</span>
    </span>
  );
}

export default StatusBadge;


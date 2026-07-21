import Button from './Button';

/**
 * EmptyState - Displayed when there is no data to show.
 *
 * @param {object} props
 * @param {React.ReactNode} [props.icon]
 * @param {string} [props.title='No data found']
 * @param {string} [props.message]
 * @param {string} [props.actionLabel]
 * @param {function} [props.onAction]
 * @param {'sm'|'md'|'lg'} [props.size='md']
 * @param {string} [props.className]
 */
function EmptyState({
  icon,
  title = 'No data found',
  message,
  actionLabel,
  onAction,
  size = 'md',
  className = '',
}) {
  const sizeStyles = {
    sm: 'py-8',
    md: 'py-16',
    lg: 'py-24',
  };

  return (
    <div
      className={`
        flex flex-col items-center justify-center text-center px-4
        ${sizeStyles[size] || sizeStyles.md}
        ${className}
      `}
      role="status"
    >
      {/* Icon */}
      {icon ? (
        <div className="mb-4 text-gray-300 dark:text-gray-600" aria-hidden="true">
          {icon}
        </div>
      ) : (
        <div className="mb-4" aria-hidden="true">
          <svg
            className={`${size === 'sm' ? 'w-12 h-12' : 'w-16 h-16'} text-gray-300 dark:text-gray-600`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        </div>
      )}

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
        {title}
      </h3>

      {/* Message */}
      {message && (
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mb-6">
          {message}
        </p>
      )}

      {/* Action */}
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export default EmptyState;


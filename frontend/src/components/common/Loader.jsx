/**
 * Loader - Accessible loading spinner component.
 *
 * @param {object} props
 * @param {'sm'|'md'|'lg'|'xl'} [props.size='md']
 * @param {string} [props.label='Loading...']
 * @param {boolean} [props.overlay=false]
 * @param {string} [props.className]
 * @param {'primary'|'white'|'gray'} [props.color='primary']
 */
function Loader({
  size = 'md',
  label = 'Loading...',
  overlay = false,
  className = '',
  color = 'primary',
}) {
  const sizeMap = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
    xl: 'h-16 w-16 border-4',
  };

  const colorMap = {
    primary: 'border-primary-200 border-t-primary-600 dark:border-primary-800 dark:border-t-primary-400',
    white: 'border-white/30 border-t-white',
    gray: 'border-gray-200 border-t-gray-600 dark:border-gray-700 dark:border-t-gray-400',
  };

  const spinner = (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${className}`}
      role="status"
      aria-label={label}
    >
      <div
        className={`
          animate-spin rounded-full
          ${sizeMap[size] || sizeMap.md}
          ${colorMap[color] || colorMap.primary}
        `}
      />
      {label && (
        <span className="text-sm text-gray-500 dark:text-gray-400 sr-only">
          {label}
        </span>
      )}
    </div>
  );

  if (overlay) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm"
        aria-hidden="true"
      >
        {spinner}
      </div>
    );
  }

  return spinner;
}

/**
 * PageLoader - Full-page centered loader.
 */
Loader.Page = function PageLoader({ label = 'Loading page...' }) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]" role="status" aria-label={label}>
      <Loader size="lg" label={label} />
    </div>
  );
};

/**
 * InlineLoader - Minimal inline loader.
 */
Loader.Inline = function InlineLoader({ size = 'sm', className = '' }) {
  return (
    <span className={`inline-flex items-center ${className}`} role="status" aria-label="Loading">
      <Loader size={size} label="" />
    </span>
  );
};

export default Loader;


/**
 * Skeleton - Loading placeholder component.
 *
 * @param {object} props
 * @param {'text'|'circle'|'rect'|'card'|'table'|'chart'} [props.variant='text']
 * @param {number} [props.width]
 * @param {number} [props.height]
 * @param {number} [props.count=1]
 * @param {string} [props.className]
 * @param {string} [props.ariaLabel='Loading...']
 */
function Skeleton({
  variant = 'text',
  width,
  height,
  count = 1,
  className = '',
  ariaLabel = 'Loading...',
}) {
  const baseClass = 'animate-pulse bg-gray-200 dark:bg-gray-700 rounded';

  const variants = {
    text: `${baseClass} h-4 rounded`,
    circle: `${baseClass} rounded-full`,
    rect: `${baseClass} rounded-lg`,
    card: `${baseClass} rounded-xl`,
    table: `${baseClass} h-10 rounded`,
    chart: `${baseClass} rounded-xl`,
  };

  const sizes = {
    text: { width: width || '100%', height: height || 16 },
    circle: { width: width || 40, height: height || 40 },
    rect: { width: width || '100%', height: height || 200 },
    card: { width: width || '100%', height: height || 180 },
    table: { width: width || '100%', height: height || 40 },
    chart: { width: width || '100%', height: height || 300 },
  };

  const style = {
    width: sizes[variant]?.width || width,
    height: sizes[variant]?.height || height,
  };

  const items = Array.from({ length: count }, (_, i) => i);

  return (
    <div
      className={`space-y-3 ${className}`}
      role="status"
      aria-label={ariaLabel}
      aria-busy="true"
    >
      {items.map((_, index) => (
        <div
          key={index}
          className={variants[variant] || variants.text}
          style={style}
        />
      ))}
    </div>
  );
}

/**
 * Text - Shortcut for text skeleton lines.
 */
Skeleton.Text = function SkeletonText({ lines = 3, className = '' }) {
  return (
    <div className={`space-y-2 ${className}`} role="status" aria-label="Loading text">
      {Array.from({ length: lines }, (_, i) => (
        <div
          key={i}
          className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded h-4"
          style={{ width: i === lines - 1 ? '60%' : '100%' }}
        />
      ))}
    </div>
  );
};

/**
 * Table - Shortcut for table row skeleton.
 */
Skeleton.Table = function SkeletonTable({ rows = 5, columns = 4, className = '' }) {
  return (
    <div className={`space-y-3 ${className}`} role="status" aria-label="Loading table">
      {/* Header */}
      <div className="flex gap-4">
        {Array.from({ length: columns }, (_, i) => (
          <div
            key={`h-${i}`}
            className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded h-10 flex-1"
          />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }, (_, r) => (
        <div key={`r-${r}`} className="flex gap-4">
          {Array.from({ length: columns }, (_, c) => (
            <div
              key={`c-${c}`}
              className="animate-pulse bg-gray-100 dark:bg-gray-700/50 rounded h-8 flex-1"
            />
          ))}
        </div>
      ))}
    </div>
  );
};

/**
 * Card - Shortcut for card skeleton.
 */
Skeleton.Card = function SkeletonCard({ className = '' }) {
  return (
    <div
      className={`p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 ${className}`}
      role="status"
      aria-label="Loading card"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-full h-10 w-10" />
        <div className="flex-1 space-y-2">
          <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded h-4 w-3/4" />
          <div className="animate-pulse bg-gray-100 dark:bg-gray-700/50 rounded h-3 w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded h-3 w-full" />
        <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded h-3 w-5/6" />
        <div className="animate-pulse bg-gray-100 dark:bg-gray-700/50 rounded h-3 w-2/3" />
      </div>
    </div>
  );
};

export default Skeleton;


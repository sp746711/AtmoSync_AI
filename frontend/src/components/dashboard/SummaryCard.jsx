import Card from '../common/Card';
import Skeleton from '../common/Skeleton';

/**
 * SummaryCard - KPI/metric summary card for dashboards.
 *
 * @param {object} props
 * @param {string} props.title
 * @param {string|number} props.value
 * @param {string} [props.subtitle]
 * @param {React.ReactNode} [props.icon]
 * @param {object} [props.trend]
 * @param {number} [props.trend.value]
 * @param {'up'|'down'} [props.trend.direction]
 * @param {string} [props.trend.label]
 * @param {string} [props.trend.color]
 * @param {string} [props.color] - Accent color class
 * @param {boolean} [props.loading=false]
 * @param {function} [props.onClick]
 * @param {string} [props.className]
 * @param {'sm'|'md'|'lg'} [props.size='md']
 */
function SummaryCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  color,
  loading = false,
  onClick,
  className = '',
  size = 'md',
}) {
  if (loading) {
    return (
      <Card padding="lg" className={className}>
        <Skeleton variant="card" />
      </Card>
    );
  }

  const sizeStyles = {
    sm: { padding: 'p-4', value: 'text-xl' },
    md: { padding: 'p-5', value: 'text-2xl' },
    lg: { padding: 'p-6', value: 'text-3xl' },
  };

  const current = sizeStyles[size] || sizeStyles.md;

  return (
    <Card
      padding="none"
      className={`${current.padding} ${className}`}
      hoverable={!!onClick}
      onClick={onClick}
      ariaLabel={`${title}: ${value}`}
    >
      <div className="flex items-start justify-between">
        {/* Content */}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
            {title}
          </p>
          <p className={`mt-1 font-bold text-gray-900 dark:text-white ${current.value} truncate`}>
            {value ?? '—'}
          </p>
          {subtitle && (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
          )}

          {/* Trend */}
          {trend && (
            <div
              className={`mt-2 inline-flex items-center gap-1 text-xs font-medium ${
                trend.color ||
                (trend.direction === 'up'
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400')
              }`}
            >
              <svg
                className={`w-3.5 h-3.5 ${trend.direction === 'up' ? '' : 'rotate-180'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              <span>
                {Math.abs(trend.value)}% {trend.label || (trend.direction === 'up' ? 'increase' : 'decrease')}
              </span>
            </div>
          )}
        </div>

        {/* Icon */}
        {icon && (
          <div
            className={`shrink-0 ml-3 p-2.5 rounded-lg ${
              color ? color : 'bg-primary-50 dark:bg-primary-900/30'
            }`}
            aria-hidden="true"
          >
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}

export default SummaryCard;

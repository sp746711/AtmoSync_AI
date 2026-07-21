/**
 * RiskBadge - Visual risk level indicator.
 *
 * @param {object} props
 * @param {'low'|'medium'|'high'|'critical'|number} props.level
 * @param {string} [props.label]
 * @param {'sm'|'md'|'lg'} [props.size='md']
 * @param {boolean} [props.showIcon=true]
 * @param {string} [props.className]
 */
function RiskBadge({
  level,
  label,
  size = 'md',
  showIcon = true,
  className = '',
}) {
  const riskConfig = {
    low: {
      bg: 'bg-green-100 dark:bg-green-900/30',
      text: 'text-green-800 dark:text-green-300',
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      label: 'Low',
      score: 1,
    },
    medium: {
      bg: 'bg-yellow-100 dark:bg-yellow-900/30',
      text: 'text-yellow-800 dark:text-yellow-300',
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
        </svg>
      ),
      label: 'Medium',
      score: 2,
    },
    high: {
      bg: 'bg-orange-100 dark:bg-orange-900/30',
      text: 'text-orange-800 dark:text-orange-300',
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      label: 'High',
      score: 3,
    },
    critical: {
      bg: 'bg-red-100 dark:bg-red-900/30',
      text: 'text-red-800 dark:text-red-300',
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      label: 'Critical',
      score: 4,
    },
  };

  // Support numeric risk levels
  let levelKey = level;
  if (typeof level === 'number') {
    if (level <= 25) levelKey = 'low';
    else if (level <= 50) levelKey = 'medium';
    else if (level <= 75) levelKey = 'high';
    else levelKey = 'critical';
  }

  const config = riskConfig[levelKey?.toLowerCase()] || riskConfig.low;

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
    lg: 'px-3 py-1.5 text-sm gap-1.5',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${config.bg} ${config.text} ${sizeStyles[size] || sizeStyles.md} ${className}`}
      role="status"
      aria-label={`Risk level: ${label || config.label}`}
    >
      {showIcon && config.icon && <span aria-hidden="true">{config.icon}</span>}
      <span>{label || config.label}</span>
    </span>
  );
}

export default RiskBadge;

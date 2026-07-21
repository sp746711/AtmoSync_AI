import Card from '../common/Card';

/**
 * RecommendationScore - AI confidence/priority score indicator.
 *
 * @param {object} props
 * @param {number} props.score
 * @param {number} [props.min=0]
 * @param {number} [props.max=100]
 * @param {string} [props.label='AI Confidence']
 * @param {boolean} [props.showPercentage=true]
 * @param {'sm'|'md'|'lg'} [props.size='md']
 * @param {string} [props.className]
 */
function RecommendationScore({
  score,
  min = 0,
  max = 100,
  label = 'AI Confidence',
  showPercentage = true,
  size = 'md',
  className = '',
}) {
  const normalized = Math.max(min, Math.min(max, score));
  const percentage = max !== min ? ((normalized - min) / (max - min)) * 100 : 0;

  const getColor = (value) => {
    if (value >= 80) return { bg: 'bg-green-500', text: 'text-green-600 dark:text-green-400', ring: 'ring-green-500' };
    if (value >= 60) return { bg: 'bg-blue-500', text: 'text-blue-600 dark:text-blue-400', ring: 'ring-blue-500' };
    if (value >= 40) return { bg: 'bg-yellow-500', text: 'text-yellow-600 dark:text-yellow-400', ring: 'ring-yellow-500' };
    if (value >= 20) return { bg: 'bg-orange-500', text: 'text-orange-600 dark:text-orange-400', ring: 'ring-orange-500' };
    return { bg: 'bg-red-500', text: 'text-red-600 dark:text-red-400', ring: 'ring-red-500' };
  };

  const colors = getColor(percentage);
  const roundedScore = Math.round(percentage);

  const sizeStyles = {
    sm: { gauge: 'w-12 h-12', text: 'text-sm', label: 'text-[10px]', stroke: 3 },
    md: { gauge: 'w-16 h-16', text: 'text-lg', label: 'text-xs', stroke: 4 },
    lg: { gauge: 'w-20 h-20', text: 'text-xl', label: 'text-sm', stroke: 5 },
  };

  const s = sizeStyles[size] || sizeStyles.md;
  const circumference = 2 * Math.PI * 28;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <Card padding={size === 'lg' ? 'lg' : 'md'} className={className}>
      <div className="flex items-center gap-4">
        {/* Circular gauge */}
        <div className={`relative ${s.gauge} shrink-0`}>
          <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64" role="img" aria-label={`${label}: ${roundedScore}%`}>
            <circle cx="32" cy="32" r="28" fill="none" stroke="#e5e7eb" strokeWidth={s.stroke} className="dark:stroke-gray-700" />
            <circle
              cx="32"
              cy="32"
              r="28"
              fill="none"
              stroke="currentColor"
              strokeWidth={s.stroke}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className={colors.text}
            />
          </svg>
          <div className={`absolute inset-0 flex items-center justify-center font-bold ${s.text} ${colors.text}`}>
            {showPercentage ? `${roundedScore}%` : roundedScore}
          </div>
        </div>

        {/* Label */}
        <div>
          <p className={`font-medium ${s.label === 'text-xs' ? 'text-xs' : 'text-sm'} text-gray-500 dark:text-gray-400`}>
            {label}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className={`w-2 h-2 rounded-full ${colors.bg}`} aria-hidden="true" />
            <span className={`font-semibold text-gray-900 dark:text-white ${s.text}`}>
              {roundedScore >= 80 ? 'Highly Recommended' :
               roundedScore >= 60 ? 'Recommended' :
               roundedScore >= 40 ? 'Moderate' :
               roundedScore >= 20 ? 'Low Priority' : 'Minimal Impact'}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default RecommendationScore;

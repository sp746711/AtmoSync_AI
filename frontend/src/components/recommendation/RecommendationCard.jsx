import Card from '../common/Card';
import StatusBadge from '../common/StatusBadge';
import Skeleton from '../common/Skeleton';

/**
 * RecommendationCard - AI recommendation display card.
 *
 * @param {object} props
 * @param {object} props.recommendation
 * @param {string} props.recommendation.id
 * @param {string} props.recommendation.title
 * @param {string} [props.recommendation.description]
 * @param {string} [props.recommendation.category]
 * @param {string} [props.recommendation.priority]
 * @param {number} [props.recommendation.score]
 * @param {string} [props.recommendation.status]
 * @param {string} [props.recommendation.date]
 * @param {Array} [props.recommendation.actions]
 * @param {string} [props.recommendation.impact]
 * @param {boolean} [props.loading=false]
 * @param {function} [props.onClick]
 * @param {function} [props.onApply]
 * @param {function} [props.onDismiss]
 * @param {string} [props.className]
 */
function RecommendationCard({
  recommendation,
  loading = false,
  onClick,
  onApply,
  onDismiss,
  className = '',
}) {
  if (loading) {
    return (
      <Card padding="lg" className={className}>
        <Skeleton.Card />
      </Card>
    );
  }

  if (!recommendation) return null;

  const priorityColors = {
    high: 'border-l-red-500',
    medium: 'border-l-yellow-500',
    low: 'border-l-green-500',
    critical: 'border-l-red-600',
  };

  const borderColor = priorityColors[recommendation.priority?.toLowerCase()] || 'border-l-gray-400';

  return (
    <Card
      padding="lg"
      hoverable={!!onClick}
      onClick={() => onClick?.(recommendation)}
      className={`border-l-4 ${borderColor} ${className}`}
      ariaLabel={`Recommendation: ${recommendation.title}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
            {recommendation.title}
          </p>
          {recommendation.category && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{recommendation.category}</p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {recommendation.priority && (
            <StatusBadge status={recommendation.priority} size="sm" />
          )}
          {recommendation.status && (
            <StatusBadge
              status={recommendation.status === 'implemented' ? 'completed' : recommendation.status}
              size="sm"
            />
          )}
        </div>
      </div>

      {/* Description */}
      {recommendation.description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
          {recommendation.description}
        </p>
      )}

      {/* Score */}
      {recommendation.score != null && (
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs text-gray-500 dark:text-gray-400">AI Confidence:</span>
          <div className="flex-1 max-w-[120px] h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-primary-500"
              style={{ width: `${recommendation.score}%` }}
            />
          </div>
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
            {recommendation.score}%
          </span>
        </div>
      )}

      {/* Impact */}
      {recommendation.impact && (
        <div className="mb-3">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            <span className="font-medium text-gray-700 dark:text-gray-300">Expected Impact:</span>{' '}
            {recommendation.impact}
          </p>
        </div>
      )}

      {/* Actions */}
      {(onApply || onDismiss) && (
        <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
          {onApply && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onApply(recommendation);
              }}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-primary-50 text-primary-700 hover:bg-primary-100 dark:bg-primary-900/30 dark:text-primary-300 dark:hover:bg-primary-900/50 transition-colors"
            >
              Apply
            </button>
          )}
          {onDismiss && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDismiss(recommendation);
              }}
              className="px-3 py-1.5 text-xs font-medium rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-800 transition-colors"
            >
              Dismiss
            </button>
          )}
          {recommendation.date && (
            <span className="ml-auto text-xs text-gray-400 dark:text-gray-500">{recommendation.date}</span>
          )}
        </div>
      )}
    </Card>
  );
}

export default RecommendationCard;

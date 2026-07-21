import Card from '../common/Card';
import RiskBadge from './RiskBadge';
import Skeleton from '../common/Skeleton';

/**
 * RiskCard - Risk assessment summary card.
 *
 * @param {object} props
 * @param {object} props.risk
 * @param {string} props.risk.id
 * @param {string} props.risk.title
 * @param {string|number} props.risk.level
 * @param {string} [props.risk.description]
 * @param {string} [props.risk.category]
 * @param {string} [props.risk.region]
 * @param {number} [props.risk.score]
 * @param {string} [props.risk.date]
 * @param {string} [props.risk.recommendation]
 * @param {boolean} [props.loading=false]
 * @param {function} [props.onClick]
 * @param {string} [props.className]
 */
function RiskCard({
  risk,
  loading = false,
  onClick,
  className = '',
}) {
  if (loading) {
    return (
      <Card padding="lg" className={className}>
        <Skeleton.Card />
      </Card>
    );
  }

  if (!risk) return null;

  return (
    <Card
      padding="lg"
      hoverable={!!onClick}
      onClick={() => onClick?.(risk)}
      className={className}
      ariaLabel={`Risk: ${risk.title}`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
            {risk.title}
          </p>
          {risk.category && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{risk.category}</p>
          )}
        </div>
        <RiskBadge level={risk.level} size="sm" />
      </div>

      {risk.description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
          {risk.description}
        </p>
      )}

      <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
        {risk.region && (
          <div className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{risk.region}</span>
          </div>
        )}

        {risk.score != null && (
          <div className="flex items-center gap-1">
            <span className="font-medium">{risk.score}</span>
            <span>risk score</span>
          </div>
        )}

        {risk.date && <span>{risk.date}</span>}
      </div>

      {risk.recommendation && (
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            <span className="font-medium text-gray-700 dark:text-gray-300">Recommendation:</span>{' '}
            {risk.recommendation}
          </p>
        </div>
      )}
    </Card>
  );
}

export default RiskCard;

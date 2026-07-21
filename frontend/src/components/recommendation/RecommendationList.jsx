import RecommendationCard from './RecommendationCard';
import Skeleton from '../common/Skeleton';
import EmptyState from '../common/EmptyState';

/**
 * RecommendationList - List of AI recommendations.
 *
 * @param {object} props
 * @param {Array} [props.recommendations]
 * @param {boolean} [props.loading=false]
 * @param {function} [props.onClick]
 * @param {function} [props.onApply]
 * @param {function} [props.onDismiss]
 * @param {'grid'|'list'} [props.layout='grid']
 * @param {number} [props.columns=2]
 * @param {string} [props.emptyTitle='No recommendations']
 * @param {string} [props.emptyMessage]
 * @param {string} [props.className]
 */
function RecommendationList({
  recommendations,
  loading = false,
  onClick,
  onApply,
  onDismiss,
  layout = 'grid',
  columns = 2,
  emptyTitle = 'No recommendations',
  emptyMessage = 'There are no AI recommendations available at this time.',
  className = '',
}) {
  if (loading) {
    return (
      <div className={className}>
        <div className={`grid gap-4 ${layout === 'grid' ? `grid-cols-1 md:grid-cols-${Math.min(columns, 3)}` : 'grid-cols-1'}`}>
          {[1, 2, 3, 4].map((i) => (
            <RecommendationCard key={i} loading />
          ))}
        </div>
      </div>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        message={emptyMessage}
      />
    );
  }

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={className} role="list" aria-label="AI Recommendations">
      <div className={`grid gap-4 ${layout === 'grid' ? (gridCols[columns] || gridCols[2]) : 'grid-cols-1'}`}>
        {recommendations.map((rec, index) => (
          <RecommendationCard
            key={rec.id || index}
            recommendation={rec}
            onClick={onClick}
            onApply={onApply}
            onDismiss={onDismiss}
          />
        ))}
      </div>
    </div>
  );
}

export default RecommendationList;

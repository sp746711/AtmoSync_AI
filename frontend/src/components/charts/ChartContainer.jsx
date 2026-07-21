import Card from '../common/Card';
import Skeleton from '../common/Skeleton';
import EmptyState from '../common/EmptyState';

/**
 * ChartContainer - Universal chart wrapper with loading, empty, and error states.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {string} [props.title]
 * @param {string} [props.subtitle]
 * @param {React.ReactNode} [props.action]
 * @param {boolean} [props.loading=false]
 * @param {boolean} [props.empty=false]
 * @param {string} [props.emptyTitle='No data available']
 * @param {string} [props.emptyMessage]
 * @param {number} [props.height=300]
 * @param {boolean} [props.padding=true]
 * @param {string} [props.className]
 */
function ChartContainer({
  children,
  title,
  subtitle,
  action,
  loading = false,
  empty = false,
  emptyTitle = 'No data available',
  emptyMessage,
  height = 300,
  padding = true,
  className = '',
}) {
  const renderContent = () => {
    if (loading) {
      return (
        <div style={{ height }} className="flex items-center justify-center">
          <Skeleton variant="chart" height={height} />
        </div>
      );
    }

    if (empty) {
      return (
        <div style={{ height }} className="flex items-center justify-center">
          <EmptyState title={emptyTitle} message={emptyMessage} size="sm" />
        </div>
      );
    }

    return children;
  };

  return (
    <Card padding={padding ? 'lg' : 'none'} className={className}>
      {(title || action) && (
        <Card.Header title={title} subtitle={subtitle} action={action} />
      )}
      <div className={title ? 'mt-4' : ''}>
        {renderContent()}
      </div>
    </Card>
  );
}

export default ChartContainer;

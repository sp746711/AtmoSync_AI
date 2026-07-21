import Card from '../common/Card';
import StatusBadge from '../common/StatusBadge';
import Skeleton from '../common/Skeleton';

/**
 * ReportCard - Report summary card.
 *
 * @param {object} props
 * @param {object} props.report
 * @param {string} props.report.id
 * @param {string} props.report.title
 * @param {string} [props.report.type]
 * @param {string} [props.report.format]
 * @param {string} [props.report.status]
 * @param {string} [props.report.date]
 * @param {string} [props.report.description]
 * @param {number} [props.report.size]
 * @param {boolean} [props.loading=false]
 * @param {function} [props.onClick]
 * @param {function} [props.onDownload]
 * @param {string} [props.className]
 */
function ReportCard({
  report,
  loading = false,
  onClick,
  onDownload,
  className = '',
}) {
  if (loading) {
    return (
      <Card padding="lg" className={className}>
        <Skeleton.Card />
      </Card>
    );
  }

  if (!report) return null;

  const formatIcons = {
    pdf: (
      <svg className="w-8 h-8 text-red-500" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 9.5h1v-1H9v1zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm10 5.5h1v-3h-1v3z" />
      </svg>
    ),
    csv: (
      <svg className="w-8 h-8 text-green-500" viewBox="0 0 24 24" fill="currentColor">
        <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 2l5 5h-5V4zM8 13h8v2H8v-2zm0 4h8v2H8v-2zm0-8h3v2H8V9z" />
      </svg>
    ),
    excel: (
      <svg className="w-8 h-8 text-green-600" viewBox="0 0 24 24" fill="currentColor">
        <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 2l5 5h-5V4zm-2.36 6.33l1.96 2.36-1.96 2.36h-1.11l1.35-1.61-1.35-1.61h1.11zm1.73 0h1.11l1.96 2.36-1.96 2.36h-1.11l1.35-1.61-1.35-1.61zm-5.82 0h1.58l1.14 1.72 1.14-1.72h1.58l-1.81 2.45 1.81 2.45h-1.58l-1.14-1.72-1.14 1.72H8.55l1.81-2.45-1.81-2.45z" />
      </svg>
    ),
  };

  const icon = formatIcons[report.format?.toLowerCase()] || (
    <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    </div>
  );

  const formatSize = (bytes) => {
    if (!bytes) return null;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  return (
    <Card
      padding="lg"
      hoverable={!!onClick}
      onClick={() => onClick?.(report)}
      className={className}
      ariaLabel={`Report: ${report.title}`}
    >
      <div className="flex items-start gap-4">
        {/* Format Icon */}
        <div className="shrink-0">{icon}</div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {report.title}
              </p>
              {report.type && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{report.type}</p>
              )}
            </div>
            {report.status && (
              <StatusBadge status={report.status} size="sm" />
            )}
          </div>

          {report.description && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
              {report.description}
            </p>
          )}

          <div className="flex items-center gap-3 mt-3 text-xs text-gray-400 dark:text-gray-500">
            {report.date && <span>{report.date}</span>}
            {report.format && <span className="uppercase">{report.format}</span>}
            {report.size && <span>{formatSize(report.size)}</span>}
          </div>

          {/* Download action */}
          {onDownload && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDownload(report);
              }}
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
              aria-label={`Download ${report.title}`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download
            </button>
          )}
        </div>
      </div>
    </Card>
  );
}

export default ReportCard;

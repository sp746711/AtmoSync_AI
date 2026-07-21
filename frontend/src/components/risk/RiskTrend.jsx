import Card from '../common/Card';
import Skeleton from '../common/Skeleton';
import EmptyState from '../common/EmptyState';

/**
 * RiskTrend - Risk trend visualization (mini sparkline-like display).
 *
 * @param {object} props
 * @param {Array<{date:string, score:number, level?:string}>} [props.data]
 * @param {string} [props.title='Risk Trend']
 * @param {boolean} [props.loading=false]
 * @param {number} [props.height=100]
 * @param {string} [props.className]
 */
function RiskTrend({
  data,
  title = 'Risk Trend',
  loading = false,
  height = 100,
  className = '',
}) {
  if (loading) {
    return (
      <Card padding="lg" className={className}>
        <Skeleton variant="rect" height={height} />
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card padding="lg" className={className}>
        <Card.Header title={title} />
        <EmptyState title="No trend data" size="sm" />
      </Card>
    );
  }

  const maxScore = Math.max(...data.map((d) => d.score ?? 0), 100);
  const minScore = Math.min(...data.map((d) => d.score ?? 0), 0);
  const range = maxScore - minScore || 1;

  // Simple SVG trend chart
  const svgWidth = data.length * 30;
  const svgHeight = height;
  const padding = { top: 10, bottom: 20, left: 5, right: 5 };
  const chartWidth = svgWidth - padding.left - padding.right;
  const chartHeight = svgHeight - padding.top - padding.bottom;

  const xStep = data.length > 1 ? chartWidth / (data.length - 1) : chartWidth;
  const points = data.map((d, i) => {
    const x = padding.left + i * xStep;
    const y = padding.top + chartHeight - ((d.score - minScore) / range) * chartHeight;
    return `${x},${y}`;
  });

  const getColor = (score) => {
    if (score > 75) return '#ef4444';
    if (score > 50) return '#f97316';
    if (score > 25) return '#eab308';
    return '#22c55e';
  };

  // Calculate trend direction
  const trend = data.length > 1
    ? data[data.length - 1].score - data[0].score
    : 0;

  return (
    <Card padding="lg" className={className}>
      <div className="flex items-center justify-between mb-3">
        <Card.Header title={title} />
        {data.length > 1 && (
          <div className={`flex items-center gap-1 text-sm font-medium ${trend <= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            <svg
              className={`w-4 h-4 ${trend <= 0 ? '' : 'rotate-180'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            <span>{Math.abs(trend).toFixed(1)} pts</span>
          </div>
        )}
      </div>

      <svg
        width="100%"
        height={svgHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="overflow-visible"
        role="img"
        aria-label="Risk trend chart"
      >
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((val) => {
          const y = padding.top + chartHeight - ((val - minScore) / range) * chartHeight;
          return (
            <g key={val}>
              <line
                x1={padding.left}
                y1={y}
                x2={svgWidth - padding.right}
                y2={y}
                stroke="#e5e7eb"
                strokeDasharray="3 3"
                className="dark:stroke-gray-700"
              />
              <text x={svgWidth - padding.right} y={y - 2} textAnchor="end" fontSize="10" fill="#9ca3af">
                {val}
              </text>
            </g>
          );
        })}

        {/* Area fill */}
        <polygon
          points={`${padding.left},${svgHeight - padding.bottom} ${points.join(' ')} ${svgWidth - padding.right},${svgHeight - padding.bottom}`}
          fill="url(#gradient)"
          opacity="0.2"
        />

        {/* Line */}
        <polyline
          points={points.join(' ')}
          fill="none"
          stroke={getColor(data[data.length - 1].score)}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {data.map((d, i) => (
          <circle
            key={i}
            cx={points[i].split(',')[0]}
            cy={points[i].split(',')[1]}
            r="3"
            fill={getColor(d.score)}
            stroke="white"
            strokeWidth="1.5"
          >
            <title>{`${d.date}: Score ${d.score}`}</title>
          </circle>
        ))}

        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={getColor(data[data.length - 1].score)} stopOpacity="0.5" />
            <stop offset="100%" stopColor={getColor(data[data.length - 1].score)} stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* X-axis labels */}
      {data.length > 1 && (
        <div className="flex justify-between mt-1 px-1">
          <span className="text-xs text-gray-400">{data[0].date}</span>
          <span className="text-xs text-gray-400">{data[data.length - 1].date}</span>
        </div>
      )}
    </Card>
  );
}

export default RiskTrend;

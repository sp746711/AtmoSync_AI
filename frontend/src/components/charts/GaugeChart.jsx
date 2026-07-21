import ChartContainer from './ChartContainer';

/**
 * GaugeChart - SVG-based gauge chart for single metric visualization.
 *
 * @param {object} props
 * @param {number} props.value
 * @param {number} [props.min=0]
 * @param {number} [props.max=100]
 * @param {Array<{threshold:number, color:string}>} [props.thresholds]
 * @param {string} [props.label]
 * @param {string} [props.unit='%']
 * @param {string} [props.title]
 * @param {string} [props.subtitle]
 * @param {boolean} [props.loading=false]
 * @param {number} [props.height=250]
 * @param {string} [props.className]
 */
function GaugeChart({
  value,
  min = 0,
  max = 100,
  thresholds,
  label,
  unit = '%',
  title,
  subtitle,
  loading = false,
  height = 250,
  className = '',
}) {
  const defaultThresholds = [
    { threshold: 25, color: '#22c55e' },
    { threshold: 50, color: '#eab308' },
    { threshold: 75, color: '#f97316' },
    { threshold: 100, color: '#ef4444' },
  ];

  const colors = thresholds || defaultThresholds;

  // Normalize value between 0 and 1
  const normalizedValue = Math.max(0, Math.min(1, (value - min) / (max - min || 1)));
  const percentage = Math.round(normalizedValue * 100);

  // Get color based on thresholds
  const getColor = () => {
    for (let i = 0; i < colors.length; i++) {
      if (percentage <= colors[i].threshold) {
        return colors[i].color;
      }
    }
    return colors[colors.length - 1]?.color || '#6366f1';
  };

  const currentColor = getColor();

  // SVG arc parameters
  const cx = 150;
  const cy = 140;
  const radius = 120;
  const strokeWidth = 16;
  const startAngle = -180;
  const endAngle = 0;

  const polarToCartesian = (centerX, centerY, r, angleInDeg) => {
    const angleInRad = ((angleInDeg - 90) * Math.PI) / 180;
    return {
      x: centerX + r * Math.cos(angleInRad),
      y: centerY + r * Math.sin(angleInRad),
    };
  };

  const describeArc = (x, y, r, start, end) => {
    const startPoint = polarToCartesian(x, y, r, end);
    const endPoint = polarToCartesian(x, y, r, start);
    const largeArcFlag = end - start <= 180 ? '0' : '1';

    return [
      'M',
      startPoint.x,
      startPoint.y,
      'A',
      r,
      r,
      0,
      largeArcFlag,
      0,
      endPoint.x,
      endPoint.y,
    ].join(' ');
  };

  const arcLength = endAngle - startAngle;
  const valueAngle = startAngle + arcLength * normalizedValue;

  return (
    <ChartContainer
      title={title}
      subtitle={subtitle}
      loading={loading}
      empty={false}
      height={height}
      className={className}
    >
      <div className="flex justify-center">
        <svg
          width="300"
          height="180"
          viewBox="0 0 300 180"
          role="img"
          aria-label={`${label || 'Gauge'}: ${value}${unit}`}
        >
          {/* Background arc */}
          <path
            d={describeArc(cx, cy, radius - strokeWidth / 2, startAngle, endAngle)}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className="dark:stroke-gray-600"
          />

          {/* Value arc */}
          <path
            d={describeArc(cx, cy, radius - strokeWidth / 2, startAngle, valueAngle)}
            fill="none"
            stroke={currentColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />

          {/* Value text */}
          <text
            x={cx}
            y={cy - 10}
            textAnchor="middle"
            className="fill-gray-900 dark:fill-white"
            fontSize="32"
            fontWeight="bold"
          >
            {value}
          </text>

          {/* Unit label */}
          <text
            x={cx}
            y={cy + 20}
            textAnchor="middle"
            className="fill-gray-500 dark:fill-gray-400"
            fontSize="14"
          >
            {label || unit}
          </text>
        </svg>
      </div>

      {/* Threshold legend */}
      <div className="flex justify-center gap-4 mt-2">
        {colors.map((t, i) => (
          <div key={i} className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.color }} aria-hidden="true" />
            <span>≤{t.threshold}{unit}</span>
          </div>
        ))}
      </div>
    </ChartContainer>
  );
}

export default GaugeChart;

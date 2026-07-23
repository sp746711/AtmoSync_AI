import ChartContainer from './ChartContainer';

/**
 * HeatMap - SVG-based heatmap for visualizing data density/patterns.
 *
 * @param {object} props
 * @param {Array<{x:string, y:string, value:number}>} props.data
 * @param {string} [props.title]
 * @param {string} [props.subtitle]
 * @param {boolean} [props.loading=false]
 * @param {boolean} [props.empty=false]
 * @param {Array<string>} [props.colorRange=['#eff6ff','#dbeafe','#93c5fd','#60a5fa','#3b82f6','#2563eb','#1d4ed8']]
 * @param {number} [props.height=350]
 * @param {string} [props.className]
 */
function HeatMap({ data, title, subtitle, loading = false, empty = false, colorRange, height = 350, className = '' }) {
  const defaultColors = colorRange || ['#eff6ff', '#dbeafe', '#93c5fd', '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8'];
  const isEmpty = empty || !data || data.length === 0;

  if (!isEmpty) {
    const allValues = data.map(d => d.value);
    const minVal = Math.min(...allValues);
    const maxVal = Math.max(...allValues);
    const range = maxVal - minVal || 1;

    const getColor = (value) => {
      const normalized = (value - minVal) / range;
      const index = Math.min(Math.floor(normalized * defaultColors.length), defaultColors.length - 1);
      return defaultColors[index];
    };

    // Extract unique x and y labels
    const xLabels = [...new Set(data.map(d => d.x))];
    const yLabels = [...new Set(data.map(d => d.y))];
    const cellW = Math.max(40, Math.min(80, 600 / xLabels.length));
    const cellH = Math.max(30, Math.min(60, 400 / yLabels.length));
    const svgW = xLabels.length * cellW + 80;
    const svgH = yLabels.length * cellH + 60;

    return (
      <ChartContainer title={title} subtitle={subtitle} loading={loading} empty={false} height={height} className={className}>
        <div className="overflow-x-auto">
          <svg width={Math.max(svgW, 300)} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`} role="img" aria-label="Heat map">
            {/* Y-axis labels */}
            {yLabels.map((label, i) => (
              <text key={`y-${i}`} x={70} y={i * cellH + cellH / 2 + 30} textAnchor="end" dominantBaseline="middle" fontSize="11" fill="#9ca3af">
                {label}
              </text>
            ))}

            {/* X-axis labels */}
            {xLabels.map((label, i) => (
              <text key={`x-${i}`} x={i * cellW + cellW / 2 + 80} y={svgH - 5} textAnchor="middle" fontSize="11" fill="#9ca3af" transform={`rotate(-20, ${i * cellW + cellW / 2 + 80}, ${svgH - 5})`}>
                {label.length > 8 ? label.slice(0, 8) + '…' : label}
              </text>
            ))}

            {/* Cells */}
            {data.map((d, i) => {
              const xi = xLabels.indexOf(d.x);
              const yi = yLabels.indexOf(d.y);
              if (xi === -1 || yi === -1) return null;
              return (
                <g key={i}>
                  <rect
                    x={xi * cellW + 80}
                    y={yi * cellH + 20}
                    width={cellW - 2}
                    height={cellH - 2}
                    rx="3"
                    fill={getColor(d.value)}
                    stroke="white"
                    strokeWidth="1"
                  >
                    <title>{`${d.x} - ${d.y}: ${d.value}`}</title>
                  </rect>
                  <text
                    x={xi * cellW + cellW / 2 + 80}
                    y={yi * cellH + cellH / 2 + 20}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="10"
                    fill={d.value > (minVal + range * 0.6) ? 'white' : '#374151'}
                    fontWeight="500"
                  >
                    {d.value}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </ChartContainer>
    );
  }

  return (
    <ChartContainer title={title} subtitle={subtitle} loading={loading} empty={isEmpty} emptyTitle="No heatmap data" height={height} className={className} />
  );
}

export default HeatMap;


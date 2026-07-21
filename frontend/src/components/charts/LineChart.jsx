import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import ChartContainer from './ChartContainer';

/**
 * LineChart - Reusable line chart component.
 *
 * @param {object} props
 * @param {Array} props.data
 * @param {Array<{dataKey:string, color?:string, name?:string}>} props.lines
 * @param {string} [props.xAxisKey='name']
 * @param {string} [props.title]
 * @param {string} [props.subtitle]
 * @param {boolean} [props.loading=false]
 * @param {boolean} [props.empty=false]
 * @param {number} [props.height=300]
 * @param {boolean} [props.showGrid=true]
 * @param {boolean} [props.showLegend=true]
 * @param {boolean} [props.showTooltip=true]
 * @param {boolean} [props.dashed=false]
 * @param {string} [props.className]
 * @param {object} [props.yAxisProps]
 */
function LineChart({
  data,
  lines,
  xAxisKey = 'name',
  title,
  subtitle,
  loading = false,
  empty = false,
  height = 300,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  dashed = false,
  className = '',
  yAxisProps = {},
}) {
  const defaultColors = [
    '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#3b82f6',
    '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#06b6d4',
  ];

  const isEmpty = empty || !data || data.length === 0;

  return (
    <ChartContainer
      title={title}
      subtitle={subtitle}
      loading={loading}
      empty={isEmpty}
      emptyTitle="No chart data"
      emptyMessage="There is no data available to display the chart."
      height={height}
      className={className}
    >
      <ResponsiveContainer width="100%" height={height}>
        <RechartsLineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e5e7eb"
              className="dark:opacity-20"
            />
          )}
          <XAxis
            dataKey={xAxisKey}
            tick={{ fontSize: 12, fill: '#9ca3af' }}
            axisLine={{ stroke: '#e5e7eb' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#9ca3af' }}
            axisLine={false}
            tickLine={false}
            {...yAxisProps}
          />
          {showTooltip && (
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
              }}
            />
          )}
          {showLegend && <Legend />}
          {lines &&
            lines.map((line, index) => (
              <Line
                key={line.dataKey}
                type="monotone"
                dataKey={line.dataKey}
                name={line.name || line.dataKey}
                stroke={line.color || defaultColors[index % defaultColors.length]}
                strokeWidth={2}
                dot={false}
                strokeDasharray={dashed ? '5 5' : undefined}
                activeDot={{ r: 4, strokeWidth: 2 }}
              />
            ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

export default LineChart;

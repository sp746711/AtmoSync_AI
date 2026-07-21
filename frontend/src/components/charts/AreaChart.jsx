import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import ChartContainer from './ChartContainer';

/**
 * AreaChart - Reusable area chart component.
 *
 * @param {object} props
 * @param {Array} props.data
 * @param {Array<{dataKey:string, color?:string, name?:string}>} props.areas
 * @param {string} [props.xAxisKey='name']
 * @param {string} [props.title]
 * @param {string} [props.subtitle]
 * @param {boolean} [props.loading=false]
 * @param {boolean} [props.empty=false]
 * @param {number} [props.height=300]
 * @param {boolean} [props.showGrid=true]
 * @param {boolean} [props.showLegend=true]
 * @param {boolean} [props.showTooltip=true]
 * @param {boolean} [props.stacked=false]
 * @param {number} [props.fillOpacity=0.3]
 * @param {string} [props.className]
 */
function AreaChart({
  data,
  areas,
  xAxisKey = 'name',
  title,
  subtitle,
  loading = false,
  empty = false,
  height = 300,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  stacked = false,
  fillOpacity = 0.3,
  className = '',
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
        <RechartsAreaChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
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
          {areas &&
            areas.map((area, index) => (
              <Area
                key={area.dataKey}
                type="monotone"
                dataKey={area.dataKey}
                name={area.name || area.dataKey}
                stroke={area.color || defaultColors[index % defaultColors.length]}
                fill={area.color || defaultColors[index % defaultColors.length]}
                fillOpacity={fillOpacity}
                strokeWidth={2}
                stackId={stacked ? 'stack' : undefined}
              />
            ))}
        </RechartsAreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

export default AreaChart;

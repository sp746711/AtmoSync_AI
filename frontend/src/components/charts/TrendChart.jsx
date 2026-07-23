import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import ChartContainer from './ChartContainer';

/**
 * TrendChart - Composed chart showing trends with line + bar overlay.
 *
 * @param {object} props
 * @param {Array} props.data
 * @param {Array<{dataKey:string, color?:string, name?:string, type:'line'|'bar'}>} props.series
 * @param {string} [props.xAxisKey='name']
 * @param {string} [props.title]
 * @param {string} [props.subtitle]
 * @param {boolean} [props.loading=false]
 * @param {boolean} [props.empty=false]
 * @param {number} [props.height=300]
 * @param {boolean} [props.showGrid=true]
 * @param {string} [props.className]
 */
function TrendChart({
  data,
  series,
  xAxisKey = 'name',
  title,
  subtitle,
  loading = false,
  empty = false,
  height = 300,
  showGrid = true,
  className = '',
}) {
  const defaultColors = [
    '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#3b82f6',
    '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#06b6d4',
  ];

  const isEmpty = empty || !data || data.length === 0;
  const activeSeries = series || [];

  return (
    <ChartContainer
      title={title}
      subtitle={subtitle}
      loading={loading}
      empty={isEmpty}
      emptyTitle="No trend data"
      emptyMessage="There is no data available to display the trend."
      height={height}
      className={className}
    >
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
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
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
            }}
          />
          {activeSeries.length > 0 && <Legend />}
          {activeSeries.map((s, index) => {
            const color = s.color || defaultColors[index % defaultColors.length];
            if (s.type === 'bar') {
              return (
                <Bar
                  key={s.dataKey}
                  dataKey={s.dataKey}
                  name={s.name || s.dataKey}
                  fill={color}
                  radius={[3, 3, 0, 0]}
                  barSize={20}
                />
              );
            }
            return (
              <Line
                key={s.dataKey}
                type="monotone"
                dataKey={s.dataKey}
                name={s.name || s.dataKey}
                stroke={color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 2 }}
              />
            );
          })}
        </ComposedChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

export default TrendChart;


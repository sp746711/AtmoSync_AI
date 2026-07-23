import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import ChartContainer from './ChartContainer';

/**
 * DonutChart - Reusable donut chart (pie with inner radius).
 *
 * @param {object} props
 * @param {Array} props.data
 * @param {string} [props.dataKey='value']
 * @param {string} [props.nameKey='name']
 * @param {string} [props.title]
 * @param {string} [props.subtitle]
 * @param {boolean} [props.loading=false]
 * @param {boolean} [props.empty=false]
 * @param {number} [props.height=300]
 * @param {number} [props.innerRadius=60]
 * @param {number} [props.outerRadius='80%']
 * @param {boolean} [props.showLegend=true]
 * @param {boolean} [props.showTooltip=true]
 * @param {boolean} [props.showLabel=false]
 * @param {Array<string>} [props.colors]
 * @param {function} [props.onClick]
 * @param {string} [props.className]
 * @param {React.ReactNode} [props.centerContent]
 */
function DonutChart({
  data,
  dataKey = 'value',
  nameKey = 'name',
  title,
  subtitle,
  loading = false,
  empty = false,
  height = 300,
  innerRadius = 65,
  outerRadius = '80%',
  showLegend = true,
  showTooltip = true,
  showLabel = false,
  colors,
  onClick,
  className = '',
  centerContent,
}) {
  const defaultColors = [
    '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#3b82f6',
    '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#06b6d4',
  ];

  const isEmpty = empty || !data || data.length === 0;
  const total = !isEmpty ? data.reduce((sum, item) => sum + (item[dataKey] || 0), 0) : 0;

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
      <div className="relative">
        <ResponsiveContainer width="100%" height={height}>
          <RechartsPieChart>
            <Pie
              data={data}
              dataKey={dataKey}
              nameKey={nameKey}
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              label={showLabel}
              onClick={onClick}
              cursor={onClick ? 'pointer' : 'default'}
              paddingAngle={2}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors?.[index] || defaultColors[index % defaultColors.length]}
                />
              ))}
            </Pie>
            {showTooltip && (
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                }}
                formatter={(val) => [`${val}`, undefined]}
              />
            )}
            {showLegend && <Legend />}
          </RechartsPieChart>
        </ResponsiveContainer>

        {/* Center content */}
        {centerContent && !isEmpty && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ top: 0, left: 0, right: 0, bottom: 0 }}>
            <div className="text-center">
              {centerContent}
            </div>
          </div>
        )}
      </div>
    </ChartContainer>
  );
}

export default DonutChart;


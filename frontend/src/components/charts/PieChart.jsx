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
 * PieChart - Reusable pie/donut chart component.
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
 * @param {boolean} [props.donut=false]
 * @param {number} [props.innerRadius=0]
 * @param {number} [props.outerRadius='80%']
 * @param {boolean} [props.showLegend=true]
 * @param {boolean} [props.showTooltip=true]
 * @param {boolean} [props.showLabel=false]
 * @param {Array<string>} [props.colors]
 * @param {function} [props.onClick]
 * @param {string} [props.className]
 */
function PieChart({
  data,
  dataKey = 'value',
  nameKey = 'name',
  title,
  subtitle,
  loading = false,
  empty = false,
  height = 300,
  donut = false,
  innerRadius,
  outerRadius = '80%',
  showLegend = true,
  showTooltip = true,
  showLabel = false,
  colors,
  onClick,
  className = '',
}) {
  const defaultColors = [
    '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#3b82f6',
    '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#06b6d4',
  ];

  const isEmpty = empty || !data || data.length === 0;
  const actualInnerRadius = donut ? (innerRadius || 60) : (innerRadius || 0);

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
        <RechartsPieChart>
          <Pie
            data={data}
            dataKey={dataKey}
            nameKey={nameKey}
            cx="50%"
            cy="50%"
            innerRadius={actualInnerRadius}
            outerRadius={outerRadius}
            label={showLabel}
            onClick={onClick}
            cursor={onClick ? 'pointer' : 'default'}
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
            />
          )}
          {showLegend && <Legend />}
        </RechartsPieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

export default PieChart;

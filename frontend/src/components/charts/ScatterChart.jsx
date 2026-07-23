import {
  ScatterChart as RechartsScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ZAxis,
  ResponsiveContainer,
} from 'recharts';
import ChartContainer from './ChartContainer';

/**
 * ScatterChart - Reusable scatter/bubble chart component.
 *
 * @param {object} props
 * @param {Array} props.data
 * @param {{dataKey:string, color?:string, name?:string, zDataKey?:string}} [props.series]
 * @param {string} [props.xAxisKey='x']
 * @param {string} [props.yAxisKey='y']
 * @param {string} [props.title]
 * @param {string} [props.subtitle]
 * @param {boolean} [props.loading=false]
 * @param {boolean} [props.empty=false]
 * @param {number} [props.height=300]
 * @param {boolean} [props.showGrid=true]
 * @param {string} [props.className]
 * @param {string} [props.xLabel='X']
 * @param {string} [props.yLabel='Y']
 */
function ScatterChart({
  data,
  series,
  xAxisKey = 'x',
  yAxisKey = 'y',
  title,
  subtitle,
  loading = false,
  empty = false,
  height = 300,
  showGrid = true,
  className = '',
  xLabel,
  yLabel,
}) {
  const isEmpty = empty || !data || data.length === 0;

  const defaultSeries = {
    dataKey: yAxisKey,
    name: 'Data',
    color: '#6366f1',
  };

  const activeSeries = series || defaultSeries;

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
        <RechartsScatterChart margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e5e7eb"
              className="dark:opacity-20"
            />
          )}
          <XAxis
            dataKey={xAxisKey}
            name={xLabel || xAxisKey}
            tick={{ fontSize: 12, fill: '#9ca3af' }}
            axisLine={{ stroke: '#e5e7eb' }}
            tickLine={false}
            type="number"
          />
          <YAxis
            dataKey={activeSeries.dataKey}
            name={yLabel || yAxisKey}
            tick={{ fontSize: 12, fill: '#9ca3af' }}
            axisLine={false}
            tickLine={false}
            type="number"
          />
          {activeSeries.zDataKey && <ZAxis dataKey={activeSeries.zDataKey} range={[50, 400]} />}
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
            }}
            cursor={{ strokeDasharray: '3 3' }}
          />
          <Scatter
            name={activeSeries.name}
            data={data}
            fill={activeSeries.color || '#6366f1'}
            stroke="white"
            strokeWidth={1}
          />
        </RechartsScatterChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

export default ScatterChart;


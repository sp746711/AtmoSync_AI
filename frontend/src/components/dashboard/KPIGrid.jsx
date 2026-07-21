import SummaryCard from './SummaryCard';

const defaultKPIs = [
  {
    title: 'Total Shipments',
    value: '—',
    icon: (
      <svg className="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
      </svg>
    ),
  },
  {
    title: 'Active Alerts',
    value: '—',
    icon: (
      <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    color: 'bg-amber-50 dark:bg-amber-900/30',
  },
  {
    title: 'On-Time Delivery',
    value: '—',
    icon: (
      <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: 'bg-green-50 dark:bg-green-900/30',
  },
  {
    title: 'High Risk',
    value: '—',
    icon: (
      <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: 'bg-red-50 dark:bg-red-900/30',
  },
];

/**
 * KPIGrid - Grid of KPI summary cards.
 *
 * @param {object} props
 * @param {Array} [props.kpis] - Array of KPI objects
 * @param {number} [props.columns=4]
 * @param {boolean} [props.loading=false]
 * @param {string} [props.className]
 */
function KPIGrid({
  kpis = defaultKPIs,
  columns = 4,
  loading = false,
  className = '',
}) {
  const columnStyles = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
    6: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
  };

  return (
    <div className={`grid gap-4 ${columnStyles[columns] || columnStyles[4]} ${className}`}>
      {kpis.map((kpi, index) => (
        <SummaryCard
          key={kpi.title || index}
          title={kpi.title}
          value={kpi.value}
          subtitle={kpi.subtitle}
          icon={kpi.icon}
          trend={kpi.trend}
          color={kpi.color}
          loading={loading}
          onClick={kpi.onClick}
          size={kpi.size}
        />
      ))}
    </div>
  );
}

export default KPIGrid;

import KPIGrid from './KPIGrid';
import Card from '../common/Card';
import Skeleton from '../common/Skeleton';

/**
 * DashboardStats - Dashboard statistics section with KPIs and summary.
 *
 * @param {object} props
 * @param {Array} [props.kpis]
 * @param {object} [props.summary]
 * @param {string|number} [props.summary.totalShipments]
 * @param {string|number} [props.summary.activeAlerts]
 * @param {string|number} [props.summary.onTimeRate]
 * @param {string|number} [props.summary.highRisk]
 * @param {boolean} [props.loading=false]
 * @param {string} [props.className]
 */
function DashboardStats({
  kpis,
  summary,
  loading = false,
  className = '',
}) {
  if (loading) {
    return (
      <section className={className} aria-label="Dashboard statistics loading">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} padding="lg">
              <Skeleton.Card />
            </Card>
          ))}
        </div>
      </section>
    );
  }

  const mappedKPIs = kpis || (summary
    ? [
        {
          title: 'Total Shipments',
          value: summary.totalShipments ?? '—',
          icon: (
            <svg className="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
            </svg>
          ),
        },
        {
          title: 'Active Alerts',
          value: summary.activeAlerts ?? '—',
          color: 'bg-amber-50 dark:bg-amber-900/30',
          icon: (
            <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          ),
        },
        {
          title: 'On-Time Delivery',
          value: summary.onTimeRate != null ? `${summary.onTimeRate}%` : '—',
          trend: { value: 5.2, direction: 'up', label: 'vs last month' },
          color: 'bg-green-50 dark:bg-green-900/30',
          icon: (
            <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
        },
        {
          title: 'High Risk',
          value: summary.highRisk ?? '—',
          trend: { value: 2.1, direction: 'down', label: 'vs last month' },
          color: 'bg-red-50 dark:bg-red-900/30',
          icon: (
            <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
        },
      ]
    : undefined);

  return (
    <section className={className} aria-label="Dashboard statistics">
      <KPIGrid kpis={mappedKPIs} loading={false} />
    </section>
  );
}

export default DashboardStats;

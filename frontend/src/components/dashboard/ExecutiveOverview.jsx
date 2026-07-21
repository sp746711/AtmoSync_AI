import Card from '../common/Card';
import KPIGrid from './KPIGrid';
import ActivityTimeline from './ActivityTimeline';
import RecentShipments from './RecentShipments';

/**
 * ExecutiveOverview - Executive dashboard overview section.
 *
 * @param {object} props
 * @param {Array} [props.kpis]
 * @param {Array} [props.recentShipments]
 * @param {Array} [props.activities]
 * @param {boolean} [props.loading=false]
 * @param {string} [props.className]
 */
function ExecutiveOverview({
  kpis,
  recentShipments,
  activities,
  loading = false,
  className = '',
}) {
  return (
    <section className={className} aria-label="Executive Overview">
      {/* KPI Cards */}
      <div className="mb-6">
        <KPIGrid kpis={kpis} loading={loading} />
      </div>

      {/* Activity Timeline & Recent Shipments */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card padding="lg">
          <Card.Header
            title="Recent Activity"
            subtitle="Latest system activities and updates"
          />
          <div className="mt-4">
            <ActivityTimeline activities={activities} loading={loading} />
          </div>
        </Card>

        <Card padding="lg">
          <Card.Header
            title="Recent Shipments"
            subtitle="Latest shipment updates"
          />
          <div className="mt-4">
            <RecentShipments shipments={recentShipments} loading={loading} />
          </div>
        </Card>
      </div>
    </section>
  );
}

export default ExecutiveOverview;

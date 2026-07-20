/**
 * KpiCard
 *
 * Reusable dashboard KPI card.
 *
 * Future-ready for:
 * - API values
 * - Loading states
 * - Icons
 * - Trend indicators
 * - Status colors
 */
function KpiCard({
  title,
  value = "—",
  description,
  trend = null,
  icon = null,
}) {
  return (
    <article className="kpi-card" aria-labelledby={`kpi-${title}`}>
      <div className="kpi-card__header">
        <h2 id={`kpi-${title}`} className="kpi-card__title">
          {title}
        </h2>

        {icon && <div className="kpi-card__icon">{icon}</div>}
      </div>

      <div className="kpi-card__value">
        {value}
      </div>

      {description && (
        <p className="kpi-card__description">
          {description}
        </p>
      )}

      {trend && (
        <div className="kpi-card__trend">
          {trend}
        </div>
      )}
    </article>
  );
}

/**
 * DashboardStats
 *
 * Dashboard KPI section.
 * Uses placeholder values until backend integration.
 */
function DashboardStats() {
  const stats = [
    {
      title: "Total Climate Risks",
      description:
        "Aggregated climate risks detected across monitored regions.",
    },
    {
      title: "Active Alerts",
      description:
        "Current alerts requiring immediate attention.",
    },
    {
      title: "High Risk Regions",
      description:
        "Regions currently classified as high risk.",
    },
    {
      title: "AI Recommendations",
      description:
        "AI-generated recommendations awaiting review.",
    },
  ];

  return (
    <section
      className="dashboard-stats"
      aria-label="Dashboard Statistics"
    >
      <div className="dashboard-stats__grid">
        {stats.map((stat) => (
          <KpiCard
            key={stat.title}
            title={stat.title}
            description={stat.description}
          />
        ))}
      </div>
    </section>
  );
}

export default DashboardStats;
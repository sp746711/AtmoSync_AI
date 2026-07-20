/**
 * ChartContainer
 *
 * Reusable wrapper for dashboard visualizations.
 *
 * Future-ready for:
 * - Recharts
 * - Chart.js
 * - ECharts
 * - Filters
 * - Export
 * - Fullscreen
 * - Loading states
 */
function ChartContainer({
  title,
  subtitle,
  children,
}) {
  return (
    <article className="chart-container" aria-labelledby={`chart-${title}`}>
      <header className="chart-container__header">
        <h3 id={`chart-${title}`} className="chart-container__title">
          {title}
        </h3>

        {subtitle && (
          <p className="chart-container__subtitle">
            {subtitle}
          </p>
        )}
      </header>

      <div className="chart-container__body">
        {children || (
          <div className="chart-container__placeholder">
            Chart component will appear here.
          </div>
        )}
      </div>
    </article>
  );
}

/**
 * DashboardCharts
 *
 * Dashboard visualization section.
 * Displays reusable chart containers.
 */
function DashboardCharts() {
  const charts = [
    {
      title: "Climate Trends",
      subtitle: "Time-series analysis of climate indicators.",
    },
    {
      title: "Risk Distribution",
      subtitle: "Regional distribution of environmental risks.",
    },
    {
      title: "Weather Analytics",
      subtitle: "Weather metrics and environmental observations.",
    },
    {
      title: "Prediction Overview",
      subtitle: "AI-generated forecasts and confidence insights.",
    },
  ];

  return (
    <section
      className="dashboard-charts"
      aria-label="Dashboard Charts"
    >
      <div className="dashboard-charts__grid">
        {charts.map((chart) => (
          <ChartContainer
            key={chart.title}
            title={chart.title}
            subtitle={chart.subtitle}
          />
        ))}
      </div>
    </section>
  );
}

export default DashboardCharts;
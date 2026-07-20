/**
 * ExecutiveMetrics
 *
 * Reusable metric cards (placeholders only; no fake numbers).
 */
function MetricCard({ title, description }) {
  return (
    <article
      className="executive-metric-card"
      aria-label={`Metric: ${title}`}
    >
      <div className="executive-metric-card__header">
        <h2 className="executive-metric-card__title">{title}</h2>
      </div>

      <div className="executive-metric-card__value" aria-label="Placeholder value">
        —
      </div>

      <p className="executive-metric-card__description">{description}</p>
    </article>
  );
}

function ExecutiveMetrics() {
  const metrics = [
    {
      title: "Overall Climate Risk",
      description:
        "Aggregated climate risk posture across monitored indicators and regions.",
    },
    {
      title: "Environmental Health Score",
      description:
        "Qualitative placeholder for environmental health assessment output.",
    },
    {
      title: "Operational Readiness",
      description:
        "Readiness placeholder reflecting preparedness and response capability.",
    },
    {
      title: "AI Confidence Score",
      description:
        "Placeholder for model confidence and decision-support reliability.",
    },
  ];

  return (
    <section className="executive-metrics" aria-label="Executive Metrics">
      <h2 className="executive-section-title">Key Metrics</h2>

      <div className="executive-metrics__grid">
        {metrics.map((metric) => (
          <MetricCard
            key={metric.title}
            title={metric.title}
            description={metric.description}
          />
        ))}
      </div>
    </section>
  );
}

export default ExecutiveMetrics;


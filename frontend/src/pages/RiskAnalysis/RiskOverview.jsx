/**
 * RiskOverviewCard
 *
 * Reusable risk overview card.
 *
 * Future-ready for:
 * - API values
 * - Trend indicators
 * - Status colors
 * - Icons
 * - Loading state
 */
function RiskOverviewCard({
  title,
  value = "—",
  description,
  trend = null,
  icon = null,
}) {
  const headingId = `risk-overview-${title
    .replace(/\s+/g, "-")
    .toLowerCase()}`;

  return (
    <article
      className="risk-overview__card"
      aria-labelledby={headingId}
    >
      <header className="risk-overview__card-header">
        <h3
          id={headingId}
          className="risk-overview__card-title"
        >
          {title}
        </h3>

        {icon && (
          <div className="risk-overview__card-icon">
            {icon}
          </div>
        )}
      </header>

      <div className="risk-overview__card-value">
        {value}
      </div>

      {description && (
        <p className="risk-overview__card-description">
          {description}
        </p>
      )}

      {trend && (
        <div className="risk-overview__card-trend">
          {trend}
        </div>
      )}
    </article>
  );
}

/**
 * RiskOverview
 *
 * Displays summary cards for the Risk Analysis page.
 * Placeholder values until backend integration.
 */
function RiskOverview() {
  const cards = [
    {
      title: "Total Risks",
      description:
        "Total operational climate risks across the selected scope.",
    },
    {
      title: "High Severity",
      description:
        "Count of risks classified as high severity within the selected scope.",
    },
    {
      title: "Medium Severity",
      description:
        "Count of risks classified as medium severity within the selected scope.",
    },
    {
      title: "Low Severity",
      description:
        "Count of risks classified as low severity within the selected scope.",
    },
  ];

  return (
    <section
      className="risk-overview"
      aria-labelledby="risk-overview-title"
    >
      <h2
        id="risk-overview-title"
        className="risk-section-title"
      >
        Risk Overview
      </h2>

      <div className="risk-overview__grid">
        {cards.map((card) => (
          <RiskOverviewCard
            key={card.title}
            title={card.title}
            description={card.description}
          />
        ))}
      </div>
    </section>
  );
}

export default RiskOverview;
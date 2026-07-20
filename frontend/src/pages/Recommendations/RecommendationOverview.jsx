/**
 * RecommendationOverview
 *
 * Overview summary cards for the Recommendations page.
 *
 * Placeholder-only rendering:
 * - No hooks
 * - No state
 * - No effects
 * - No business logic
 * - No API calls
 *
 * The card content is derived from a static configuration array and
 * rendered with map() for future scalability.
 */
function RecommendationOverview() {
  const overviewCards = [
    {
      title: "Total Recommendations",
      value: "—",
      description:
        "Total number of AI-generated climate recommendations available for review.",
      icon: "📋",
      trend: "—",
    },
    {
      title: "High Priority",
      value: "—",
      description:
        "Recommendations currently categorized as high priority for operational planning.",
      icon: "⚡",
      trend: "—",
    },
    {
      title: "In Progress",
      value: "—",
      description:
        "Recommendations with active implementation or review work underway.",
      icon: "⏳",
      trend: "—",
    },
    {
      title: "Completed",
      value: "—",
      description:
        "Recommendations that have been fully implemented and marked complete.",
      icon: "✅",
      trend: "—",
    },
  ];

  return (
    <section
      className="recommendations-overview"
      aria-labelledby="recommendations-overview-title"
    >
      <h2
        id="recommendations-overview-title"
        className="recommendations-overview__title"
      >
        Overview
      </h2>

      <div className="recommendations-overview__cards" role="list">
        {overviewCards.map((card) => (
          <article
            key={card.title}
            className="recommendations-overview__card"
            role="listitem"
          >
            <div className="recommendations-overview__card-header">
              <div className="recommendations-overview__card-icon" aria-hidden="true">
                {card.icon}
              </div>
              <h3 className="recommendations-overview__card-title">{card.title}</h3>
            </div>

            <div className="recommendations-overview__card-value-wrapper">
              <p className="recommendations-overview__card-value">{card.value}</p>
              <p className="recommendations-overview__card-trend">
                Trend: <span className="recommendations-overview__card-trend-value">{card.trend}</span>
              </p>
            </div>

            <p className="recommendations-overview__card-description">{card.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default RecommendationOverview;


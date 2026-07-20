/**
 * RecommendationCard
 *
 * Reusable recommendation card.
 *
 * Future-ready for:
 * - Icons
 * - Status badges
 * - Disabled state
 * - API integration
 */
function RecommendationCard({
  title,
  description,
  buttonText,
  icon = null,
  disabled = false,
  onClick,
}) {
  const headingId = `risk-rec-${title.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <article
      className="risk-recommendations__card"
      aria-labelledby={headingId}
    >
      <header className="risk-recommendations__header">
        <h3
          id={headingId}
          className="risk-recommendations__title"
        >
          {title}
        </h3>

        {icon && (
          <div className="risk-recommendations__icon">
            {icon}
          </div>
        )}
      </header>

      {description && (
        <p className="risk-recommendations__description">
          {description}
        </p>
      )}

      <div className="risk-recommendations__actions">
        <button
          type="button"
          className="button button--primary"
          disabled={disabled}
          onClick={onClick}
        >
          {buttonText}
        </button>
      </div>
    </article>
  );
}

/**
 * RiskRecommendations
 *
 * Recommendation section.
 * Placeholder content until backend integration.
 */
function RiskRecommendations() {
  const recommendations = [
    {
      title: "Strengthen Monitoring",
      description:
        "Placeholder guidance for expanding monitoring coverage.",
      buttonText: "View Details",
    },
    {
      title: "Increase Preparedness",
      description:
        "Placeholder guidance for improving operational readiness.",
      buttonText: "View Details",
    },
    {
      title: "Review Resource Allocation",
      description:
        "Placeholder guidance for optimizing resource distribution.",
      buttonText: "View Details",
    },
    {
      title: "Improve Data Coverage",
      description:
        "Placeholder guidance for enhancing data quality and availability.",
      buttonText: "View Details",
    },
  ];

  return (
    <section
      className="risk-recommendations"
      aria-labelledby="risk-recommendations-title"
    >
      <h2
        id="risk-recommendations-title"
        className="risk-section-title"
      >
        Recommendations
      </h2>

      <div className="risk-recommendations__grid">
        {recommendations.map((recommendation) => (
          <RecommendationCard
            key={recommendation.title}
            title={recommendation.title}
            description={recommendation.description}
            buttonText={recommendation.buttonText}
          />
        ))}
      </div>
    </section>
  );
}

export default RiskRecommendations;
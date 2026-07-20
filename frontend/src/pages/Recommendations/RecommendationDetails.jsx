/**
 * RecommendationDetails
 *
 * Displays detailed information for the selected recommendation.
 *
 * Placeholder implementation until backend integration.
 *
 * Future-ready for:
 * - AI-generated recommendation details
 * - Priority and status badges
 * - Confidence score
 * - Region information
 * - Suggested actions
 * - FastAPI integration
 */
function RecommendationDetails() {
  const metadataItems = [
    { label: "Priority", value: "—" },
    { label: "Status", value: "—" },
    { label: "Region", value: "—" },
    { label: "Confidence", value: "—" },
    { label: "Suggested Action", value: "—" },
  ];

  return (
    <section
      className="recommendations-details"
      aria-labelledby="recommendations-details-title"
    >
      <header className="recommendations-details__header">
        <h2
          id="recommendations-details-title"
          className="recommendations-details__title"
        >
          Recommendation Details
        </h2>

        <p className="recommendations-details__section-description">
          Review detailed information for the selected AI-generated
          recommendation. Complete recommendation data will be available after
          backend integration.
        </p>
      </header>

      <article
        className="recommendations-details__panel"
        aria-labelledby="recommendation-title"
      >
        <h3
          id="recommendation-title"
          className="recommendations-details__heading"
        >
          —
        </h3>

        <p className="recommendations-details__panel-description">
          Detailed recommendation content will appear here after backend
          integration.
        </p>

        <dl className="recommendations-details__metadata">
          {metadataItems.map((item) => (
            <div
              key={item.label}
              className="recommendations-details__metadata-item"
            >
              <dt className="recommendations-details__metadata-label">
                {item.label}
              </dt>

              <dd className="recommendations-details__metadata-value">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="recommendations-details__actions">
          <button
            type="button"
            className="button button--primary"
          >
            View Full Recommendation
          </button>
        </div>
      </article>
    </section>
  );
}

export default RecommendationDetails;
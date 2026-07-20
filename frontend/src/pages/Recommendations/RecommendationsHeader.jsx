/**
 * RecommendationsHeader
 *
 * Displays the page title, description, and last updated placeholder
 * for the Recommendations page.
 */
function RecommendationsHeader() {
  return (
    <header
      className="recommendations-header"
      aria-labelledby="recommendations-title"
    >
      <div className="recommendations-header__content">
        <h1
          id="recommendations-title"
          className="recommendations-header__title"
        >
          Recommendations
        </h1>

        <p className="recommendations-header__description">
          Review AI-generated climate recommendations to reduce operational
          risks, prioritize mitigation strategies, and support informed
          decision-making across monitored regions.
        </p>
      </div>

      <div
        className="recommendations-header__meta"
        role="status"
        aria-live="polite"
      >
        <span className="recommendations-header__meta-label">
          Last Updated:
        </span>

        <span className="recommendations-header__meta-value">
          —
        </span>
      </div>
    </header>
  );
}

export default RecommendationsHeader;
function RiskAnalysisHeader({
  title = "Risk Analysis",
  description = "Explore regional climate-related risks, AI-generated assessments, and mitigation recommendations with an operational view for planning and preparedness.",
  lastUpdated = "—",
}) {
  return (
    <header
      className="risk-analysis-header"
      aria-labelledby="risk-analysis-title"
    >
      <div className="risk-analysis-header__content">
        <h1
          id="risk-analysis-title"
          className="risk-analysis-header__title"
        >
          {title}
        </h1>

        <p className="risk-analysis-header__description">
          {description}
        </p>
      </div>

      <div
        className="risk-analysis-header__meta"
        role="status"
        aria-live="polite"
      >
        <span className="risk-analysis-header__meta-label">
          Last Updated:
        </span>

        <span className="risk-analysis-header__meta-value">
          {lastUpdated}
        </span>
      </div>
    </header>
  );
}

export default RiskAnalysisHeader;
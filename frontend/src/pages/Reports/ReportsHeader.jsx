/**
 * ReportsHeader
 *
 * Enterprise-ready header for the Reports page.
 * - Page title
 * - Description
 * - Last Updated placeholder
 *
 * Semantic HTML and future-ready structure for backend integration.
 */
function ReportsHeader({
  title = "Reports",
  description =
    "Generate, preview, and export AI-generated climate intelligence reports for operational decision-making.",
  lastUpdated = "—",
}) {
  return (
    <header className="reports-header" aria-labelledby="reports-title">
      <div className="reports-header__content">
        <h1 id="reports-title" className="reports-header__title">
          {title}
        </h1>

        <p className="reports-header__description">
          {description}
        </p>
      </div>

      <div
        className="reports-header__meta"
        role="status"
        aria-live="polite"
      >
        <span className="reports-header__meta-label">Last Updated:</span>
        <span className="reports-header__meta-value">{lastUpdated}</span>
      </div>
    </header>
  );
}

export default ReportsHeader;


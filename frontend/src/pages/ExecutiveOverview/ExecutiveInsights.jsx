/**
 * InsightPanel
 *
 * Reusable executive insight container.
 *
 * Future-ready for:
 * - AI insights
 * - Status badges
 * - Expand/collapse
 * - Action buttons
 * - Rich content
 */
function InsightPanel({
  title,
  content,
  children,
}) {
  const headingId = `insight-${title.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <article
      className="executive-insight"
      aria-labelledby={headingId}
    >
      <header className="executive-insight__header">
        <h3
          id={headingId}
          className="executive-insight__title"
        >
          {title}
        </h3>
      </header>

      <div className="executive-insight__body">
        {children || (
          <p className="executive-insight__content">
            {content}
          </p>
        )}
      </div>
    </article>
  );
}

/**
 * ExecutiveInsights
 *
 * Strategic executive insights.
 * Placeholder content until backend integration.
 */
function ExecutiveInsights() {
  const insights = [
    {
      title: "Emerging Climate Trends",
      content:
        "Placeholder narrative describing emerging trends that may influence strategic planning in the near term.",
    },
    {
      title: "Regional Risk Summary",
      content:
        "Placeholder summary of regional climate risks and their primary contributing factors.",
    },
    {
      title: "Resource Allocation",
      content:
        "Placeholder guidance for aligning resources with priority risk areas and operational objectives.",
    },
    {
      title: "Operational Impact",
      content:
        "Placeholder overview connecting environmental intelligence with operational readiness and response capacity.",
    },
  ];

  return (
    <section
      className="executive-insights"
      aria-labelledby="executive-insights-title"
    >
      <h2
        id="executive-insights-title"
        className="executive-section-title"
      >
        Strategic Insights
      </h2>

      <div className="executive-insights__grid">
        {insights.map((insight) => (
          <InsightPanel
            key={insight.title}
            title={insight.title}
            content={insight.content}
          />
        ))}
      </div>
    </section>
  );
}

export default ExecutiveInsights;
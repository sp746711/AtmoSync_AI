/**
 * ReportOverview
 *
 * Four overview cards for the Reports page.
 * Rendered via map() with placeholder values.
 */
function ReportOverviewCard({
  title,
  value,
  description,
  trend,
}) {
  return (
    <article
      className="report-overview__card"
      aria-labelledby={`report-overview-${title}-heading`}
    >
      <header className="report-overview__card-header">
        <h3
          id={`report-overview-${title}-heading`}
          className="report-overview__card-title"
        >
          {title}
        </h3>
      </header>

      <div className="report-overview__card-value" aria-label="Placeholder value">
        {value}
      </div>

      <p className="report-overview__card-description">{description}</p>

      {trend ? (
        <div className="report-overview__card-trend" aria-label="Trend">
          {trend}
        </div>
      ) : null}
    </article>
  );
}

function ReportOverview() {
  const cards = [
    {
      title: "Total Reports",
      value: "—",
      description: "Total number of reports available for review and export.",
      trend: "—",
    },
    {
      title: "Scheduled Reports",
      value: "—",
      description: "Reports queued for generation on future schedules.",
      trend: "—",
    },
    {
      title: "Generated Today",
      value: "—",
      description: "Reports successfully generated within today\u2019s window.",
      trend: "—",
    },
    {
      title: "Export Success Rate",
      value: "—",
      description: "Percentage of exports completed successfully.",
      trend: "—",
    },
  ];

  return (
    <section
      className="report-overview"
      aria-label="Report Overview"
    >
      <h2 className="report-overview__title" id="report-overview-title">
        Overview
      </h2>

      <div className="report-overview__grid">
        {cards.map((card) => (
          <ReportOverviewCard
            key={card.title}
            title={card.title}
            value={card.value}
            description={card.description}
            trend={card.trend}
          />
        ))}
      </div>
    </section>
  );
}

export default ReportOverview;


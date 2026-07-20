/**
 * HighlightCard
 *
 * Reusable executive highlight card.
 *
 * Future-ready for:
 * - Status badges
 * - Priority indicators
 * - Icons
 * - Links
 * - Rich content
 */
function HighlightCard({
  title,
  content,
  children,
}) {
  const headingId = `highlight-${title.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <article
      className="executive-highlight-card"
      aria-labelledby={headingId}
    >
      <header className="executive-highlight-card__header">
        <h3
          id={headingId}
          className="executive-highlight-card__title"
        >
          {title}
        </h3>
      </header>

      <div className="executive-highlight-card__body">
        {children || (
          <p className="executive-highlight-card__content">
            {content}
          </p>
        )}
      </div>
    </article>
  );
}

function ExecutiveHighlights() {
  const highlights = [
    {
      title: "Critical Alerts",
      content:
        "Placeholder for urgent alerts requiring executive attention or cross-agency coordination.",
    },
    {
      title: "Key Achievements",
      content:
        "Placeholder summarizing notable progress across monitoring, preparedness, and decision support.",
    },
    {
      title: "Top Priorities",
      content:
        "Placeholder for the highest-impact priorities for the upcoming planning cycle.",
    },
  ];

  return (
    <section
      className="executive-highlights"
      aria-labelledby="executive-highlights-title"
    >
      <h2
        id="executive-highlights-title"
        className="executive-section-title"
      >
        Highlights
      </h2>

      <div className="executive-highlights__grid">
        {highlights.map((highlight) => (
          <HighlightCard
            key={highlight.title}
            title={highlight.title}
            content={highlight.content}
          />
        ))}
      </div>
    </section>
  );
}

export default ExecutiveHighlights;
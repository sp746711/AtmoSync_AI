import ExecutiveSummary from "./ExecutiveSummary";
import ExecutiveMetrics from "./ExecutiveMetrics";
import ExecutiveInsights from "./ExecutiveInsights";
import ExecutiveHighlights from "./ExecutiveHighlights";
import ExecutiveRecommendations from "./ExecutiveRecommendations";

/**
 * ExecutiveOverview
 *
 * Responsibilities:
 * - Compose all Executive Overview sections.
 * - Presentation-only (no API calls, no business logic).
 */
function ExecutiveOverview() {
  return (
    <section
      className="executive-overview"
      aria-label="Executive Overview"
    >
      <ExecutiveSummary />

      <ExecutiveMetrics />

      <ExecutiveInsights />

      <ExecutiveHighlights />

      <ExecutiveRecommendations />
    </section>
  );
}

export default ExecutiveOverview;


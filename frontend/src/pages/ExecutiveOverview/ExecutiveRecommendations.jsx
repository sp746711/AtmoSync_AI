import ExecutiveSummary from "./ExecutiveSummary";
import ExecutiveMetrics from "./ExecutiveMetrics";
import ExecutiveInsights from "./ExecutiveInsights";
import ExecutiveHighlights from "./ExecutiveHighlights";
import ExecutiveRecommendations from "./ExecutiveRecommendations";

/**
 * ExecutiveOverview
 *
 * Main Executive Overview page.
 *
 * Responsibilities:
 * - Compose executive overview sections.
 * - Presentation only.
 * - No API calls.
 * - No business logic.
 */
function ExecutiveOverview() {
  return (
    <main
      className="executive-overview"
      aria-label="Executive Overview"
    >
      <ExecutiveSummary />

      <ExecutiveMetrics />

      <ExecutiveInsights />

      <ExecutiveHighlights />

      <ExecutiveRecommendations />
    </main>
  );
}

export default ExecutiveOverview;
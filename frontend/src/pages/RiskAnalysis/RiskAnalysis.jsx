import RiskAnalysisHeader from "./RiskAnalysisHeader";
import RiskFilters from "./RiskFilters";
import RiskOverview from "./RiskOverview";
import RiskTable from "./RiskTable";
import RiskMap from "./RiskMap";
import RiskRecommendations from "./RiskRecommendations";

/**
 * RiskAnalysis
 *
 * Phase 10 - Risk Analysis Module
 *
 * Responsibilities
 * - Compose all Risk Analysis sections.
 * - Presentation only: no state, no hooks, no API calls, no charts.
 */
function RiskAnalysis() {
  return (
    <main className="risk-analysis" aria-label="Risk Analysis">
      <RiskAnalysisHeader />

      <section
        className="risk-analysis__filters"
        aria-label="Risk Filters"
      >
        <RiskFilters />
      </section>

      <section
        className="risk-analysis__overview"
        aria-label="Risk Overview"
      >
        <RiskOverview />
      </section>

      <section
        className="risk-analysis__table"
        aria-label="Risk Table"
      >
        <RiskTable />
      </section>

      <section className="risk-analysis__map" aria-label="Risk Map">
        <RiskMap />
      </section>

      <section
        className="risk-analysis__recommendations"
        aria-label="Risk Recommendations"
      >
        <RiskRecommendations />
      </section>
    </main>
  );
}

export default RiskAnalysis;


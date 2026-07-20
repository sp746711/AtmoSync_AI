import ReportsHeader from "./ReportsHeader";
import ReportFilters from "./ReportFilters";
import ReportOverview from "./ReportOverview";
import ReportTable from "./ReportTable";
import ReportPreview from "./ReportPreview";
import ReportActions from "./ReportActions";

/**
 * Reports
 *
 * Reports page composition root for the AtmoSync AI Climate Intelligence Platform.
 *
 * Responsibilities:
 * - Compose Reports sections.
 * - Keep presentation separate from business logic.
 * - No API calls.
 * - No state management.
 * - No hooks.
 */
function Reports() {
  return (
    <section
      className="reports"
      aria-labelledby="reports-title"
    >
      <ReportsHeader />

      <ReportFilters />

      <ReportOverview />

      <ReportTable />

      <ReportPreview />

      <ReportActions />
    </section>
  );
}

export default Reports;


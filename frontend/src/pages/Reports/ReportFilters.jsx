/**
 * ReportFilters
 *
 * Filter controls for Reports.
 * Placeholder-only (no event handlers, no logic).
 */
function ReportFilters() {
  const reportTypes = [
    { value: "", label: "Select report type" },
    { value: "placeholder-1", label: "—" },
  ];

  const regions = [
    { value: "", label: "Select region" },
    { value: "placeholder-1", label: "—" },
  ];

  const indicators = [
    { value: "", label: "Select climate indicator" },
    { value: "placeholder-1", label: "—" },
  ];

  const timePeriods = [
    { value: "", label: "Select time period" },
    { value: "placeholder-1", label: "—" },
  ];

  const exportFormats = [
    { value: "", label: "Select export format" },
    { value: "placeholder-1", label: "—" },
  ];

  const filters = [
    {
      id: "report-type",
      label: "Report Type",
      options: reportTypes,
    },
    {
      id: "report-region",
      label: "Region",
      options: regions,
    },
    {
      id: "climate-indicator",
      label: "Climate Indicator",
      options: indicators,
    },
    {
      id: "time-period",
      label: "Time Period",
      options: timePeriods,
    },
    {
      id: "export-format",
      label: "Export Format",
      options: exportFormats,
    },
  ];

  return (
    <section className="report-filters" aria-label="Report Filters">
      <header className="report-filters__header">
        <h2 className="report-filters__title">Report Filters</h2>
        <p className="report-filters__description">
          Configure report scope and output format. Controls are placeholders
          until backend integration.
        </p>
      </header>

      <form className="report-filters__form" aria-label="Filter reports">
        <div className="report-filters__grid">
          {filters.map((filter) => (
            <div key={filter.id} className="report-filters__field">
              <label
                className="report-filters__label"
                htmlFor={filter.id}
              >
                {filter.label}
              </label>
              <select
                id={filter.id}
                className="report-filters__control"
                aria-label={filter.label}
                defaultValue=""
              >
                {filter.options.map((opt) => (
                  <option key={opt.value || opt.label} value={opt.value} disabled={opt.value === ""}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <div className="report-filters__actions">
          <button
            type="button"
            className="button button--primary"
            aria-label="Generate Report"
          >
            Generate Report
          </button>

          <button
            type="button"
            className="button button--secondary"
            aria-label="Reset"
          >
            Reset
          </button>
        </div>
      </form>
    </section>
  );
}

export default ReportFilters;


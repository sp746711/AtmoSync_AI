/**
 * RiskFilters
 *
 * Reusable filter controls (placeholder only).
 *
 * Note: This component intentionally contains no state, no hooks,
 * and no functionality. It provides semantic markup for future wiring.
 */
function RiskFilters() {
  return (
    <form
      className="risk-filters"
      aria-label="Risk Filters"
      onSubmit={(e) => {
        // Placeholder controls only; prevent navigation.
        e.preventDefault();
      }}
    >
      <div className="risk-filters__grid">
        <div className="risk-filters__field">
          <label className="risk-filters__label" htmlFor="risk-region">
            Region
          </label>
          <select
            id="risk-region"
            className="risk-filters__control"
            aria-label="Region"
            defaultValue=""
          >
            <option value="" disabled>
              Select region
            </option>
            <option value="placeholder-1">—</option>
          </select>
        </div>

        <div className="risk-filters__field">
          <label
            className="risk-filters__label"
            htmlFor="risk-level"
          >
            Risk Level
          </label>
          <select
            id="risk-level"
            className="risk-filters__control"
            aria-label="Risk Level"
            defaultValue=""
          >
            <option value="" disabled>
              Select risk level
            </option>
            <option value="placeholder-1">—</option>
          </select>
        </div>

        <div className="risk-filters__field">
          <label
            className="risk-filters__label"
            htmlFor="risk-period"
          >
            Time Period
          </label>
          <select
            id="risk-period"
            className="risk-filters__control"
            aria-label="Time Period"
            defaultValue=""
          >
            <option value="" disabled>
              Select time period
            </option>
            <option value="placeholder-1">—</option>
          </select>
        </div>

        <div className="risk-filters__field">
          <label
            className="risk-filters__label"
            htmlFor="risk-category"
          >
            Climate Category
          </label>
          <select
            id="risk-category"
            className="risk-filters__control"
            aria-label="Climate Category"
            defaultValue=""
          >
            <option value="" disabled>
              Select category
            </option>
            <option value="placeholder-1">—</option>
          </select>
        </div>
      </div>

      <div className="risk-filters__actions">
        <button
          type="submit"
          className="button button--primary"
          aria-label="Apply Filters"
        >
          Apply Filters
        </button>
        <button
          type="button"
          className="button button--secondary"
          aria-label="Reset Filters"
        >
          Reset
        </button>
      </div>
    </form>
  );
}

export default RiskFilters;


/**
 * RecommendationFilters
 *
 * Reusable filter section for the Recommendations page.
 *
 * Placeholder-only implementation:
 * - No hooks
 * - No state
 * - No effects
 * - No business logic
 * - No API calls
 * - No backend integration
 *
 * Future-ready:
 * - Parent/containers can wire up filter change handling.
 */
function RecommendationFilters() {
  return (
    <section
      className="recommendations-filters"
      aria-labelledby="recommendations-filters-title"
    >
      <h2 id="recommendations-filters-title" className="recommendations-filters__title">
        Filters
      </h2>

      <form className="recommendations-filters__form" action="#" method="get">
        <div className="recommendations-filters__grid">
          <div className="recommendations-filters__field">
            <label className="recommendations-filters__label" htmlFor="recommendations-filter-region">
              Region
            </label>
            <select
              id="recommendations-filter-region"
              className="recommendations-filters__select"
              name="region"
              defaultValue=""
            >
              <option value="">— Select Region —</option>
            </select>
          </div>

          <div className="recommendations-filters__field">
            <label className="recommendations-filters__label" htmlFor="recommendations-filter-type">
              Recommendation Type
            </label>
            <select
              id="recommendations-filter-type"
              className="recommendations-filters__select"
              name="type"
              defaultValue=""
            >
              <option value="">— Select Type —</option>
            </select>
          </div>

          <div className="recommendations-filters__field">
            <label
              className="recommendations-filters__label"
              htmlFor="recommendations-filter-priority"
            >
              Priority
            </label>
            <select
              id="recommendations-filter-priority"
              className="recommendations-filters__select"
              name="priority"
              defaultValue=""
            >
              <option value="">— Select Priority —</option>
            </select>
          </div>

          <div className="recommendations-filters__field">
            <label
              className="recommendations-filters__label"
              htmlFor="recommendations-filter-status"
            >
              Implementation Status
            </label>
            <select
              id="recommendations-filter-status"
              className="recommendations-filters__select"
              name="status"
              defaultValue=""
            >
              <option value="">— Select Status —</option>
            </select>
          </div>

          <div className="recommendations-filters__field recommendations-filters__field--full">
            <label
              className="recommendations-filters__label"
              htmlFor="recommendations-filter-time-period"
            >
              Time Period
            </label>
            <select
              id="recommendations-filter-time-period"
              className="recommendations-filters__select"
              name="timePeriod"
              defaultValue=""
            >
              <option value="">— Select Time Period —</option>
            </select>
          </div>
        </div>

        <div className="recommendations-filters__actions">
          <button
            className="recommendations-filters__button recommendations-filters__button--primary"
            type="submit"
          >
            Apply Filters
          </button>

          <button
            className="recommendations-filters__button"
            type="button"
          >
            Reset
          </button>
        </div>
      </form>
    </section>
  );
}

export default RecommendationFilters;


/**
 * RecommendationTable
 *
 * Recommendations list table.
 *
 * Placeholder-only:
 * - No API calls
 * - No sorting/pagination/filter wiring
 * - No business logic
 *
 * Future-ready:
 * - Parent layers can inject data and enhance with sorting/pagination.
 */
function RecommendationTable() {
  const rows = [
    {
      recommendation: "—",
      category: "—",
      priority: "—",
      status: "—",
      owner: "—",
      lastUpdated: "—",
    },
    {
      recommendation: "—",
      category: "—",
      priority: "—",
      status: "—",
      owner: "—",
      lastUpdated: "—",
    },
    {
      recommendation: "—",
      category: "—",
      priority: "—",
      status: "—",
      owner: "—",
      lastUpdated: "—",
    },
  ];

  return (
    <section
      className="recommendations-table"
      aria-labelledby="recommendations-table-title"
    >
      <header className="recommendations-table__header">
        <h2
          id="recommendations-table-title"
          className="recommendations-table__title"
        >
          Recommendation List
        </h2>

        <p className="recommendations-table__description">
          Review AI-generated climate recommendations and their current
          implementation status.
        </p>
      </header>

      <div className="recommendations-table__wrapper">
        <table className="recommendations-table__table">
          <caption className="recommendations-table__caption">
            Placeholder table for AI-generated climate recommendations.
          </caption>

          <thead>
            <tr>
              <th scope="col" className="recommendations-table__heading">
                Recommendation
              </th>
              <th scope="col" className="recommendations-table__heading">
                Category
              </th>
              <th scope="col" className="recommendations-table__heading">
                Priority
              </th>
              <th scope="col" className="recommendations-table__heading">
                Status
              </th>
              <th scope="col" className="recommendations-table__heading">
                Owner
              </th>
              <th scope="col" className="recommendations-table__heading">
                Last Updated
              </th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row, index) => (
              <tr key={`${row.recommendation}-${index}`}>
                <td className="recommendations-table__cell">
                  {row.recommendation}
                </td>
                <td className="recommendations-table__cell">
                  {row.category}
                </td>
                <td className="recommendations-table__cell">
                  {row.priority}
                </td>
                <td className="recommendations-table__cell">
                  {row.status}
                </td>
                <td className="recommendations-table__cell">
                  {row.owner}
                </td>
                <td className="recommendations-table__cell">
                  {row.lastUpdated}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default RecommendationTable;
/**
 * RiskTable
 *
 * Reusable table layout.
 *
 * Future-ready for:
 * - API data
 * - Pagination
 * - Sorting
 * - Filtering
 * - Row actions
 */
function RiskTable() {
  const rows = [
    {
      id: "placeholder-1",
      region: "—",
      type: "—",
      severity: "—",
      status: "—",
      lastUpdated: "—",
    },
    {
      id: "placeholder-2",
      region: "—",
      type: "—",
      severity: "—",
      status: "—",
      lastUpdated: "—",
    },
    {
      id: "placeholder-3",
      region: "—",
      type: "—",
      severity: "—",
      status: "—",
      lastUpdated: "—",
    },
  ];

  return (
    <section
      className="risk-table"
      aria-labelledby="risk-table-title"
    >
      <h2
        id="risk-table-title"
        className="risk-section-title"
      >
        Risk Details
      </h2>

      <div className="risk-table__container">
        <table
          className="table"
          aria-label="Operational risk list"
        >
          <thead>
            <tr>
              <th scope="col">Region</th>
              <th scope="col">Risk Type</th>
              <th scope="col">Severity</th>
              <th scope="col">Status</th>
              <th scope="col">Last Updated</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.region}</td>
                <td>{row.type}</td>
                <td>{row.severity}</td>
                <td>{row.status}</td>
                <td>{row.lastUpdated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default RiskTable;
/**
 * ActivityHistory
 *
 * Enterprise-ready activity history section for the Profile page.
 *
 * Displays:
 * - Recent account activity
 * - Placeholder values
 *
 * Future-ready for backend integration.
 */

const TABLE_COLUMNS = [
  "Activity",
  "Category",
  "Date",
  "Device",
  "Location",
  "Status",
];

const ACTIVITY_ROWS = [
  {
    id: "activity-1",
    activity: "—",
    category: "—",
    date: "—",
    device: "—",
    location: "—",
    status: "—",
  },
  {
    id: "activity-2",
    activity: "—",
    category: "—",
    date: "—",
    device: "—",
    location: "—",
    status: "—",
  },
  {
    id: "activity-3",
    activity: "—",
    category: "—",
    date: "—",
    device: "—",
    location: "—",
    status: "—",
  },
  {
    id: "activity-4",
    activity: "—",
    category: "—",
    date: "—",
    device: "—",
    location: "—",
    status: "—",
  },
];

function ActivityHistory() {
  return (
    <section
      className="activity-history"
      aria-labelledby="activity-history-title"
    >
      <header className="activity-history__header">
        <h2
          id="activity-history-title"
          className="activity-history__title"
        >
          Activity History
        </h2>

        <p className="activity-history__description">
          Review recent account activities performed within the platform.
        </p>
      </header>

      <div className="activity-history__table-wrapper">
        <table className="activity-history__table">
          <caption className="activity-history__caption">
            Placeholder table for recent account activity.
          </caption>

          <thead className="activity-history__head">
            <tr className="activity-history__head-row">
              {TABLE_COLUMNS.map((column) => (
                <th
                  key={column}
                  scope="col"
                  className="activity-history__heading"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="activity-history__body">
            {ACTIVITY_ROWS.map((row) => (
              <tr
                key={row.id}
                className="activity-history__row"
              >
                <td className="activity-history__cell">
                  {row.activity}
                </td>

                <td className="activity-history__cell">
                  {row.category}
                </td>

                <td className="activity-history__cell">
                  {row.date}
                </td>

                <td className="activity-history__cell">
                  {row.device}
                </td>

                <td className="activity-history__cell">
                  {row.location}
                </td>

                <td
                  className="activity-history__cell"
                  role="status"
                  aria-live="polite"
                >
                  {row.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default ActivityHistory;
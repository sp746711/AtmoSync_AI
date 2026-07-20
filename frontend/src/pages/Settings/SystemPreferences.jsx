/**
 * SystemPreferences
 *
 * Enterprise-ready System Preferences section.
 *
 * Displays:
 * - Current system preferences
 * - Default configuration
 * - Placeholder values
 *
 * Future-ready for backend integration.
 */

const PLACEHOLDER = "—";

const SYSTEM_PREFERENCES_COLUMNS = [
  { id: "preference", label: "Preference" },
  { id: "category", label: "Category" },
  { id: "current-value", label: "Current Value" },
  { id: "default-value", label: "Default Value" },
  { id: "status", label: "Status" },
  { id: "requirements", label: "Requirements" },
];

const SYSTEM_PREFERENCES = [
  {
    id: "system-preference-1",
    preference: PLACEHOLDER,
    category: PLACEHOLDER,
    currentValue: PLACEHOLDER,
    defaultValue: PLACEHOLDER,
    status: PLACEHOLDER,
    requirements: PLACEHOLDER,
  },
  {
    id: "system-preference-2",
    preference: PLACEHOLDER,
    category: PLACEHOLDER,
    currentValue: PLACEHOLDER,
    defaultValue: PLACEHOLDER,
    status: PLACEHOLDER,
    requirements: PLACEHOLDER,
  },
  {
    id: "system-preference-3",
    preference: PLACEHOLDER,
    category: PLACEHOLDER,
    currentValue: PLACEHOLDER,
    defaultValue: PLACEHOLDER,
    status: PLACEHOLDER,
    requirements: PLACEHOLDER,
  },
  {
    id: "system-preference-4",
    preference: PLACEHOLDER,
    category: PLACEHOLDER,
    currentValue: PLACEHOLDER,
    defaultValue: PLACEHOLDER,
    status: PLACEHOLDER,
    requirements: PLACEHOLDER,
  },
];

function SystemPreferences() {
  return (
    <section
      className="system-preferences"
      aria-labelledby="system-preferences-title"
    >
      <header className="system-preferences__header">
        <h2
          id="system-preferences-title"
          className="system-preferences__title"
        >
          System Preferences
        </h2>

        <p className="system-preferences__description">
          Review the current system preferences and default configuration.
        </p>
      </header>

      <div className="system-preferences__table-wrapper">
        <table className="system-preferences__table">
          <caption className="system-preferences__caption">
            Placeholder table for system preferences.
          </caption>

          <thead className="system-preferences__head">
            <tr className="system-preferences__head-row">
              {SYSTEM_PREFERENCES_COLUMNS.map((column) => (
                <th
                  key={column.id}
                  scope="col"
                  className="system-preferences__heading"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="system-preferences__body">
            {SYSTEM_PREFERENCES.map((preference) => (
              <tr
                key={preference.id}
                className="system-preferences__row"
              >
                <td className="system-preferences__cell">
                  {preference.preference}
                </td>

                <td className="system-preferences__cell">
                  {preference.category}
                </td>

                <td className="system-preferences__cell">
                  {preference.currentValue}
                </td>

                <td className="system-preferences__cell">
                  {preference.defaultValue}
                </td>

                <td className="system-preferences__cell">
                  {preference.status}
                </td>

                <td className="system-preferences__cell">
                  {preference.requirements}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default SystemPreferences;
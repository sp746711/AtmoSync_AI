/**
 * GeneralSettings
 *
 * Enterprise-ready General Settings section.
 *
 * Displays:
 * - General application configuration
 * - Placeholder values
 *
 * Future-ready for backend integration.
 */

const PLACEHOLDER = "—";

const GENERAL_SETTINGS = [
  { id: "application-name", label: "Application Name", value: PLACEHOLDER },
  { id: "environment", label: "Environment", value: PLACEHOLDER },
  { id: "version", label: "Version", value: PLACEHOLDER },
  { id: "region", label: "Region", value: PLACEHOLDER },
  { id: "language", label: "Language", value: PLACEHOLDER },
  { id: "time-zone", label: "Time Zone", value: PLACEHOLDER },
  { id: "date-format", label: "Date Format", value: PLACEHOLDER },
  { id: "currency", label: "Currency", value: PLACEHOLDER },
];

function GeneralSettingsField({ label, value }) {
  return (
    <div className="general-settings__field">
      <dt className="general-settings__term">
        {label}
      </dt>

      <dd className="general-settings__value">
        {value}
      </dd>
    </div>
  );
}

function GeneralSettings() {
  return (
    <section
      className="general-settings"
      aria-labelledby="general-settings-title"
    >
      <header className="general-settings__header">
        <h2
          id="general-settings-title"
          className="general-settings__title"
        >
          General Settings
        </h2>

        <p className="general-settings__description">
          Review the general application configuration.
        </p>
      </header>

      <dl className="general-settings__grid">
        {GENERAL_SETTINGS.map((item) => (
          <GeneralSettingsField
            key={item.id}
            label={item.label}
            value={item.value}
          />
        ))}
      </dl>
    </section>
  );
}

export default GeneralSettings;
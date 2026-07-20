/**
 * AppearanceSettings
 *
 * Enterprise-ready Appearance Settings section.
 *
 * Displays:
 * - Current appearance configuration
 * - Placeholder values
 *
 * Future-ready for backend integration.
 */

const PLACEHOLDER = "—";

const APPEARANCE_SETTINGS = [
  { id: "theme", label: "Theme", value: PLACEHOLDER },
  { id: "accent-color", label: "Accent Color", value: PLACEHOLDER },
  { id: "font-size", label: "Font Size", value: PLACEHOLDER },
  { id: "display-density", label: "Display Density", value: PLACEHOLDER },
  { id: "sidebar-mode", label: "Sidebar Mode", value: PLACEHOLDER },
  { id: "dashboard-layout", label: "Dashboard Layout", value: PLACEHOLDER },
];

function AppearanceSettingsField({ label, value }) {
  return (
    <div className="appearance-settings__field">
      <dt className="appearance-settings__term">
        {label}
      </dt>

      <dd className="appearance-settings__value">
        {value}
      </dd>
    </div>
  );
}

function AppearanceSettings() {
  return (
    <section
      className="appearance-settings"
      aria-labelledby="appearance-settings-title"
    >
      <header className="appearance-settings__header">
        <h2
          id="appearance-settings-title"
          className="appearance-settings__title"
        >
          Appearance Settings
        </h2>

        <p className="appearance-settings__description">
          Review the current application appearance configuration.
        </p>
      </header>

      <dl className="appearance-settings__grid">
        {APPEARANCE_SETTINGS.map((item) => (
          <AppearanceSettingsField
            key={item.id}
            label={item.label}
            value={item.value}
          />
        ))}
      </dl>
    </section>
  );
}

export default AppearanceSettings;
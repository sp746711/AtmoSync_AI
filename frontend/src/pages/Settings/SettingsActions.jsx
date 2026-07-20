/**
 * SettingsActions
 *
 * Enterprise-ready Settings Actions section.
 *
 * Displays:
 * - Available settings actions
 * - Disabled action buttons
 *
 * Future-ready for backend integration.
 */

const SETTINGS_ACTIONS = [
  {
    id: "edit-settings",
    title: "Edit Settings",
    description: "Update your application configuration preferences.",
    buttonLabel: "Edit Settings",
  },
  {
    id: "manage-notifications",
    title: "Manage Notifications",
    description: "Review notification preferences configured for your account.",
    buttonLabel: "Manage Notifications",
  },
  {
    id: "reset-preferences",
    title: "Reset Preferences",
    description: "Reset configuration preferences to default values.",
    buttonLabel: "Reset Preferences",
  },
  {
    id: "export-configuration",
    title: "Export Configuration",
    description: "Export configuration details for record keeping.",
    buttonLabel: "Export Configuration",
  },
];

function SettingsActionCard({
  id,
  title,
  description,
  buttonLabel,
}) {
  return (
    <article
      className="settings-actions__card"
      aria-labelledby={`settings-actions-${id}-title`}
    >
      <header className="settings-actions__card-header">
        <h3
          id={`settings-actions-${id}-title`}
          className="settings-actions__card-title"
        >
          {title}
        </h3>

        <p className="settings-actions__card-description">
          {description}
        </p>
      </header>

      <div className="settings-actions__card-actions">
        <button
          type="button"
          className="settings-actions__button"
          disabled
          aria-disabled="true"
        >
          {buttonLabel}
        </button>
      </div>
    </article>
  );
}

function SettingsActions() {
  return (
    <section
      className="settings-actions"
      aria-labelledby="settings-actions-title"
    >
      <header className="settings-actions__header">
        <h2
          id="settings-actions-title"
          className="settings-actions__title"
        >
          Settings Actions
        </h2>

        <p className="settings-actions__description">
          Backend functionality has not been implemented. The following actions
          are currently unavailable.
        </p>
      </header>

      <div className="settings-actions__grid">
        {SETTINGS_ACTIONS.map((action) => (
          <SettingsActionCard
            key={action.id}
            id={action.id}
            title={action.title}
            description={action.description}
            buttonLabel={action.buttonLabel}
          />
        ))}
      </div>
    </section>
  );
}

export default SettingsActions;
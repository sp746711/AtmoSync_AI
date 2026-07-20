/**
 * SettingsHeader
 *
 * Enterprise-ready header for the Settings page.
 *
 * Displays:
 * - Page title
 * - Description
 * - Last Updated placeholder
 *
 * Future-ready for backend integration.
 */

function SettingsHeader({
  title = "Settings",
  description =
    "Review and manage application configuration, preferences, notifications, appearance, and system settings.",
  lastUpdated = "—",
}) {
  return (
    <header
      className="settings-header"
      aria-labelledby="settings-header-title"
    >
      <div className="settings-header__content">
        <h1
          id="settings-header-title"
          className="settings-header__title"
        >
          {title}
        </h1>

        <p className="settings-header__description">
          {description}
        </p>
      </div>

      <div
        className="settings-header__meta"
        role="status"
        aria-live="polite"
      >
        <span className="settings-header__meta-label">
          Last Updated:
        </span>

        <span className="settings-header__meta-value">
          {lastUpdated}
        </span>
      </div>
    </header>
  );
}

export default SettingsHeader;
/**
 * Settings
 *
 * Enterprise-ready Settings page.
 *
 * Composes all Settings page sections.
 *
 * Future-ready for backend integration.
 */

import SettingsHeader from "./SettingsHeader";
import GeneralSettings from "./GeneralSettings";
import NotificationSettings from "./NotificationSettings";
import AppearanceSettings from "./AppearanceSettings";
import SystemPreferences from "./SystemPreferences";
import SettingsActions from "./SettingsActions";

function Settings() {
  return (
    <section
      className="settings"
      aria-labelledby="settings-header-title"
    >
      <div className="settings__container">
        <SettingsHeader />

        <GeneralSettings />

        <NotificationSettings />

        <AppearanceSettings />

        <SystemPreferences />

        <SettingsActions />
      </div>
    </section>
  );
}

export default Settings;
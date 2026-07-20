/**
 * Profile
 *
 * Enterprise-ready Profile page.
 *
 * Composes all Profile page sections.
 *
 * Future-ready for backend integration.
 */

import ProfileHeader from "./ProfileHeader";
import PersonalInformation from "./PersonalInformation";
import AccountInformation from "./AccountInformation";
import SecuritySettings from "./SecuritySettings";
import ActivityHistory from "./ActivityHistory";
import ProfileActions from "./ProfileActions";

function Profile() {
  return (
    <section
      className="profile"
      aria-labelledby="profile-header-title"
    >
      <div className="profile__container">
        <ProfileHeader />

        <PersonalInformation />

        <AccountInformation />

        <SecuritySettings />

        <ActivityHistory />

        <ProfileActions />
      </div>
    </section>
  );
}

export default Profile;
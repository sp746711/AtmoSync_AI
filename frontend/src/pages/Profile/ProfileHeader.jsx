/**
 * ProfileHeader
 *
 * Enterprise-ready header for the Profile page.
 *
 * Displays:
 * - Page title
 * - Description
 * - Last Updated placeholder
 *
 * Future-ready for backend integration.
 */
function ProfileHeader({
  title = "Profile",
  description =
    "Review and manage your profile information, account settings, security preferences, and recent account activity.",
  lastUpdated = "—",
}) {
  return (
    <header
      className="profile-header"
      aria-labelledby="profile-header-title"
    >
      <div className="profile-header__content">
        <h1
          id="profile-header-title"
          className="profile-header__title"
        >
          {title}
        </h1>

        <p className="profile-header__description">
          {description}
        </p>
      </div>

      <div
        className="profile-header__meta"
        role="status"
        aria-live="polite"
      >
        <span className="profile-header__meta-label">
          Last Updated:
        </span>

        <span className="profile-header__meta-value">
          {lastUpdated}
        </span>
      </div>
    </header>
  );
}

export default ProfileHeader;
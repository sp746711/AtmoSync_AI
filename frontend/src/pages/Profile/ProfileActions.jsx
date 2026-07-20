/**
 * ProfileActions
 *
 * Enterprise-ready profile actions section for the Profile page.
 *
 * Displays:
 * - Available profile actions
 * - Disabled buttons until backend integration
 *
 * Future-ready for FastAPI integration.
 */

const ACTION_CARDS = [
  {
    id: "edit-profile",
    title: "Edit Profile",
    description: "Update your profile details and personal settings.",
    buttonLabel: "Edit Profile",
  },
  {
    id: "change-password",
    title: "Change Password",
    description: "Modify your account password using secure verification.",
    buttonLabel: "Change Password",
  },
  {
    id: "manage-security",
    title: "Manage Security",
    description: "Review security preferences and protection mechanisms.",
    buttonLabel: "Manage Security",
  },
  {
    id: "download-profile",
    title: "Download Profile",
    description: "Export your profile information for record keeping.",
    buttonLabel: "Download Profile",
  },
];

function ProfileActionCard({
  id,
  title,
  description,
  buttonLabel,
}) {
  return (
    <article
      className="profile-actions__card"
      aria-labelledby={`profile-actions-${id}-title`}
    >
      <header className="profile-actions__card-header">
        <h3
          id={`profile-actions-${id}-title`}
          className="profile-actions__card-title"
        >
          {title}
        </h3>

        <p className="profile-actions__card-description">
          {description}
        </p>
      </header>

      <div className="profile-actions__card-actions">
        <button
          type="button"
          className="profile-actions__button"
          disabled
          aria-disabled="true"
        >
          {buttonLabel}
        </button>
      </div>
    </article>
  );
}

function ProfileActions() {
  return (
    <section
      className="profile-actions"
      aria-labelledby="profile-actions-title"
    >
      <header className="profile-actions__header">
        <h2
          id="profile-actions-title"
          className="profile-actions__title"
        >
          Profile Actions
        </h2>

        <p className="profile-actions__description">
          Actions are currently disabled because backend functionality has not been implemented.
        </p>
      </header>

      <div className="profile-actions__grid">
        {ACTION_CARDS.map((card) => (
          <ProfileActionCard
            key={card.id}
            id={card.id}
            title={card.title}
            description={card.description}
            buttonLabel={card.buttonLabel}
          />
        ))}
      </div>
    </section>
  );
}

export default ProfileActions;
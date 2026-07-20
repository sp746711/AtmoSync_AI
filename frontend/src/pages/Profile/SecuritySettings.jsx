/**
 * SecuritySettings
 *
 * Enterprise-ready security settings section for the Profile page.
 *
 * Displays:
 * - Security configuration overview
 * - Placeholder values
 *
 * Future-ready for backend integration.
 */

const PLACEHOLDER = "—";

const SECURITY_CARDS = [
  {
    id: "password-status",
    title: "Password Status",
    description: "Current password configuration for this account.",
    status: PLACEHOLDER,
  },
  {
    id: "two-factor-authentication",
    title: "Two-Factor Authentication",
    description: "Extra authentication protection for sign-in.",
    status: PLACEHOLDER,
  },
  {
    id: "recovery-email",
    title: "Recovery Email",
    description: "Email address used to recover account access if needed.",
    status: PLACEHOLDER,
  },
  {
    id: "session-status",
    title: "Session Status",
    description: "Current session configuration and lifecycle policy.",
    status: PLACEHOLDER,
  },
  {
    id: "security-alerts",
    title: "Security Alerts",
    description: "Notifications related to account and security events.",
    status: PLACEHOLDER,
  },
  {
    id: "trusted-devices",
    title: "Trusted Devices",
    description: "Devices recognized for streamlined account access.",
    status: PLACEHOLDER,
  },
];

function SecuritySettingsCard({
  id,
  title,
  description,
  status,
}) {
  return (
    <article
      className="security-settings__card"
      aria-labelledby={`security-settings-${id}-title`}
    >
      <header className="security-settings__card-header">
        <h3
          id={`security-settings-${id}-title`}
          className="security-settings__card-title"
        >
          {title}
        </h3>

        <p className="security-settings__card-description">
          {description}
        </p>
      </header>

      <dl className="security-settings__card-meta">
        <dt className="security-settings__card-meta-label">
          Current Status
        </dt>

        <dd
          className="security-settings__card-meta-value"
          role="status"
          aria-live="polite"
        >
          {status}
        </dd>
      </dl>
    </article>
  );
}

function SecuritySettings() {
  return (
    <section
      className="security-settings"
      aria-labelledby="security-settings-title"
    >
      <header className="security-settings__header">
        <h2
          id="security-settings-title"
          className="security-settings__title"
        >
          Security Settings
        </h2>

        <p className="security-settings__description">
          Review the current security configuration associated with your account.
        </p>
      </header>

      <div className="security-settings__grid">
        {SECURITY_CARDS.map((card) => (
          <SecuritySettingsCard
            key={card.id}
            id={card.id}
            title={card.title}
            description={card.description}
            status={card.status}
          />
        ))}
      </div>
    </section>
  );
}

export default SecuritySettings;
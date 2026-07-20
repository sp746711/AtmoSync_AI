/**
 * NotificationSettings
 *
 * Enterprise-ready Notification Settings section.
 */

const PLACEHOLDER = "—";

const NOTIFICATION_CARDS = [
  {
    id: "email-notifications",
    title: "Email Notifications",
    description: "Review and manage email notification preferences.",
    status: PLACEHOLDER,
    items: [
      "Security alerts",
      "System announcements",
      "Weekly reports",
    ],
  },
  {
    id: "sms-notifications",
    title: "SMS Notifications",
    description: "Review and manage SMS notification preferences.",
    status: PLACEHOLDER,
    items: ["Security alerts", "System announcements"],
  },
  {
    id: "push-notifications",
    title: "Push Notifications",
    description: "Review and manage in-application push notification preferences.",
    status: PLACEHOLDER,
    items: ["Security alerts", "Weekly reports"],
  },
  {
    id: "security-alerts",
    title: "Security Alerts",
    description: "Review and manage security-related notification preferences.",
    status: PLACEHOLDER,
    items: ["Account activity", "Access changes"],
  },
];

function NotificationSettingsCard({ title, description, status, items }) {
  return (
    <article className="notification-settings__card" aria-labelledby={`notification-settings-${title}-title`}>
      <header className="notification-settings__card-header">
        <h3
          id={`notification-settings-${title}-title`}
          className="notification-settings__card-title"
        >
          {title}
        </h3>
        <p className="notification-settings__card-description">{description}</p>
      </header>

      <div className="notification-settings__card-status">
        <dl className="notification-settings__card-meta">
          <div className="notification-settings__card-meta-item">
            <dt className="notification-settings__card-meta-term">Current Status</dt>
            <dd
              className="notification-settings__card-meta-value"
              role="status"
              aria-live="polite"
            >
              {status}
            </dd>
          </div>
        </dl>
      </div>

      <div className="notification-settings__card-items">
        <dl className="notification-settings__card-items-list">
          <dt className="notification-settings__card-items-label">Items</dt>
          <dd className="notification-settings__card-items-value">
            {items.map((item, index) => (
              <span key={`${title}-item-${index}`} className="notification-settings__card-item">
                {item}
              </span>
            ))}
          </dd>
        </dl>
      </div>
    </article>
  );
}

function NotificationSettings() {
  return (
    <section
      className="notification-settings"
      aria-labelledby="notification-settings-title"
    >
      <header className="notification-settings__header">
        <h2
          id="notification-settings-title"
          className="notification-settings__title"
        >
          Notification Settings
        </h2>

        <p className="notification-settings__description">
          Review notification preferences configured for your account.
        </p>
      </header>

      <div className="notification-settings__grid">
        {NOTIFICATION_CARDS.map((card) => (
          <NotificationSettingsCard
            key={card.id}
            title={card.title}
            description={card.description}
            status={card.status}
            items={card.items}
          />
        ))}
      </div>
    </section>
  );
}

export default NotificationSettings;


/**
 * AccountInformation
 *
 * Enterprise-ready account information section for the Profile page.
 *
 * Displays:
 * - Account configuration details
 * - Placeholder values
 *
 * Future-ready for backend integration.
 */

const PLACEHOLDER = "—";

const ACCOUNT_FIELDS = [
  { id: "username", label: "Username", value: PLACEHOLDER },
  { id: "account-status", label: "Account Status", value: PLACEHOLDER },
  { id: "account-type", label: "Account Type", value: PLACEHOLDER },
  { id: "user-role", label: "User Role", value: PLACEHOLDER },
  { id: "created-date", label: "Created Date", value: PLACEHOLDER },
  { id: "last-login", label: "Last Login", value: PLACEHOLDER },
  { id: "preferred-language", label: "Preferred Language", value: PLACEHOLDER },
  { id: "time-zone", label: "Time Zone", value: PLACEHOLDER },
];

function AccountInformationField({ label, value }) {
  return (
    <div className="account-information__item">
      <dt className="account-information__term">
        {label}
      </dt>

      <dd className="account-information__value">
        {value}
      </dd>
    </div>
  );
}

function AccountInformation() {
  return (
    <section
      className="account-information"
      aria-labelledby="account-information-title"
    >
      <header className="account-information__header">
        <h2
          id="account-information-title"
          className="account-information__title"
        >
          Account Information
        </h2>

        <p className="account-information__description">
          Review your account configuration and membership details.
        </p>
      </header>

      <dl className="account-information__grid">
        {ACCOUNT_FIELDS.map((field) => (
          <AccountInformationField
            key={field.id}
            label={field.label}
            value={field.value}
          />
        ))}
      </dl>
    </section>
  );
}

export default AccountInformation;
/**
 * PersonalInformation
 *
 * Enterprise-ready personal information section for the Profile page.
 *
 * Displays:
 * - Personal profile details
 * - Placeholder values
 *
 * Future-ready for backend integration.
 */

const PLACEHOLDER = "—";

const PERSONAL_FIELDS = [
  { id: "full-name", label: "Full Name", value: PLACEHOLDER },
  { id: "email-address", label: "Email Address", value: PLACEHOLDER },
  { id: "phone-number", label: "Phone Number", value: PLACEHOLDER },
  { id: "organization", label: "Organization", value: PLACEHOLDER },
  { id: "department", label: "Department", value: PLACEHOLDER },
  { id: "job-role", label: "Job Role", value: PLACEHOLDER },
  { id: "location", label: "Location", value: PLACEHOLDER },
  { id: "employee-id", label: "Employee ID", value: PLACEHOLDER },
];

function PersonalInformationField({ label, value }) {
  return (
    <div className="personal-information__item">
      <dt className="personal-information__term">
        {label}
      </dt>

      <dd className="personal-information__value">
        {value}
      </dd>
    </div>
  );
}

function PersonalInformation() {
  return (
    <section
      className="personal-information"
      aria-labelledby="personal-information-title"
    >
      <header className="personal-information__header">
        <h2
          id="personal-information-title"
          className="personal-information__title"
        >
          Personal Information
        </h2>

        <p className="personal-information__description">
          Review your personal profile details associated with your account.
        </p>
      </header>

      <dl className="personal-information__grid">
        {PERSONAL_FIELDS.map((field) => (
          <PersonalInformationField
            key={field.id}
            label={field.label}
            value={field.value}
          />
        ))}
      </dl>
    </section>
  );
}

export default PersonalInformation;
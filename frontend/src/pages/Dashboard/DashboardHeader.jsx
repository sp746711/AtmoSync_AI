/**
 * DashboardHeader
 *
 * Displays the main dashboard heading and summary.
 *
 * Responsibilities:
 * - Display dashboard title
 * - Display current date
 * - Display dashboard description
 */
function DashboardHeader() {
  const currentDate = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="dashboard-header" aria-label="Dashboard Header">
      <div className="dashboard-header__content">
        <h1 className="dashboard-header__title">
          AtmoSync AI Dashboard
        </h1>

        <p className="dashboard-header__description">
          Monitor climate intelligence, environmental risks, AI-powered
          recommendations, and operational insights from a unified dashboard.
        </p>

        <div
          className="dashboard-header__meta"
          role="status"
          aria-live="polite"
        >
          <span className="dashboard-header__date">
            {currentDate}
          </span>
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;
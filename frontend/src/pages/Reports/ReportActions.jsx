/**
 * ReportActions
 *
 * Reusable operational action cards for the Reports page.
 */
function ReportActions() {
  const actions = [
    {
      title: "Generate Report",
      description:
        "Create an AI-generated report based on the selected scope and indicator filters.",
      buttonText: "Generate",
    },
    {
      title: "Schedule Report",
      description:
        "Queue report generation on a recurring schedule for continuous monitoring.",
      buttonText: "Schedule",
    },
    {
      title: "Export Reports",
      description:
        "Export generated reports to operational workflows in approved formats.",
      buttonText: "Export",
    },
    {
      title: "Share Report",
      description:
        "Share report access with internal stakeholders and operational teams.",
      buttonText: "Share",
    },
  ];

  return (
    <section
      className="report-actions"
      aria-labelledby="report-actions-title"
    >
      <header className="report-actions__header">
        <h2
          id="report-actions-title"
          className="report-actions__title"
        >
          Operational Actions
        </h2>
      </header>

      <div className="report-actions__grid">
        {actions.map((action) => (
          <article
            key={action.title}
            className="report-actions__card"
          >
            <h3 className="report-actions__card-title">{action.title}</h3>
            <p className="report-actions__card-description">
              {action.description}
            </p>
            <div className="report-actions__card-button-row">
              <button
                type="button"
                className="button button--primary"
                aria-label={action.title}
              >
                {action.buttonText}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default ReportActions;


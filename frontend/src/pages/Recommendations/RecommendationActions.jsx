import {
  FileText,
  Users,
  CalendarDays,
  Download,
} from "lucide-react";

/**
 * RecommendationActions
 *
 * Operational action cards for the Recommendations page.
 *
 * Placeholder-only:
 * - No hooks
 * - No state
 * - No business logic
 * - No backend integration
 *
 * Future-ready:
 * - Buttons can be wired to containers or action handlers.
 */
function RecommendationActions() {
  const actionCards = [
    {
      title: "Generate Report",
      description:
        "Create an AI-generated report from selected recommendations.",
      buttonText: "Generate",
      icon: FileText,
      disabled: false,
    },
    {
      title: "Assign Team",
      description:
        "Assign responsible teams for implementation and review.",
      buttonText: "Assign",
      icon: Users,
      disabled: false,
    },
    {
      title: "Schedule Review",
      description:
        "Schedule periodic review for recommendations in progress.",
      buttonText: "Schedule",
      icon: CalendarDays,
      disabled: false,
    },
    {
      title: "Export Recommendation",
      description:
        "Export recommendation details for operational planning.",
      buttonText: "Export",
      icon: Download,
      disabled: false,
    },
  ];

  return (
    <section
      className="recommendations-actions"
      aria-labelledby="recommendations-actions-title"
    >
      <header className="recommendations-actions__header">
        <h2
          id="recommendations-actions-title"
          className="recommendations-actions__title"
        >
          Operational Actions
        </h2>

        <p className="recommendations-actions__description">
          Perform operational tasks related to AI-generated recommendations.
          Functionality will be available after backend integration.
        </p>
      </header>

      <div className="recommendations-actions__grid">
        {actionCards.map((card) => {
          const Icon = card.icon;

          return (
            <article
              key={card.title}
              className="recommendations-actions__card"
            >
              <div className="recommendations-actions__card-header">
                <Icon
                  className="recommendations-actions__card-icon"
                  size={22}
                  aria-hidden="true"
                />

                <h3 className="recommendations-actions__card-title">
                  {card.title}
                </h3>
              </div>

              <p className="recommendations-actions__card-description">
                {card.description}
              </p>

              <div className="recommendations-actions__card-button-row">
                <button
                  className="button button--primary"
                  type="button"
                  disabled={card.disabled}
                >
                  {card.buttonText}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default RecommendationActions;
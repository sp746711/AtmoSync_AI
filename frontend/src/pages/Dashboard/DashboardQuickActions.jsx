/**
 * ActionCard
 *
 * Reusable dashboard action card.
 *
 * Future-ready for:
 * - Icons
 * - Loading states
 * - Disabled state
 * - Permissions
 * - API integration
 */
function ActionCard({
  title,
  description,
  actionLabel,
  icon = null,
  disabled = false,
  onClick,
}) {
  return (
    <article className="action-card" aria-labelledby={`action-${title}`}>
      <header className="action-card__header">
        <h3
          id={`action-${title}`}
          className="action-card__title"
        >
          {title}
        </h3>

        {icon && (
          <div className="action-card__icon">
            {icon}
          </div>
        )}
      </header>

      {description && (
        <p className="action-card__description">
          {description}
        </p>
      )}

      <button
        type="button"
        className="action-card__button"
        disabled={disabled}
        onClick={onClick}
      >
        {actionLabel}
      </button>
    </article>
  );
}

/**
 * DashboardQuickActions
 *
 * Dashboard quick actions.
 * Buttons are placeholders until backend integration.
 */
function DashboardQuickActions() {
  const actions = [
    {
      title: "Generate Report",
      description: "Create a climate risk assessment report.",
      actionLabel: "Generate",
    },
    {
      title: "Run AI Analysis",
      description: "Execute AI-powered climate analysis.",
      actionLabel: "Run",
    },
    {
      title: "View Risk Map",
      description: "Open the interactive climate risk map.",
      actionLabel: "Open",
    },
    {
      title: "Export Dashboard",
      description: "Export dashboard data and insights.",
      actionLabel: "Export",
    },
  ];

  return (
    <section
      className="dashboard-quick-actions"
      aria-label="Quick Actions"
    >
      <div className="dashboard-quick-actions__grid">
        {actions.map((action) => (
          <ActionCard
            key={action.title}
            title={action.title}
            description={action.description}
            actionLabel={action.actionLabel}
          />
        ))}
      </div>
    </section>
  );
}

export default DashboardQuickActions;
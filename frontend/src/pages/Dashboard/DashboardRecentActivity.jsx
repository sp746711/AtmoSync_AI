/**
 * ActivityPanel
 *
 * Reusable panel for displaying recent activities.
 *
 * Future-ready for:
 * - API integration
 * - Real-time updates
 * - Loading state
 * - Empty state
 * - Activity list
 */
function ActivityPanel({ title, children }) {
  return (
    <article
      className="activity-panel"
      aria-labelledby="recent-activity-title"
    >
      <header className="activity-panel__header">
        <h3
          id="recent-activity-title"
          className="activity-panel__title"
        >
          {title}
        </h3>
      </header>

      <div className="activity-panel__body">
        {children || (
          <div className="activity-panel__empty" role="status">
            Recent activity will appear here after backend integration.
          </div>
        )}
      </div>
    </article>
  );
}

/**
 * DashboardRecentActivity
 *
 * Dashboard section for recent activity.
 */
function DashboardRecentActivity() {
  return (
    <ActivityPanel title="Recent Activity" />
  );
}

export default DashboardRecentActivity;
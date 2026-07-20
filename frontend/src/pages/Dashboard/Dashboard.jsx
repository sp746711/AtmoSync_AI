import DashboardHeader from "./DashboardHeader";
import DashboardStats from "./DashboardStats";
import DashboardCharts from "./DashboardCharts";
import DashboardRecentActivity from "./DashboardRecentActivity";
import DashboardQuickActions from "./DashboardQuickActions";

/**
 * Dashboard
 *
 * Main dashboard page for AtmoSync AI.
 *
 * Responsibilities:
 * - Compose dashboard sections.
 * - Keep presentation separate from business logic.
 * - No API calls.
 * - No state management.
 * - No analytics logic.
 * - Fully reusable and scalable.
 */
function Dashboard() {
  return (
    <section className="dashboard" aria-label="Dashboard">
      <DashboardHeader />

      <DashboardStats />

      <DashboardCharts />

      <section className="dashboard__bottom">
        <DashboardRecentActivity />

        <DashboardQuickActions />
      </section>
    </section>
  );
}

export default Dashboard;
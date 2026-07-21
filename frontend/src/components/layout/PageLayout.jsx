import { useState, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

/**
 * PageLayout - Main application layout with sidebar, navbar, content area, and footer.
 *
 * @param {object} props
 * @param {React.ReactNode} [props.children] - If provided, renders children instead of <Outlet />
 * @param {boolean} [props.showSidebar=true]
 * @param {boolean} [props.showNavbar=true]
 * @param {boolean} [props.showFooter=true]
 * @param {boolean} [props.sidebarCollapsed=false]
 * @param {object} [props.user]
 * @param {function} [props.onLogout]
 * @param {function} [props.onProfile]
 */
function PageLayout({
  children,
  showSidebar = true,
  showNavbar = true,
  showFooter = true,
  sidebarCollapsed: controlledCollapsed,
  user,
  onLogout,
  onProfile,
}) {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const isCollapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;

  const handleToggleSidebar = useCallback(() => {
    setInternalCollapsed((prev) => !prev);
  }, []);

  const handleMobileToggle = useCallback(() => {
    setMobileSidebarOpen((prev) => !prev);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      {/* Sidebar - Desktop */}
      {showSidebar && (
        <div className="hidden lg:flex shrink-0">
          <Sidebar collapsed={isCollapsed} />
        </div>
      )}

      {/* Sidebar - Mobile Overlay */}
      {showSidebar && mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
            aria-hidden="true"
          />
          <div className="relative w-64 max-w-[80vw] h-full">
            <Sidebar mobile onClose={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Navbar */}
        {showNavbar && (
          <Navbar
            onToggleSidebar={handleMobileToggle}
            isSidebarCollapsed={isCollapsed}
            user={user}
            onLogout={onLogout}
            onProfile={onProfile}
          />
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto" role="main">
          <div className="p-4 lg:p-6 xl:p-8">
            {children || <Outlet />}
          </div>
        </main>

        {/* Footer */}
        {showFooter && <Footer />}
      </div>
    </div>
  );
}

export default PageLayout;

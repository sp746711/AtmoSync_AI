import { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import NotificationBell from '../notifications/NotificationBell';
import SearchBox from '../common/SearchBox';

/**
 * Navbar - Top navigation bar.
 *
 * @param {object} props
 * @param {string} [props.logo]
 * @param {string} [props.appName='AtmoSync AI']
 * @param {function} [props.onToggleSidebar]
 * @param {function} [props.onSearch]
 * @param {object} [props.user]
 * @param {function} [props.onLogout]
 * @param {function} [props.onProfile]
 * @param {boolean} [props.isSidebarCollapsed]
 */
function Navbar({
  logo,
  appName = 'AtmoSync AI',
  onToggleSidebar,
  onSearch,
  user,
  onLogout,
  onProfile,
  isSidebarCollapsed,
}) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const location = useLocation();

  const handleClickOutside = useCallback((e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setIsUserMenuOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  // Close menu on route change
  useEffect(() => {
    setIsUserMenuOpen(false);
  }, [location.pathname]);

  const userInitial = user?.name?.charAt(0)?.toUpperCase() || 'U';

  return (
    <header
      className="sticky top-0 z-40 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800"
      role="banner"
    >
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Mobile menu toggle */}
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0" aria-label={`${appName} Home`}>
            {logo ? (
              <img src={logo} alt={appName} className="h-8 w-auto" />
            ) : (
              <div className="h-8 w-8 rounded-lg bg-primary-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
            )}
            <span className="hidden sm:inline text-lg font-bold text-gray-900 dark:text-white">
              {appName}
            </span>
          </Link>
        </div>

        {/* Center - Search */}
        <div className="hidden md:block flex-1 max-w-md mx-4">
          <SearchBox
            placeholder="Search shipments, alerts, reports..."
            onSearch={onSearch}
          />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <NotificationBell />

          {/* User Menu */}
          <div ref={menuRef} className="relative">
            <button
              onClick={() => setIsUserMenuOpen((prev) => !prev)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
              aria-label="User menu"
              aria-expanded={isUserMenuOpen}
              aria-haspopup="true"
            >
              <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                <span className="text-sm font-semibold text-primary-700 dark:text-primary-300">
                  {userInitial}
                </span>
              </div>
              <span className="hidden lg:block text-sm font-medium text-gray-700 dark:text-gray-300">
                {user?.name || 'User'}
              </span>
              <svg
                className={`hidden lg:block w-4 h-4 text-gray-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isUserMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black/5 dark:ring-white/10 border border-gray-200 dark:border-gray-700 py-1 z-50"
                role="menu"
                aria-label="User options"
              >
                {/* User Info */}
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {user?.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user?.email || 'user@atmosync.ai'}
                  </p>
                </div>

                <button
                  onClick={() => { onProfile?.(); setIsUserMenuOpen(false); }}
                  className="w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 flex items-center gap-3 transition-colors"
                  role="menuitem"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profile
                </button>

                <button
                  onClick={() => { onLogout?.(); setIsUserMenuOpen(false); }}
                  className="w-full px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3 transition-colors"
                  role="menuitem"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;

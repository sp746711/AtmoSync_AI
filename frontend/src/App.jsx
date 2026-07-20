import React from 'react';

import AppRoutes from './routes/AppRoutes';

/**
 * App
 * Root application shell.
 *
 * Responsibilities:
 * - Keep this component focused on layout/routing only.
 * - Prepare the app for future Context Providers (see placeholders below).
 * - Do not implement business logic or hardcoded page content.
 */
function App() {
  return (
    <>
      {/**
       * Context Providers placeholder
       *
       * Add future providers here (e.g., <ThemeProvider>, <DashboardProvider>, etc.)
       * without changing routing structure.
       */}

      {/** Render application's routing component */}
      <AppRoutes />
    </>
  );
}

export default App;


import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import AppRoutes from './routes/AppRoutes';

/**
 * App
 * Root application shell.
 *
 * Responsibilities:
 * - Wrap the app with global Context Providers.
 * - Keep this component focused on layout/routing only.
 * - Do not implement business logic or hardcoded page content.
 */
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <AppRoutes />
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;


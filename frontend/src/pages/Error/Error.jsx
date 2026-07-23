import { useNavigate } from "react-router-dom";
import "./Error.css";

/**
 * Error
 *
 * Production-ready application error page.
 *
 * Displays:
 * - Error status heading
 * - User-friendly message explaining the issue
 * - Navigation button back to Dashboard
 *
 * Uses react-router-dom useNavigate for client-side navigation.
 * No API calls, no business logic.
 *
 * This page can be used:
 * - As a fallback by ErrorBoundary component
 * - As a route (`/error`) for intentional error navigation
 */
function Error() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/dashboard", { replace: true });
  };

  return (
    <main className="error" role="alert" aria-labelledby="error-heading">
      <div className="error__container">
        <h1 id="error-heading" className="error__code">
          Error
        </h1>

        <h2 className="error__title">Something Went Wrong</h2>

        <p className="error__message">
          An unexpected error has occurred. Please try again later or return
          to the Dashboard.
        </p>

        <button
          type="button"
          className="error__button"
          onClick={handleGoHome}
        >
          Back to Dashboard
        </button>
      </div>
    </main>
  );
}

export default Error;


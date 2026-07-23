import { useNavigate } from "react-router-dom";
import "./NotFound.css";

/**
 * NotFound
 *
 * Production-ready 404 error page.
 *
 * Displays:
 * - 404 status heading
 * - User-friendly message
 * - Navigation button back to Dashboard
 *
 * Uses react-router-dom useNavigate for client-side navigation.
 * No API calls, no business logic.
 */
function NotFound() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/dashboard", { replace: true });
  };

  return (
    <main className="not-found" role="alert" aria-labelledby="not-found-heading">
      <div className="not-found__container">
        <h1 id="not-found-heading" className="not-found__code">
          404
        </h1>

        <h2 className="not-found__title">Page Not Found</h2>

        <p className="not-found__message">
          The page you are looking for does not exist or has been moved.
          Please check the URL or return to the Dashboard.
        </p>

        <button
          type="button"
          className="not-found__button"
          onClick={handleGoHome}
        >
          Back to Dashboard
        </button>
      </div>
    </main>
  );
}

export default NotFound;


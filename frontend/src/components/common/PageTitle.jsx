import { useEffect } from 'react';
import Breadcrumb from '../layout/Breadcrumb';

/**
 * PageTitle - Page header with title, subtitle, breadcrumbs, and actions.
 *
 * @param {object} props
 * @param {string} props.title
 * @param {string} [props.subtitle]
 * @param {React.ReactNode} [props.actions]
 * @param {Array<{label:string, href?:string}>} [props.breadcrumbs]
 * @param {boolean} [props.borderBottom=true]
 * @param {string} [props.className]
 */
function PageTitle({
  title,
  subtitle,
  actions,
  breadcrumbs,
  borderBottom = true,
  className = '',
}) {
  // Set document title
  useEffect(() => {
    const appName = import.meta.env.VITE_APP_NAME || 'AtmoSync AI';
    document.title = title ? `${title} | ${appName}` : appName;
  }, [title]);

  return (
    <div
      className={`
        ${borderBottom ? 'pb-5 mb-6 border-b border-gray-200 dark:border-gray-700' : ''}
        ${className}
      `}
    >
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumb items={breadcrumbs} className="mb-2" />
      )}

      {/* Title row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {subtitle}
            </p>
          )}
        </div>

        {/* Actions */}
        {actions && (
          <div className="flex items-center gap-3 shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}

export default PageTitle;


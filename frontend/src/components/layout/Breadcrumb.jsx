import { Link } from 'react-router-dom';

/**
 * Breadcrumb - Navigation breadcrumb trail.
 *
 * @param {object} props
 * @param {Array<{label:string, href?:string}>} props.items
 * @param {string} [props.className]
 * @param {React.ReactNode} [props.homeIcon]
 * @param {boolean} [props.showHome=true]
 */
function Breadcrumb({
  items,
  className = '',
  homeIcon,
  showHome = true,
}) {
  if (!items || items.length === 0) return null;

  const allItems = showHome
    ? [{ label: 'Home', href: '/' }, ...items]
    : items;

  return (
    <nav
      aria-label="Breadcrumb"
      className={`${className}`}
    >
      <ol className="flex items-center flex-wrap gap-1" role="list">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1">
              {/* Separator */}
              {index > 0 && (
                <svg
                  className="w-4 h-4 text-gray-400 dark:text-gray-500 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}

              {/* Home icon for first item */}
              {index === 0 && homeIcon && (
                <span className="mr-1 text-gray-400 dark:text-gray-500" aria-hidden="true">
                  {homeIcon}
                </span>
              )}

              {isLast || !item.href ? (
                <span
                  className={`text-sm ${
                    isLast
                      ? 'text-gray-900 dark:text-white font-medium'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.href}
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumb;

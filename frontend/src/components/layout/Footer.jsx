/**
 * Footer - Application footer.
 *
 * @param {object} props
 * @param {string} [props.appName='AtmoSync AI']
 * @param {number} [props.year]
 * @param {Array<{label:string, href:string}>} [props.links]
 * @param {string} [props.version]
 */
function Footer({
  appName = 'AtmoSync AI',
  year = new Date().getFullYear(),
  links,
  version,
}) {
  return (
    <footer
      className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800"
      role="contentinfo"
    >
      <div className="px-6 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {year} {appName}. All rights reserved.
          </p>

          {/* Links */}
          {links && links.length > 0 && (
            <nav className="flex items-center gap-4" aria-label="Footer navigation">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          )}

          {/* Version */}
          {version && (
            <p className="text-xs text-gray-400 dark:text-gray-500">
              v{version}
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}

export default Footer;

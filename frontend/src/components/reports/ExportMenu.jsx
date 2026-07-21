import { useState, useRef, useEffect, useCallback } from 'react';
import Button from '../common/Button';

/**
 * ExportMenu - Dropdown menu for export options.
 *
 * @param {object} props
 * @param {function} [props.onExport]
 * @param {Array<{format:string, label:string, icon?:React.ReactNode}>} [props.formats]
 * @param {boolean} [props.loading=false]
 * @param {string} [props.triggerLabel='Export']
 * @param {'primary'|'secondary'|'outline'} [props.variant='secondary']
 * @param {string} [props.className]
 */
function ExportMenu({
  onExport,
  formats,
  loading = false,
  triggerLabel = 'Export',
  variant = 'secondary',
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const defaultFormats = [
    {
      format: 'pdf',
      label: 'Export as PDF',
      icon: (
        <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 9.5h1v-1H9v1zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm10 5.5h1v-3h-1v3z" />
        </svg>
      ),
    },
    {
      format: 'csv',
      label: 'Export as CSV',
      icon: (
        <svg className="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="currentColor">
          <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 2l5 5h-5V4zM8 13h8v2H8v-2zm0 4h8v2H8v-2zm0-8h3v2H8V9z" />
        </svg>
      ),
    },
    {
      format: 'excel',
      label: 'Export as Excel',
      icon: (
        <svg className="w-4 h-4 text-green-600" viewBox="0 0 24 24" fill="currentColor">
          <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 2l5 5h-5V4zm-2.36 6.33l1.96 2.36-1.96 2.36h-1.11l1.35-1.61-1.35-1.61h1.11zm1.73 0h1.11l1.96 2.36-1.96 2.36h-1.11l1.35-1.61-1.35-1.61zm-5.82 0h1.58l1.14 1.72 1.14-1.72h1.58l-1.81 2.45 1.81 2.45h-1.58l-1.14-1.72-1.14 1.72H8.55l1.81-2.45-1.81-2.45z" />
        </svg>
      ),
    },
  ];

  const exportFormats = formats || defaultFormats;

  const handleClickOutside = useCallback((e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  return (
    <div ref={menuRef} className={`relative inline-block ${className}`}>
      <Button
        variant={variant}
        onClick={() => setIsOpen((prev) => !prev)}
        disabled={loading}
        icon={
          loading ? null : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          )
        }
        ariaLabel="Export options"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {triggerLabel}
      </Button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black/5 dark:ring-white/10 border border-gray-200 dark:border-gray-700 py-1 z-50"
          role="menu"
          aria-label="Export formats"
        >
          {exportFormats.map((option) => (
            <button
              key={option.format}
              onClick={() => {
                onExport?.(option.format);
                setIsOpen(false);
              }}
              className="w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 flex items-center gap-3 transition-colors"
              role="menuitem"
            >
              {option.icon}
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ExportMenu;

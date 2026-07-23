import { useState, useCallback } from 'react';

/**
 * DateFilter - Date range picker filter.
 *
 * @param {object} props
 * @param {Date} [props.startDate]
 * @param {Date} [props.endDate]
 * @param {function} [props.onChange]
 * @param {string} [props.label='Date Range']
 * @param {string} [props.className]
 */
function DateFilter({ startDate, endDate, onChange, label = 'Date Range', className = '' }) {
  const [start, setStart] = useState(startDate || '');
  const [end, setEnd] = useState(endDate || '');

  const handleStartChange = useCallback((e) => {
    const val = e.target.value;
    setStart(val);
    onChange?.({ startDate: val, endDate: end || val });
  }, [end, onChange]);

  const handleEndChange = useCallback((e) => {
    const val = e.target.value;
    setEnd(val);
    onChange?.({ startDate: start || val, endDate: val });
  }, [start, onChange]);

  const handleClear = useCallback(() => {
    setStart('');
    setEnd('');
    onChange?.({ startDate: null, endDate: null });
  }, [onChange]);

  return (
    <div className={className}>
      {label && (
        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">{label}</label>
      )}
      <div className="flex items-center gap-2">
        <input
          type="date"
          value={start}
          onChange={handleStartChange}
          className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          aria-label="Start date"
        />
        <span className="text-gray-400 shrink-0">—</span>
        <input
          type="date"
          value={end}
          onChange={handleEndChange}
          className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          aria-label="End date"
        />
        {(start || end) && (
          <button
            onClick={handleClear}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="Clear date filter"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

export default DateFilter;


import { useState, useCallback } from 'react';

/**
 * SearchFilter - Search input with debounce for filtering.
 *
 * @param {object} props
 * @param {string} [props.value]
 * @param {function} [props.onChange]
 * @param {function} [props.onSearch]
 * @param {string} [props.placeholder='Search...']
 * @param {number} [props.debounceMs=300]
 * @param {string} [props.className]
 */
function SearchFilter({ value, onChange, onSearch, placeholder = 'Search...', debounceMs = 300, className = '' }) {
  const [internal, setInternal] = useState(value || '');
  const [timer, setTimer] = useState(null);

  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internal;

  const handleChange = useCallback((e) => {
    const val = e.target.value;
    if (!isControlled) setInternal(val);
    onChange?.(val, e);

    if (timer) clearTimeout(timer);
    const newTimer = setTimeout(() => {
      onSearch?.(val);
    }, debounceMs);
    setTimer(newTimer);
  }, [isControlled, onChange, onSearch, debounceMs, timer]);

  const handleClear = useCallback(() => {
    if (!isControlled) setInternal('');
    onChange?.('');
    onSearch?.('');
    if (timer) clearTimeout(timer);
  }, [isControlled, onChange, onSearch, timer]);

  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none" aria-hidden="true">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="search"
        value={currentValue}
        onChange={handleChange}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full pl-10 pr-8 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
      />
      {currentValue && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          aria-label="Clear search"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

export default SearchFilter;


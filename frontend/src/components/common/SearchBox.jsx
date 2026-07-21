import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * SearchBox - Accessible search input with debounce.
 *
 * @param {object} props
 * @param {string} [props.value]
 * @param {function} [props.onChange]
 * @param {function} [props.onSearch]
 * @param {string} [props.placeholder='Search...']
 * @param {number} [props.debounceMs=300]
 * @param {boolean} [props.clearable=true]
 * @param {boolean} [props.autoFocus=false]
 * @param {boolean} [props.disabled=false]
 * @param {string} [props.className]
 * @param {string} [props.name]
 * @param {string} [props.ariaLabel='Search']
 */
function SearchBox({
  value: controlledValue,
  onChange,
  onSearch,
  placeholder = 'Search...',
  debounceMs = 300,
  clearable = true,
  autoFocus = false,
  disabled = false,
  className = '',
  name,
  ariaLabel = 'Search',
}) {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState('');
  const inputRef = useRef(null);
  const debounceTimer = useRef(null);

  const currentValue = isControlled ? controlledValue : internalValue;

  const handleChange = useCallback(
    (e) => {
      const newValue = e.target.value;
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onChange?.(newValue, e);

      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = setTimeout(() => {
        onSearch?.(newValue);
      }, debounceMs);
    },
    [isControlled, onChange, onSearch, debounceMs]
  );

  const handleClear = useCallback(() => {
    if (!isControlled) {
      setInternalValue('');
    }
    onChange?.('', { target: { value: '' } });
    onSearch?.('');
    inputRef.current?.focus();
  }, [isControlled, onChange, onSearch]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter') {
        onSearch?.(currentValue);
        if (debounceTimer.current) {
          clearTimeout(debounceTimer.current);
        }
      }
      if (e.key === 'Escape') {
        handleClear();
      }
    },
    [currentValue, onSearch, handleClear]
  );

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      {/* Search Icon */}
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none" aria-hidden="true">
        <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Input */}
      <input
        ref={inputRef}
        type="search"
        name={name}
        value={currentValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoFocus={autoFocus}
        disabled={disabled}
        aria-label={ariaLabel}
        role="searchbox"
        className={`
          w-full pl-10 pr-10 py-2.5 text-sm
          bg-white dark:bg-gray-800
          border border-gray-300 dark:border-gray-600
          rounded-lg
          text-gray-900 dark:text-gray-100
          placeholder-gray-400 dark:placeholder-gray-500
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all duration-200
        `}
      />

      {/* Clear Button */}
      {clearable && currentValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          aria-label="Clear search"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

export default SearchBox;


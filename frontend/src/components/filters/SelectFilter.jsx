import { useCallback } from 'react';

/**
 * SelectFilter - Dropdown select filter.
 *
 * @param {object} props
 * @param {string} [props.value]
 * @param {function} [props.onChange]
 * @param {Array<{value:string, label:string}>} props.options
 * @param {string} [props.label]
 * @param {string} [props.placeholder='All']
 * @param {string} [props.className]
 */
function SelectFilter({ value, onChange, options, label, placeholder = 'All', className = '' }) {
  const handleChange = useCallback((e) => {
    onChange?.(e.target.value);
  }, [onChange]);

  return (
    <div className={className}>
      {label && (
        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">{label}</label>
      )}
      <select
        value={value || ''}
        onChange={handleChange}
        className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        aria-label={label || 'Filter'}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

export default SelectFilter;


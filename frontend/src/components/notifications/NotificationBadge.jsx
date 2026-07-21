/**
 * NotificationBadge - Count badge for notification indicators.
 *
 * @param {object} props
 * @param {number} props.count
 * @param {number} [props.max=99]
 * @param {'sm'|'md'|'lg'} [props.size='md']
 * @param {string} [props.className]
 */
function NotificationBadge({
  count,
  max = 99,
  size = 'md',
  className = '',
}) {
  if (!count || count <= 0) return null;

  const displayCount = count > max ? `${max}+` : count;

  const sizeStyles = {
    sm: 'min-w-[14px] h-3.5 text-[9px] px-1',
    md: 'min-w-[18px] h-4.5 text-[10px] px-1.5',
    lg: 'min-w-[22px] h-5.5 text-xs px-1.5',
  };

  return (
    <span
      className={`
        inline-flex items-center justify-center rounded-full font-bold
        bg-red-500 text-white leading-none
        ${sizeStyles[size] || sizeStyles.md}
        ${className}
      `}
      aria-label={`${count} unread notifications`}
      role="status"
    >
      {displayCount}
    </span>
  );
}

export default NotificationBadge;

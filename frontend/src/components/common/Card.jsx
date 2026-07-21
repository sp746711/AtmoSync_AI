import { forwardRef } from 'react';

const paddingStyles = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
  xl: 'p-8',
};

/**
 * Card - Reusable content container with consistent styling.
 *
 * @param {object} props
 * @param {React.ReactNode} [props.children]
 * @param {string} [props.className]
 * @param {'none'|'sm'|'md'|'lg'|'xl'} [props.padding='md']
 * @param {boolean} [props.hoverable=false]
 * @param {boolean} [props.bordered=false]
 * @param {boolean} [props.compact=false]
 * @param {string} [props.ariaLabel]
 * @param {function} [props.onClick]
 */
const Card = forwardRef(
  (
    {
      children,
      className = '',
      padding = 'md',
      hoverable = false,
      bordered = false,
      compact = false,
      ariaLabel,
      onClick,
      ...props
    },
    ref
  ) => {
    const Component = onClick ? 'button' : 'div';

    return (
      <Component
        ref={ref}
        className={`
          bg-white dark:bg-gray-800 rounded-xl shadow-sm
          ${bordered ? 'border border-gray-200 dark:border-gray-700' : 'border border-transparent'}
          ${hoverable ? 'hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 transition-shadow duration-200 cursor-pointer' : ''}
          ${onClick ? 'text-left w-full focus:outline-none focus:ring-2 focus:ring-primary-500' : ''}
          ${paddingStyles[padding] || paddingStyles.md}
          ${compact ? 'space-y-2' : 'space-y-4'}
          ${className}
        `}
        aria-label={ariaLabel}
        onClick={onClick}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Card.displayName = 'Card';

/**
 * Card.Header - Title section of a card.
 */
Card.Header = function CardHeader({ title, subtitle, action, className = '' }) {
  return (
    <div className={`flex items-start justify-between gap-4 ${className}`}>
      <div className="min-w-0 flex-1">
        {title && (
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
            {title}
          </h3>
        )}
        {subtitle && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};

Card.Body = function CardBody({ children, className = '' }) {
  return <div className={`text-gray-700 dark:text-gray-300 ${className}`}>{children}</div>;
};

Card.Footer = function CardFooter({ children, className = '' }) {
  return (
    <div
      className={`flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700 ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;


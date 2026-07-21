import Modal from './Modal';
import Button from './Button';

/**
 * ConfirmDialog - Standalone confirmation dialog.
 *
 * @param {object} props
 * @param {boolean} props.isOpen
 * @param {function} props.onClose
 * @param {function} props.onConfirm
 * @param {string} [props.title='Confirm Action']
 * @param {string} [props.message='Are you sure you want to proceed?']
 * @param {string} [props.confirmText='Confirm']
 * @param {string} [props.cancelText='Cancel']
 * @param {'primary'|'danger'|'warning'|'success'} [props.variant='primary']
 * @param {boolean} [props.loading=false]
 * @param {boolean} [props.destructive=false]
 * @param {React.ReactNode} [props.icon]
 * @param {string} [props.className]
 */
function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'primary',
  loading = false,
  destructive = false,
  icon,
  className = '',
}) {
  const actualVariant = destructive ? 'danger' : variant;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      showCloseButton={false}
    >
      <div className={`flex flex-col items-center text-center ${className}`}>
        {/* Icon */}
        {icon ? (
          <div className="mb-4">{icon}</div>
        ) : destructive ? (
          <div className="mb-4 p-3 rounded-full bg-red-100 dark:bg-red-900/30" aria-hidden="true">
            <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        ) : (
          <div className="mb-4 p-3 rounded-full bg-primary-100 dark:bg-primary-900/30" aria-hidden="true">
            <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        )}

        {/* Message */}
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{message}</p>

        {/* Actions */}
        <div className="flex justify-center gap-3 mt-6 w-full">
          <Button variant="secondary" onClick={onClose} disabled={loading} className="flex-1 sm:flex-none">
            {cancelText}
          </Button>
          <Button
            variant={actualVariant}
            onClick={onConfirm}
            loading={loading}
            disabled={loading}
            className="flex-1 sm:flex-none"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmDialog;


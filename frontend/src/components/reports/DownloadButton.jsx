import { useState } from 'react';
import Button from '../common/Button';

/**
 * DownloadButton - Download action button with loading state.
 *
 * @param {object} props
 * @param {function} props.onDownload
 * @param {string} [props.label='Download']
 * @param {boolean} [props.loading=false]
 * @param {string} [props.fileName]
 * @param {string} [props.fileFormat]
 * @param {boolean} [props.disabled=false]
 * @param {'primary'|'secondary'|'outline'|'ghost'} [props.variant='primary']
 * @param {'sm'|'md'|'lg'} [props.size='md']
 * @param {string} [props.className]
 */
function DownloadButton({
  onDownload,
  label = 'Download',
  loading = false,
  fileName,
  fileFormat,
  disabled = false,
  variant = 'primary',
  size = 'md',
  className = '',
}) {
  const [downloadState, setDownloadState] = useState('idle'); // idle | loading | success | error

  const handleClick = async () => {
    if (downloadState === 'loading') return;

    setDownloadState('loading');
    try {
      await onDownload?.({ fileName, format: fileFormat });
      setDownloadState('success');
      setTimeout(() => setDownloadState('idle'), 2000);
    } catch {
      setDownloadState('error');
      setTimeout(() => setDownloadState('idle'), 3000);
    }
  };

  const stateStyles = {
    idle: {
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      label,
    },
    success: {
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      label: 'Downloaded!',
    },
    loading: {
      icon: null,
      label: 'Downloading...',
    },
    error: {
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
      label: 'Download failed',
    },
  };

  const current = stateStyles[downloadState];

  return (
    <Button
      variant={downloadState === 'error' ? 'danger' : downloadState === 'success' ? 'success' : variant}
      size={size}
      onClick={handleClick}
      loading={downloadState === 'loading'}
      disabled={disabled || downloadState === 'loading'}
      icon={current.icon}
      className={className}
      ariaLabel={label}
    >
      {current.label}
    </Button>
  );
}

export default DownloadButton;

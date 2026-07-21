/**
 * Export service.
 *
 * Provides API methods for exporting data in PDF, Excel,
 * and CSV formats, along with a file download helper.
 */

import api from './api';

// ─── Export PDF ────────────────────────────────────────────────────────────

/**
 * Generate and retrieve a PDF export.
 *
 * @param {object}   data                  - Export payload
 * @param {string}   data.type             - Report or data type
 * @param {object[]} data.records          - Data records to export
 * @param {string[]} [data.columns]        - Columns to include
 * @param {string}   [data.title]          - Document title
 * @returns {Promise<Blob>} PDF file blob
 */
export async function exportPDF(data) {
  const response = await api.post('/export/pdf', data, {
    responseType: 'blob',
  });
  return response.data;
}

// ─── Export Excel ──────────────────────────────────────────────────────────

/**
 * Generate and retrieve an Excel (XLSX) export.
 *
 * @param {object}   data                  - Export payload
 * @param {string}   data.type             - Report or data type
 * @param {object[]} data.records          - Data records to export
 * @param {string[]} [data.columns]        - Columns to include
 * @param {string}   [data.sheetName]      - Excel sheet name
 * @returns {Promise<Blob>} Excel file blob
 */
export async function exportExcel(data) {
  const response = await api.post('/export/excel', data, {
    responseType: 'blob',
  });
  return response.data;
}

// ─── Export CSV ────────────────────────────────────────────────────────────

/**
 * Generate and retrieve a CSV export.
 *
 * @param {object}   data                  - Export payload
 * @param {string}   data.type             - Report or data type
 * @param {object[]} data.records          - Data records to export
 * @param {string[]} [data.columns]        - Columns to include
 * @returns {Promise<Blob>} CSV file blob
 */
export async function exportCSV(data) {
  const response = await api.post('/export/csv', data, {
    responseType: 'blob',
  });
  return response.data;
}

// ─── Download Exported File ────────────────────────────────────────────────

/**
 * Trigger a browser download of a blob with the given filename.
 *
 * Creates a temporary anchor element and programmatically clicks it
 * to initiate the download, then cleans up.
 *
 * @param {Blob}   blob     - File blob to download
 * @param {string} filename - Desired filename including extension
 * @returns {void}
 */
export function downloadExportedFile(blob, filename) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();

  // Clean up after a short delay to ensure the download starts
  setTimeout(() => {
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }, 150);
}


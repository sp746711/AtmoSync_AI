/**
 * ReportPreview
 *
 * Placeholder report preview panel.
 */
function ReportPreview() {
  const preview = {
    title: "—",
    description: "Preview description placeholder for the selected report.",
    metadata: [
      { label: "Type", value: "—" },
      { label: "Region", value: "—" },
      { label: "Generated Date", value: "—" },
      { label: "Format", value: "—" },
      { label: "Status", value: "—" },
    ],
    summary: "—",
  };

  return (
    <section
      className="report-preview"
      aria-labelledby="report-preview-title"
    >
      <header className="report-preview__header">
        <h2
          id="report-preview-title"
          className="report-preview__title"
        >
          Report Preview
        </h2>
      </header>

      <div className="report-preview__panel" aria-label="Report preview panel">
        <h3 className="report-preview__report-title">{preview.title}</h3>
        <p className="report-preview__description">{preview.description}</p>

        <div className="report-preview__metadata" aria-label="Report metadata">
          {preview.metadata.map((item) => (
            <div key={item.label} className="report-preview__meta-row">
              <span className="report-preview__meta-label">{item.label}</span>
              <span className="report-preview__meta-value">{item.value}</span>
            </div>
          ))}
        </div>

        <div className="report-preview__summary" aria-label="Report summary">
          <p className="report-preview__summary-label">Summary</p>
          <p className="report-preview__summary-text">{preview.summary}</p>
        </div>

        <div className="report-preview__actions">
          <button
            type="button"
            className="button button--primary"
            aria-label="Preview"
          >
            Preview
          </button>

          <button
            type="button"
            className="button button--secondary"
            aria-label="Download"
          >
            Download
          </button>
        </div>
      </div>
    </section>
  );
}

export default ReportPreview;


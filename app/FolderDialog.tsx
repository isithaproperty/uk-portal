"use client";

type Props = {
  building: string;
  heading: string;
  folder: string;
  status: "Compliant" | "Attention required";
  filename?: string;
  onUpload: (file?: File) => void;
  onClose: () => void;
};

export default function FolderDialog({ building, heading, folder, status, filename, onUpload, onClose }: Props) {
  return (
    <div className="folder-dialog-backdrop" onClick={onClose}>
      <section className="folder-dialog" role="dialog" aria-modal="true" aria-labelledby="folder-dialog-title" onClick={event => event.stopPropagation()}>
        <header>
          <div>
            <p className="eyebrow">{building} · {heading}</p>
            <h2 id="folder-dialog-title">{folder}</h2>
          </div>
          <button className="folder-dialog-close" onClick={onClose} aria-label="Close folder">×</button>
        </header>
        <div className={`folder-dialog-status ${status === "Compliant" ? "compliant" : "attention"}`}>
          <i />
          <div><span>Current folder status</span><strong>{status}</strong></div>
        </div>
        <div className="folder-dialog-documents">
          <h3>Documents</h3>
          {filename ? (
            <div className="folder-document-row"><span>▤</span><div><strong>{filename}</strong><small>Selected for upload</small></div></div>
          ) : (
            <div className="folder-dialog-empty"><span>▰</span><strong>No documents in this folder yet</strong><small>Upload the first controlled record for this building.</small></div>
          )}
        </div>
        <footer>
          <label className="primary">↑ Upload documents<input hidden type="file" multiple onChange={event => onUpload(event.target.files?.[0])} /></label>
          <button className="outline" onClick={onClose}>Close</button>
        </footer>
      </section>
    </div>
  );
}

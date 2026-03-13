import { useState, useEffect, useRef } from 'react';
import { MOCK_RA_GAMES, type SavedFolder } from './libraryModalTypes';

interface Props {
  onClose: () => void;
  folders: SavedFolder[];
  onScanComplete: () => void;
}

export default function ScanAllModal({ onClose, folders, onScanComplete }: Props) {
  const [confirmed, setConfirmed] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logs]);

  const handleConfirm = async () => {
    setConfirmed(true);
    setScanning(true);
    setLogs([]);

    for (const folder of folders) {
      setLogs((prev) => [...prev, `📁 Scanning folder: ${folder.path}`]);
      await new Promise((res) => setTimeout(res, 600));

      const files = Object.keys(MOCK_RA_GAMES).slice(0, 3 + Math.floor(Math.random() * 4));
      for (const file of files) {
        const match = MOCK_RA_GAMES[file.toLowerCase()];
        await new Promise((res) => setTimeout(res, 250 + Math.random() * 300));
        setLogs((prev) => [
          ...prev,
          match
            ? `   ✅ ${file} → ${match.title} (${match.console})`
            : `   ⬜ ${file} — not recognised`,
        ]);
      }
      setLogs((prev) => [...prev, `   Done — ${files.length} files checked.`]);
    }

    setLogs((prev) => [...prev, '', '✔ Scan complete.']);
    setScanning(false);
    setDone(true);
    onScanComplete();
  };

  if (!confirmed) {
    return (
      <div className="lib-modal-backdrop" onClick={onClose}>
        <div className="lib-modal lib-modal--sm" onClick={(e) => e.stopPropagation()}>
          <div className="lib-modal-header">
            <h2>Scan All Folders</h2>
            <button type="button" className="lib-modal-close" onClick={onClose}>✕</button>
          </div>
          <div className="lib-modal-content">
            {folders.length === 0 ? (
              <div className="lib-empty-state">
                <span className="lib-empty-icon">📂</span>
                <p>
                  No folders to scan. Add folders first via <strong>Add Folder</strong>.
                </p>
              </div>
            ) : (
              <>
                <p className="lib-modal-desc">
                  This will re-scan{' '}
                  <strong>
                    {folders.length} folder{folders.length !== 1 ? 's' : ''}
                  </strong>{' '}
                  for new or changed ROMs. Are you sure?
                </p>
                <div className="lib-confirm-folders">
                  {folders.map((f) => (
                    <div key={f.path} className="lib-confirm-folder-row">
                      📁 {f.path}{' '}
                      <span className="lib-folder-meta">({f.gameCount} games)</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
          <div className="lib-modal-footer">
            <button type="button" className="lib-btn-secondary" onClick={onClose}>
              Cancel
            </button>
            {folders.length > 0 && (
              <button type="button" className="lib-action-btn" onClick={handleConfirm}>
                Yes, Scan All
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="lib-modal-backdrop" onClick={scanning ? undefined : onClose}>
      <div className="lib-modal lib-modal--md" onClick={(e) => e.stopPropagation()}>
        <div className="lib-modal-header">
          <h2>Scanning All Folders</h2>
          {!scanning && (
            <button type="button" className="lib-modal-close" onClick={onClose}>✕</button>
          )}
        </div>
        <div className="lib-modal-content">
          {scanning && (
            <div className="lib-progress-bar-container">
              <div className="lib-progress-bar-fill lib-progress-bar-indeterminate" />
            </div>
          )}
          <div className="lib-scan-log" ref={logRef}>
            {logs.map((line, i) => (
              <div key={i} className="lib-scan-log-line">{line}</div>
            ))}
            {scanning && (
              <div className="lib-scan-log-line lib-scanning-dot">Scanning...</div>
            )}
          </div>
          {done && (
            <div className="lib-done-msg">All folders have been scanned successfully.</div>
          )}
        </div>
        <div className="lib-modal-footer">
          <button
            type="button"
            className="lib-btn-secondary"
            disabled={scanning}
            onClick={onClose}
          >
            {done ? 'Close' : 'Cancel'}
          </button>
        </div>
      </div>
    </div>
  );
}

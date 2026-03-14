import { useState, useEffect, useRef } from 'react';
import { API_BASE_URL, getAccessToken } from '../../helpers/apiClient';
import type { SavedFolder, ScanProgress } from './libraryModalTypes';

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

  // Listen for progress events while scanning
  useEffect(() => {
    if (!scanning) return;
    const unsub = window.electron.scanner.onProgress((raw) => {
      const p = raw as ScanProgress;
      if (p.fileName && p.matched) {
        setLogs((prev) => [
          ...prev,
          `   ✅ ${p.fileName} → ${p.title} (${p.consoleName})`,
        ]);
      } else if (p.phase === 'hashing' && p.fileName) {
        setLogs((prev) => [...prev, `   Hashing ${p.fileName}... (${p.current}/${p.total})`]);
      }
    });
    return () => { unsub(); };
  }, [scanning]);

  const handleConfirm = async () => {
    const token = getAccessToken();
    if (!token) return;

    setConfirmed(true);
    setScanning(true);
    setLogs([]);

    for (const folder of folders) {
      setLogs((prev) => [...prev, `📁 Scanning folder: ${folder.path}`]);

      const { matched, total } = await window.electron.scanner.scanFolder(
        folder.path,
        folder.consoleId,
        API_BASE_URL,
        token,
      );

      setLogs((prev) => [
        ...prev,
        `   Done — ${total} files checked, ${matched} game${matched !== 1 ? 's' : ''} matched.`,
      ]);
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
                    <div key={`${f.path}::${f.consoleId}`} className="lib-confirm-folder-row">
                      📁 {f.path}{' '}
                      <span className="lib-folder-meta">({f.consoleName} · {f.gameCount} games)</span>
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

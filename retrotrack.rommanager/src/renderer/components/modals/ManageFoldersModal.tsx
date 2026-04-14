import { useState, useEffect } from 'react';
import { API_BASE_URL, getAccessToken } from '../../helpers/apiClient';
import ScanProgress from './ScanProgress';
import type { SavedFolder, ScanProgress as ScanProgressType, ScanResult } from './libraryModalTypes';

interface Props {
  onClose: () => void;
  folders: SavedFolder[];
  onRemoveFolder: (path: string, consoleId: number) => void;
  onRescanFolder: (path: string, consoleId: number, matched: number) => void;
}

interface ConfirmRemove {
  path: string;
  consoleId: number;
  consoleName: string;
  gameCount: number;
}

export default function ManageFoldersModal({
  onClose,
  folders,
  onRemoveFolder,
  onRescanFolder,
}: Props) {
  const [rescanningKey, setRescanningKey] = useState<string | null>(null);
  const [scanProgress, setScanProgress] = useState({ current: 0, total: 0 });
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [confirmRemove, setConfirmRemove] = useState<ConfirmRemove | null>(null);

  useEffect(() => {
    if (!rescanningKey) return;
    const unsub = window.electron.scanner.onProgress((raw) => {
      const p = raw as ScanProgressType;
      if (p.warning) {
        setScanResults((prev) => [
          ...prev,
          { fileName: `\u26a0\ufe0f ${p.warning}`, matched: false },
        ]);
      } else if (p.phase === 'converting' && p.fileName) {
        const label = p.cached
          ? `\u26a1 ${p.fileName} (cached)`
          : `\ud83d\udd04 Converting ${p.fileName} to ISO...`;
        setScanResults((prev) => [...prev, { fileName: label, matched: false }]);
        setScanProgress({ current: p.current, total: p.total });
      } else {
        setScanProgress({ current: p.current, total: p.total });
        if (p.fileName) {
          setScanResults((prev) => [
            ...prev,
            {
              fileName: p.fileName!,
              matched: !!p.matched,
              consoleName: p.consoleName,
              title: p.title,
            },
          ]);
        }
      }
    });
    return () => { unsub(); };
  }, [rescanningKey]);

  const handleRescan = async (folderPath: string, consoleId: number) => {
    const token = getAccessToken();
    if (!token) return;

    const key = `${folderPath}::${consoleId}`;
    setRescanningKey(key);
    setScanProgress({ current: 0, total: 0 });
    setScanResults([]);
    const { matched } = await window.electron.scanner.scanFolder(
      folderPath,
      consoleId,
      API_BASE_URL,
      token,
    );
    onRescanFolder(folderPath, consoleId, matched);
    setRescanningKey(null);
  };

  const handleConfirmRemove = () => {
    if (!confirmRemove) return;
    onRemoveFolder(confirmRemove.path, confirmRemove.consoleId);
    setConfirmRemove(null);
  };

  return (
    <div className="lib-modal-backdrop" onClick={confirmRemove ? undefined : onClose}>
      <div className="lib-modal lib-modal--md" onClick={(e) => e.stopPropagation()}>
        <div className="lib-modal-header">
          <h2>Manage Folders</h2>
          <button type="button" className="lib-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="lib-modal-content">
          {confirmRemove ? (
            <div className="lib-empty-state">
              <span className="lib-empty-icon">⚠️</span>
              <p>
                Are you sure you want to remove <strong>{confirmRemove.path}</strong>?
                <br />
                This will remove all {confirmRemove.gameCount} <strong>{confirmRemove.consoleName}</strong> game{confirmRemove.gameCount !== 1 ? 's' : ''} from this folder from your library.
              </p>
              <div className="lib-folder-actions" style={{ justifyContent: 'center', marginTop: '1rem' }}>
                <button type="button" className="lib-btn-danger" onClick={handleConfirmRemove}>
                  Yes, Remove
                </button>
                <button type="button" className="lib-btn-secondary" onClick={() => setConfirmRemove(null)}>
                  Cancel
                </button>
              </div>
            </div>
          ) : folders.length === 0 ? (
            <div className="lib-empty-state">
              <span className="lib-empty-icon">📂</span>
              <p>
                No folders added yet. Use <strong>Add Folder</strong> to get started.
              </p>
            </div>
          ) : (
            <div className="lib-folder-list">
              {folders.map((f) => {
                const key = `${f.path}::${f.consoleId}`;
                const isRescanning = rescanningKey === key;
                return (
                  <div key={key} className="lib-folder-item">
                    <div className="lib-folder-info">
                      <span className="lib-folder-path">📁 {f.path}</span>
                      <span className="lib-folder-meta">
                        {f.consoleName} · {f.gameCount} game{f.gameCount !== 1 ? 's' : ''} · Added {f.addedAt}
                      </span>
                    </div>
                    <div className="lib-folder-actions">
                      <button
                        type="button"
                        className="lib-btn-secondary"
                        disabled={rescanningKey !== null}
                        onClick={() => handleRescan(f.path, f.consoleId)}
                      >
                        {isRescanning ? 'Rescanning...' : '🔄 Re-scan'}
                      </button>
                      <button
                        type="button"
                        className="lib-btn-danger"
                        disabled={rescanningKey !== null}
                        onClick={() => setConfirmRemove({ path: f.path, consoleId: f.consoleId, consoleName: f.consoleName, gameCount: f.gameCount })}
                      >
                        🗑️ Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {rescanningKey && (
            <ScanProgress
              scanning={true}
              results={scanResults}
              progress={scanProgress}
            />
          )}
        </div>
        <div className="lib-modal-footer">
          <button type="button" className="lib-btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { API_BASE_URL, getAccessToken } from '../../helpers/apiClient';
import type { SavedFolder } from './libraryModalTypes';

interface Props {
  onClose: () => void;
  folders: SavedFolder[];
  onRemoveFolder: (path: string, consoleId: number) => void;
  onRescanFolder: (path: string, consoleId: number, matched: number) => void;
}

export default function ManageFoldersModal({
  onClose,
  folders,
  onRemoveFolder,
  onRescanFolder,
}: Props) {
  const [rescanningKey, setRescanningKey] = useState<string | null>(null);

  const handleRescan = async (folderPath: string, consoleId: number) => {
    const token = getAccessToken();
    if (!token) return;

    const key = `${folderPath}::${consoleId}`;
    setRescanningKey(key);
    const { matched } = await window.electron.scanner.scanFolder(
      folderPath,
      consoleId,
      API_BASE_URL,
      token,
    );
    onRescanFolder(folderPath, consoleId, matched);
    setRescanningKey(null);
  };

  return (
    <div className="lib-modal-backdrop" onClick={onClose}>
      <div className="lib-modal lib-modal--md" onClick={(e) => e.stopPropagation()}>
        <div className="lib-modal-header">
          <h2>Manage Folders</h2>
          <button type="button" className="lib-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="lib-modal-content">
          {folders.length === 0 ? (
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
                        disabled={rescanningKey === key}
                        onClick={() => handleRescan(f.path, f.consoleId)}
                      >
                        {rescanningKey === key ? 'Scanning...' : '🔄 Re-scan'}
                      </button>
                      <button
                        type="button"
                        className="lib-btn-danger"
                        disabled={rescanningKey !== null}
                        onClick={() => onRemoveFolder(f.path, f.consoleId)}
                      >
                        🗑️ Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className="lib-modal-footer">
          <button type="button" className="lib-btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

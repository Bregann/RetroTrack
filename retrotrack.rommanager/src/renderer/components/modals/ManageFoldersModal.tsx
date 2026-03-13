import { useState } from 'react';
import type { SavedFolder } from './libraryModalTypes';

interface Props {
  onClose: () => void;
  folders: SavedFolder[];
  onRemoveFolder: (path: string) => void;
  onRescanFolder: (path: string) => void;
}

export default function ManageFoldersModal({
  onClose,
  folders,
  onRemoveFolder,
  onRescanFolder,
}: Props) {
  const [rescanningPath, setRescanningPath] = useState<string | null>(null);

  const handleRescan = async (path: string) => {
    setRescanningPath(path);
    await new Promise((res) => setTimeout(res, 1500 + Math.random() * 1000));
    onRescanFolder(path);
    setRescanningPath(null);
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
              {folders.map((f) => (
                <div key={f.path} className="lib-folder-item">
                  <div className="lib-folder-info">
                    <span className="lib-folder-path">📁 {f.path}</span>
                    <span className="lib-folder-meta">
                      {f.gameCount} game{f.gameCount !== 1 ? 's' : ''} · Added {f.addedAt}
                    </span>
                  </div>
                  <div className="lib-folder-actions">
                    <button
                      type="button"
                      className="lib-btn-secondary"
                      disabled={rescanningPath === f.path}
                      onClick={() => handleRescan(f.path)}
                    >
                      {rescanningPath === f.path ? 'Scanning...' : '🔄 Re-scan'}
                    </button>
                    <button
                      type="button"
                      className="lib-btn-danger"
                      disabled={rescanningPath !== null}
                      onClick={() => onRemoveFolder(f.path)}
                    >
                      🗑️ Remove
                    </button>
                  </div>
                </div>
              ))}
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

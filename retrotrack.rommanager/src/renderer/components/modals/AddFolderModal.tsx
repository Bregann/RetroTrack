import { useState, useEffect, useRef } from 'react';
import { simulateFolderScan, type SavedFolder, type ScanResult } from './libraryModalTypes';

interface Props {
  onClose: () => void;
  onFolderAdded: (folder: SavedFolder) => void;
}

export default function AddFolderModal({ onClose, onFolderAdded }: Props) {
  const [folderPath, setFolderPath] = useState('');
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState<ScanResult[]>([]);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [done, setDone] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [results]);

  const handleBrowse = () => {
    setFolderPath('C:\\ROMs\\RetroCollection');
    setResults([]);
    setDone(false);
  };

  const handleScan = async () => {
    if (!folderPath) return;
    setScanning(true);
    setResults([]);
    setDone(false);

    const allResults = await simulateFolderScan((result, idx, total) => {
      setProgress({ current: idx + 1, total });
      setResults((prev) => [...prev, result]);
    });

    setScanning(false);
    setDone(true);

    const matched = allResults.filter((r) => r.matched).length;
    onFolderAdded({
      path: folderPath,
      addedAt: new Date().toLocaleDateString(),
      gameCount: matched,
    });
  };

  const matchedCount = results.filter((r) => r.matched).length;

  return (
    <div className="lib-modal-backdrop" onClick={onClose}>
      <div className="lib-modal lib-modal--md" onClick={(e) => e.stopPropagation()}>
        <div className="lib-modal-header">
          <h2>Add Folder</h2>
          <button type="button" className="lib-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="lib-modal-content">
          <p className="lib-modal-desc">
            Select a folder to scan for ROMs. The folder will be saved so it can be re-scanned later.
          </p>
          <div className="lib-path-row">
            <input
              type="text"
              className="lib-input"
              placeholder="Path to folder..."
              value={folderPath}
              onChange={(e) => { setFolderPath(e.target.value); setResults([]); setDone(false); }}
            />
            <button type="button" className="lib-browse-btn" onClick={handleBrowse}>
              Browse
            </button>
          </div>
          <button
            type="button"
            className="lib-action-btn"
            disabled={!folderPath || scanning}
            onClick={handleScan}
          >
            {scanning ? 'Scanning...' : 'Scan Folder'}
          </button>

          {(scanning || results.length > 0) && (
            <>
              <div className="lib-progress-bar-container">
                <div
                  className="lib-progress-bar-fill"
                  style={{
                    width: progress.total
                      ? `${(progress.current / progress.total) * 100}%`
                      : '0%',
                  }}
                />
              </div>
              <div className="lib-progress-text">
                {scanning
                  ? `Scanning file ${progress.current} of ${progress.total}...`
                  : `Done — ${matchedCount} game${matchedCount !== 1 ? 's' : ''} found out of ${results.length} files.`}
              </div>
              <div className="lib-scan-log" ref={logRef}>
                {results.map((r, i) => (
                  <div key={i} className={`lib-scan-log-entry ${r.matched ? 'matched' : 'unmatched'}`}>
                    <span className="lib-log-icon">{r.matched ? '✅' : '⬜'}</span>
                    <span className="lib-log-file">{r.fileName}</span>
                    {r.matched && (
                      <span className="lib-log-title">
                        {r.title} ({r.console})
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="lib-modal-footer">
          <button type="button" className="lib-btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

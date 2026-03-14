import { useState, useEffect, useRef } from 'react';
import { API_BASE_URL, getAccessToken } from '../../helpers/apiClient';
import { useLibraryData } from '../../helpers/useLibraryData';
import { useInvalidateScannedGames } from '../../helpers/useScannedGames';
import type { SavedFolder, ScanResult, ScanProgress } from './libraryModalTypes';

interface Props {
  onClose: () => void;
  onFolderAdded: (folder: SavedFolder) => void;
}

export default function AddFolderModal({ onClose, onFolderAdded }: Props) {
  const { data: libraryData } = useLibraryData();
  const consoles = libraryData?.consoles ?? [];
  const invalidateScannedGames = useInvalidateScannedGames();
  const [folderPath, setFolderPath] = useState('');
  const [selectedConsoleId, setSelectedConsoleId] = useState<number | null>(null);
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

  useEffect(() => {
    if (!scanning) return;
    const unsub = window.electron.scanner.onProgress((raw) => {
      const p = raw as ScanProgress;
      setProgress({ current: p.current, total: p.total });
      if (p.fileName) {
        setResults((prev) => [
          ...prev,
          {
            fileName: p.fileName!,
            matched: !!p.matched,
            consoleName: p.consoleName,
            title: p.title,
          },
        ]);
      }
    });
    return () => { unsub(); };
  }, [scanning]);

  const handleBrowse = async () => {
    const selected = await window.electron.scanner.browseFolder();
    if (selected) {
      setFolderPath(selected);
      setResults([]);
      setDone(false);
    }
  };

  const handleScan = async () => {
    if (!folderPath || selectedConsoleId === null) return;
    const token = getAccessToken();
    if (!token) return;

    const consoleName = consoles.find((c) => c.consoleId === selectedConsoleId)?.consoleName ?? '';

    setScanning(true);
    setResults([]);
    setDone(false);

    await window.electron.scanner.addFolder(folderPath, selectedConsoleId, consoleName);

    const { matched } = await window.electron.scanner.scanFolder(
      folderPath,
      selectedConsoleId,
      API_BASE_URL,
      token,
    );

    setScanning(false);
    setDone(true);
    invalidateScannedGames();

    onFolderAdded({
      path: folderPath,
      consoleId: selectedConsoleId,
      consoleName,
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
            Select a folder and choose the console/system the ROMs belong to. The same folder
            can be added multiple times for different systems.
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
          <select
            className="lib-select"
            value={selectedConsoleId ?? ''}
            onChange={(e) => setSelectedConsoleId(e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">— Select system —</option>
            {consoles.map((c) => (
              <option key={c.consoleId} value={c.consoleId}>{c.consoleName}</option>
            ))}
          </select>
          <button
            type="button"
            className="lib-action-btn"
            disabled={!folderPath || selectedConsoleId === null || scanning}
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
                        {r.title} ({r.consoleName})
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

import { useState } from 'react';
import { API_BASE_URL, getAccessToken } from '../../helpers/apiClient';
import { useLibraryData } from '../../helpers/useLibraryData';
import type { ScanResult } from './libraryModalTypes';

interface Props {
  onClose: () => void;
}

export default function AddGameModal({ onClose }: Props) {
  const { data: libraryData } = useLibraryData();
  const consoles = libraryData?.consoles ?? [];
  const [filePath, setFilePath] = useState('');
  const [selectedConsoleId, setSelectedConsoleId] = useState<number | null>(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);

  const handleBrowse = async () => {
    const selected = await window.electron.scanner.browseFile();
    if (selected) {
      setFilePath(selected);
      setResult(null);
    }
  };

  const handleScan = async () => {
    if (!filePath || selectedConsoleId === null) return;
    const token = getAccessToken();
    if (!token) return;

    setScanning(true);
    setResult(null);

    const res = await window.electron.scanner.scanFile(filePath, selectedConsoleId, API_BASE_URL, token);
    setResult({
      fileName: res.fileName,
      matched: res.matched,
      consoleName: res.consoleName,
      title: res.title,
    });
    setScanning(false);
  };

  return (
    <div className="lib-modal-backdrop" onClick={onClose}>
      <div className="lib-modal lib-modal--sm" onClick={(e) => e.stopPropagation()}>
        <div className="lib-modal-header">
          <h2>Add Single Game</h2>
          <button type="button" className="lib-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="lib-modal-content">
          <p className="lib-modal-desc">
            Select a ROM file and choose its system to check if it's recognised by RetroAchievements.
          </p>
          <div className="lib-path-row">
            <input
              type="text"
              className="lib-input"
              placeholder="Path to ROM file..."
              value={filePath}
              onChange={(e) => { setFilePath(e.target.value); setResult(null); }}
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
            disabled={!filePath || selectedConsoleId === null || scanning}
            onClick={handleScan}
          >
            {scanning ? 'Scanning...' : 'Scan File'}
          </button>

          {result && (
            <div className={`lib-scan-result ${result.matched ? 'matched' : 'unmatched'}`}>
              {result.matched ? (
                <>
                  <span className="lib-result-icon">✅</span>
                  <div>
                    <strong>{result.title}</strong>
                    <span className="lib-result-console">{result.consoleName}</span>
                    <p className="lib-result-note">Game recognised — added to your library.</p>
                  </div>
                </>
              ) : (
                <>
                  <span className="lib-result-icon">❌</span>
                  <div>
                    <strong>{result.fileName}</strong>
                    <p className="lib-result-note">Not recognised as a RetroAchievements game.</p>
                  </div>
                </>
              )}
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

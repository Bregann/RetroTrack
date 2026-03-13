import { useState } from 'react';
import { MOCK_RA_GAMES, simulateSingleScan, type ScanResult } from './libraryModalTypes';

interface Props {
  onClose: () => void;
}

export default function AddGameModal({ onClose }: Props) {
  const [filePath, setFilePath] = useState('');
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);

  const handleBrowse = () => {
    const files = [...Object.keys(MOCK_RA_GAMES), 'readme.txt', 'cover.jpg'];
    const picked = files[Math.floor(Math.random() * files.length)];
    setFilePath(`C:\\ROMs\\${picked}`);
    setResult(null);
  };

  const handleScan = async () => {
    if (!filePath) return;
    setScanning(true);
    setResult(null);
    const res = await simulateSingleScan(filePath);
    setResult(res);
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
            Select a ROM file to scan and check if it's recognised by RetroAchievements.
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
          <button
            type="button"
            className="lib-action-btn"
            disabled={!filePath || scanning}
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
                    <span className="lib-result-console">{result.console}</span>
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

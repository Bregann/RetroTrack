import { useEffect, useRef } from 'react';
import type { ScanResult } from './libraryModalTypes';

interface Props {
  scanning: boolean;
  results: ScanResult[];
  progress: { current: number; total: number };
}

export default function ScanProgress({ scanning, results, progress }: Props) {
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [results]);

  const matchedCount = results.filter((r) => r.matched).length;

  return (
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
  );
}

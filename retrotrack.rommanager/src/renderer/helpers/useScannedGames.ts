import { useState, useEffect } from 'react';

interface ScannedGameRow {
  consoleId: number;
  gameId: number;
}

/** Returns the set of consoleIds that have at least one scanned game in SQLite. */
export function useScannedConsoleIds(): Set<number> {
  const [ids, setIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    window.electron.scanner.getScannedGames().then((rows: unknown) => {
      const games = rows as ScannedGameRow[];
      setIds(new Set(games.map((g) => g.consoleId)));
    });
  }, []);

  return ids;
}

/** Returns the set of gameIds (RA game IDs) that have at least one scanned ROM. */
export function useScannedGameIds(): Set<number> {
  const [ids, setIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    window.electron.scanner.getScannedGames().then((rows: unknown) => {
      const games = rows as ScannedGameRow[];
      setIds(new Set(games.map((g) => g.gameId)));
    });
  }, []);

  return ids;
}

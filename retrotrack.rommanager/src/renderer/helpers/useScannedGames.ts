import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { LibraryTrackedGame } from './libraryTypes';
import { QueryKeys } from './queryKeys';

interface ScannedGameRow {
  gameId: number;
  title: string;
  consoleId: number;
  consoleName: string;
  imageIcon: string;
  imageBoxArt: string;
  achievementCount: number;
  points: number;
}

function useScannedGamesData(): ScannedGameRow[] {
  const { data } = useQuery<ScannedGameRow[]>({
    queryKey: [QueryKeys.ScannedGames],
    queryFn: async () => {
      const rows = await window.electron.scanner.getScannedGames();
      return rows as ScannedGameRow[];
    },
    staleTime: Infinity,
  });
  return data ?? [];
}

/** Returns the set of consoleIds that have at least one scanned game in SQLite. */
export function useScannedConsoleIds(): Set<number> {
  const games = useScannedGamesData();
  return new Set(games.map((g) => g.consoleId));
}

/** Returns the set of gameIds (RA game IDs) that have at least one scanned ROM. */
export function useScannedGameIds(): Set<number> {
  const games = useScannedGamesData();
  return new Set(games.map((g) => g.gameId));
}

/**
 * Returns unique scanned games as LibraryTrackedGame objects (progress fields zeroed).
 * Multiple ROM files for the same gameId are deduplicated.
 */
export function useScannedGamesAsLibrary(): LibraryTrackedGame[] {
  const games = useScannedGamesData();
  const seen = new Set<number>();
  const result: LibraryTrackedGame[] = [];
  for (const g of games) {
    if (seen.has(g.gameId)) continue;
    seen.add(g.gameId);
    result.push({
      gameId: g.gameId,
      title: g.title,
      consoleId: g.consoleId,
      consoleName: g.consoleName,
      imageIcon: g.imageIcon,
      imageBoxArt: g.imageBoxArt,
      achievementCount: g.achievementCount,
      points: g.points,
      achievementsEarned: 0,
      percentageComplete: 0,
      highestAward: null,
      lastPlayedUtc: null,
    });
  }
  return result;
}

/** Call after a scan completes to refresh all components that depend on scanned data. */
export function useInvalidateScannedGames() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: [QueryKeys.ScannedGames] });
}

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { doGet } from './apiClient';
import type { LibraryData, LibraryConsole, LibraryTrackedGame } from './libraryTypes';

const LIBRARY_QUERY_KEY = ['library-data'];

interface ApiLibraryResponse {
  consoles: Array<{
    consoleId: number;
    consoleName: string;
    consoleType: string;
  }>;
  trackedGames: Array<{
    gameId: number;
    title: string;
    consoleId: number;
    consoleName: string;
    imageIcon: string;
    imageBoxArt: string;
    achievementCount: number;
    points: number;
    achievementsEarned: number;
    percentageComplete: number;
    highestAward: string | null;
  }>;
}

async function loadFromLocal(): Promise<LibraryData | null> {
  const db = window.electron?.db;
  if (db === undefined) return null;

  const consoles = (await db.getConsoles()) as LibraryConsole[];
  const trackedGames = (await db.getTrackedGames()) as LibraryTrackedGame[];

  if (consoles.length === 0) return null;

  return { consoles, trackedGames };
}

async function syncFromApi(): Promise<LibraryData> {
  const db = window.electron?.db;
  const res = await doGet<ApiLibraryResponse>('/api/Library/GetUserLibraryData');

  if (!res.ok || res.data === undefined) {
    throw new Error(res.statusMessage ?? 'Failed to fetch library data');
  }

  const { consoles, trackedGames } = res.data;

  // Persist to local SQLite
  if (db !== undefined) {
    await db.upsertConsoles(consoles);
    await db.upsertTrackedGames(trackedGames);
    await db.setSyncMeta('lastSync', new Date().toISOString());
  }

  return { consoles, trackedGames };
}

async function fetchLibraryData(): Promise<LibraryData> {
  // Try local cache first for instant startup
  const local = await loadFromLocal();

  // Always sync from API in the background to get fresh data
  const apiPromise = syncFromApi().catch((err) => {
    console.warn('API sync failed, using local cache:', err);
    return null;
  });

  if (local !== null) {
    // Return local data immediately, API sync will update the cache
    apiPromise.then(() => {
      // QueryClient will pick up the next refetch
    });
    return local;
  }

  // No local data — must wait for API
  const apiData = await apiPromise;
  if (apiData === null) {
    throw new Error('No local data and API sync failed');
  }
  return apiData;
}

export function useLibraryData() {
  return useQuery<LibraryData>({
    queryKey: LIBRARY_QUERY_KEY,
    queryFn: fetchLibraryData,
    staleTime: 5 * 60 * 1000, // consider data fresh for 5 minutes
  });
}

export function useRefreshLibrary() {
  const queryClient = useQueryClient();

  return async () => {
    const data = await syncFromApi();
    queryClient.setQueryData(LIBRARY_QUERY_KEY, data);
    return data;
  };
}

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { doGet } from './apiClient';
import { queryClient } from './queryClient';
import type { LibraryData, LibraryConsole, LibraryTrackedGame, LibraryPlaylist } from './libraryTypes';
import { QueryKeys } from './queryKeys';

interface ApiLibraryResponse {
  consoles: Array<{
    consoleId: number;
    consoleName: string;
    consoleType: number;
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
    lastPlayedUtc: string | null;
    isTracked: boolean;
  }>;
  playlists: Array<{
    playlistId: string;
    name: string;
    gameIds: number[];
  }>;
  raUsername: string;
  profileImageUrl: string;
  hardcorePoints: number;
  achievementsEarnedHardcore: number;
}

async function loadFromLocal(): Promise<LibraryData | null> {
  const db = window.electron?.db;
  if (db === undefined) return null;

  const consoles = (await db.getConsoles()) as LibraryConsole[];
  const trackedGames = (await db.getTrackedGames()) as LibraryTrackedGame[];
  const playlistsRaw = await db.getPlaylists();
  const playlists = Array.isArray(playlistsRaw) ? (playlistsRaw as LibraryPlaylist[]) : [];
  const raUsername = ((await db.getSyncMeta('raUsername')) as string) ?? '';
  const profileImageUrl = ((await db.getSyncMeta('profileImageUrl')) as string) ?? '';
  const hardcorePoints = parseInt((await db.getSyncMeta('hardcorePoints') as string) ?? '0', 10);
  const achievementsEarnedHardcore = parseInt((await db.getSyncMeta('achievementsEarnedHardcore') as string) ?? '0', 10);

  if (consoles.length === 0) return null;

  return { consoles, trackedGames, playlists, raUsername, profileImageUrl, hardcorePoints, achievementsEarnedHardcore };
}

async function syncFromApi(): Promise<LibraryData> {
  const db = window.electron?.db;
  const res = await doGet<ApiLibraryResponse>('/api/Library/GetUserLibraryData');

  if (!res.ok || res.data === undefined) {
    throw new Error(res.statusMessage ?? 'Failed to fetch library data');
  }

  const { consoles, trackedGames, playlists, raUsername, profileImageUrl, hardcorePoints, achievementsEarnedHardcore } = res.data;

  // Persist to local SQLite
  if (db !== undefined) {
    await db.upsertConsoles(consoles);
    await db.upsertTrackedGames(trackedGames);
    await db.upsertPlaylists(playlists ?? []);
    await db.setSyncMeta('lastSync', new Date().toISOString());
    await db.setSyncMeta('raUsername', raUsername);
    await db.setSyncMeta('profileImageUrl', profileImageUrl);
    await db.setSyncMeta('hardcorePoints', String(hardcorePoints));
    await db.setSyncMeta('achievementsEarnedHardcore', String(achievementsEarnedHardcore));

    // Refresh Discord idle presence now that the username is available for buttons
    window.electron?.discord?.refreshIdle();
  }

  return { consoles, trackedGames, playlists: playlists ?? [], raUsername, profileImageUrl, hardcorePoints, achievementsEarnedHardcore };
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
    // Return local data immediately, then update cache when API sync finishes
    apiPromise.then((fresh) => {
      if (fresh !== null) {
        queryClient.setQueryData([QueryKeys.LibraryData], fresh);
      }
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
    queryKey: [QueryKeys.LibraryData],
    queryFn: fetchLibraryData,
    staleTime: 5 * 60 * 1000, // consider data fresh for 5 minutes
  });
}

export function useRefreshLibrary() {
  const qc = useQueryClient();

  return async () => {
    const data = await syncFromApi();
    qc.setQueryData([QueryKeys.LibraryData], data);
    return data;
  };
}

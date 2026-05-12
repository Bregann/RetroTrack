 

/**
 * Centralised query keys for @tanstack/react-query.
 * Every useQuery / useMutation in the app should reference these keys rather
 * than using raw string literals.
 */
export enum QueryKeys {
  // ── RetroTrack Mobile ──
  MobileHomeData = 'mobileHomeData',
  TrackedGames = 'trackedGames',
  GameDetail = 'gameDetail',
  Playlists = 'playlists',
  PlaylistDetail = 'playlistDetail',
  Consoles = 'consoles',
  ConsoleDetail = 'consoleDetail',
  Search = 'search',
  SearchConsoles = 'searchConsoles',
  UserProfile = 'userProfile',
}

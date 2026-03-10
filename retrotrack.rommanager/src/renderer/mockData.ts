// ============================================================
// Mock Data for RetroTrack ROM Manager
// ============================================================

export interface Game {
  id: number;
  title: string;
  console: string;
  consoleShort: string;
  coverColor: string; // placeholder color for mock covers
  status?: 'in-progress' | 'completed' | 'not-started';
  achievementPercent?: number;
  lastPlayed?: string;
  favorite?: boolean;
}

export interface ConsoleInfo {
  name: string;
  icon: string; // emoji placeholder
  shortName: string;
}

export interface CustomCategory {
  id: number;
  name: string;
  icon: string;
  gameIds: number[];
  expanded: boolean;
}

export interface Playlist {
  id: number;
  name: string;
  icon: string;
  gameIds: number[];
}

export interface UserProfile {
  username: string;
  avatarColor: string;
  achievementsUnlocked: number;
}

// ---- Consoles ----
export const CONSOLES: ConsoleInfo[] = [
  { name: 'Nintendo 64', icon: '🎮', shortName: 'N64' },
  { name: 'Super Nintendo', icon: '🕹️', shortName: 'SNES' },
  { name: 'Sega Genesis', icon: '🎯', shortName: 'GEN' },
  { name: 'PlayStation', icon: '🎲', shortName: 'PS1' },
  { name: 'Game Boy Advance', icon: '📱', shortName: 'GBA' },
];

// ---- Games ----
export const GAMES: Game[] = [
  // Nintendo 64
  { id: 1, title: 'Super Mario 64', console: 'Nintendo 64', consoleShort: 'N64', coverColor: '#e63946', status: 'in-progress', achievementPercent: 62, lastPlayed: undefined },
  { id: 2, title: 'Banjo-Kazooie', console: 'Nintendo 64', consoleShort: 'N64', coverColor: '#f4a261', status: 'not-started', achievementPercent: 45, lastPlayed: undefined },
  { id: 3, title: 'Donkey Kong 64', console: 'Nintendo 64', consoleShort: 'N64', coverColor: '#e9c46a', status: 'not-started', achievementPercent: undefined, lastPlayed: '1 hour ago' },
  { id: 4, title: 'The Legend of Zelda: Ocarina of Time', console: 'Nintendo 64', consoleShort: 'N64', coverColor: '#2a9d8f', status: 'in-progress', lastPlayed: undefined },
  { id: 5, title: 'Star Fox 64', console: 'Nintendo 64', consoleShort: 'N64', coverColor: '#264653', status: 'not-started', lastPlayed: undefined },
  { id: 6, title: 'Perfect Dark', console: 'Nintendo 64', consoleShort: 'N64', coverColor: '#6a0572', status: 'not-started', lastPlayed: undefined },
  { id: 7, title: 'GoldenEye 007', console: 'Nintendo 64', consoleShort: 'N64', coverColor: '#c9a227', status: 'completed', achievementPercent: 100, lastPlayed: '3 days ago' },
  { id: 8, title: 'Mario Kart 64', console: 'Nintendo 64', consoleShort: 'N64', coverColor: '#d62828', status: 'not-started', lastPlayed: undefined },
  { id: 9, title: 'Paper Mario', console: 'Nintendo 64', consoleShort: 'N64', coverColor: '#f77f00', status: 'not-started', lastPlayed: undefined },
  { id: 10, title: 'Kirby 64: The Crystal Shards', console: 'Nintendo 64', consoleShort: 'N64', coverColor: '#ff69b4', status: 'not-started', lastPlayed: undefined },

  // Super Nintendo
  { id: 11, title: 'Super Mario World', console: 'Super Nintendo', consoleShort: 'SNES', coverColor: '#4caf50', status: 'completed', achievementPercent: 100, lastPlayed: '1 week ago' },
  { id: 12, title: 'The Legend of Zelda: A Link to the Past', console: 'Super Nintendo', consoleShort: 'SNES', coverColor: '#388e3c', status: 'in-progress', achievementPercent: 78, lastPlayed: '2 days ago' },
  { id: 13, title: 'Super Metroid', console: 'Super Nintendo', consoleShort: 'SNES', coverColor: '#7b1fa2', status: 'not-started', lastPlayed: undefined },
  { id: 14, title: 'Chrono Trigger', console: 'Super Nintendo', consoleShort: 'SNES', coverColor: '#1565c0', status: 'in-progress', achievementPercent: 34, lastPlayed: '5 hours ago' },
  { id: 15, title: 'Final Fantasy VI', console: 'Super Nintendo', consoleShort: 'SNES', coverColor: '#0d47a1', status: 'not-started', lastPlayed: undefined },
  { id: 16, title: 'EarthBound', console: 'Super Nintendo', consoleShort: 'SNES', coverColor: '#e91e63', status: 'not-started', lastPlayed: undefined },
  { id: 17, title: 'Donkey Kong Country', console: 'Super Nintendo', consoleShort: 'SNES', coverColor: '#795548', status: 'completed', achievementPercent: 100, lastPlayed: '2 weeks ago' },
  { id: 18, title: 'Secret of Mana', console: 'Super Nintendo', consoleShort: 'SNES', coverColor: '#00bcd4', status: 'not-started', lastPlayed: undefined },

  // Sega Genesis
  { id: 19, title: 'Sonic the Hedgehog', console: 'Sega Genesis', consoleShort: 'GEN', coverColor: '#2196f3', status: 'in-progress', achievementPercent: 55, lastPlayed: undefined },
  { id: 20, title: 'Sonic the Hedgehog 2', console: 'Sega Genesis', consoleShort: 'GEN', coverColor: '#1976d2', status: 'not-started', lastPlayed: undefined },
  { id: 21, title: 'Streets of Rage 2', console: 'Sega Genesis', consoleShort: 'GEN', coverColor: '#f44336', status: 'not-started', lastPlayed: undefined },
  { id: 22, title: 'Phantasy Star IV', console: 'Sega Genesis', consoleShort: 'GEN', coverColor: '#9c27b0', status: 'not-started', lastPlayed: undefined },
  { id: 23, title: 'Gunstar Heroes', console: 'Sega Genesis', consoleShort: 'GEN', coverColor: '#ff5722', status: 'not-started', lastPlayed: undefined },
  { id: 24, title: 'Shining Force II', console: 'Sega Genesis', consoleShort: 'GEN', coverColor: '#3f51b5', status: 'not-started', lastPlayed: undefined },

  // PlayStation
  { id: 25, title: 'Final Fantasy VII', console: 'PlayStation', consoleShort: 'PS1', coverColor: '#1a237e', status: 'completed', achievementPercent: 100, lastPlayed: '1 month ago' },
  { id: 26, title: 'Castlevania: Symphony of the Night', console: 'PlayStation', consoleShort: 'PS1', coverColor: '#311b92', status: 'in-progress', achievementPercent: 67, lastPlayed: '4 hours ago' },
  { id: 27, title: 'Metal Gear Solid', console: 'PlayStation', consoleShort: 'PS1', coverColor: '#455a64', status: 'not-started', lastPlayed: undefined },
  { id: 28, title: 'Crash Bandicoot', console: 'PlayStation', consoleShort: 'PS1', coverColor: '#ff6f00', status: 'not-started', lastPlayed: undefined },
  { id: 29, title: 'Spyro the Dragon', console: 'PlayStation', consoleShort: 'PS1', coverColor: '#6a1b9a', status: 'not-started', lastPlayed: undefined },
  { id: 30, title: 'Resident Evil 2', console: 'PlayStation', consoleShort: 'PS1', coverColor: '#b71c1c', status: 'not-started', lastPlayed: undefined },

  // Game Boy Advance
  { id: 31, title: 'Pokemon Emerald', console: 'Game Boy Advance', consoleShort: 'GBA', coverColor: '#4caf50', status: 'in-progress', achievementPercent: 41, lastPlayed: '6 hours ago' },
  { id: 32, title: 'The Legend of Zelda: The Minish Cap', console: 'Game Boy Advance', consoleShort: 'GBA', coverColor: '#8bc34a', status: 'not-started', lastPlayed: undefined },
  { id: 33, title: 'Metroid Fusion', console: 'Game Boy Advance', consoleShort: 'GBA', coverColor: '#ff9800', status: 'completed', achievementPercent: 100, lastPlayed: '3 weeks ago' },
  { id: 34, title: 'Fire Emblem', console: 'Game Boy Advance', consoleShort: 'GBA', coverColor: '#d32f2f', status: 'not-started', lastPlayed: undefined },
  { id: 35, title: 'Golden Sun', console: 'Game Boy Advance', consoleShort: 'GBA', coverColor: '#ffc107', status: 'not-started', lastPlayed: undefined },
  { id: 36, title: 'Advance Wars', console: 'Game Boy Advance', consoleShort: 'GBA', coverColor: '#607d8b', status: 'not-started', lastPlayed: undefined },
];

// ---- Tracked Games (in-progress) ----
export const TRACKED_GAME_IDS = [1, 19, 4, 14, 12, 26, 31];

// ---- Custom Categories ----
export const CUSTOM_CATEGORIES: CustomCategory[] = [
  { id: 1, name: 'RPG Favorites', icon: '❤️', gameIds: [14, 15, 22, 25, 9], expanded: false },
  { id: 2, name: 'Multiplayer Night', icon: '🎮', gameIds: [8, 6, 21, 7], expanded: false },
  { id: 3, name: 'Speedrun Practice', icon: '⏱️', gameIds: [1, 11, 13, 19], expanded: false },
];

// ---- Playlists ----
export const PLAYLISTS: Playlist[] = [
  { id: 1, name: 'Hardcore Achievements', icon: '🏆', gameIds: [1, 2, 7, 11, 25, 33] },
  { id: 2, name: 'Retro Chill', icon: '📋', gameIds: [9, 16, 18, 35] },
];

// ---- User ----
export const MOCK_USER: UserProfile = {
  username: 'GamerTagX',
  avatarColor: '#4a90d9',
  achievementsUnlocked: 1245,
};

// Helper
export function getGameById(id: number): Game | undefined {
  return GAMES.find((g) => g.id === id);
}

export function getGamesByConsole(consoleName: string): Game[] {
  return GAMES.filter((g) => g.console === consoleName);
}

export function getTrackedGames(): Game[] {
  return TRACKED_GAME_IDS.map((id) => getGameById(id)).filter(Boolean) as Game[];
}

export function getInProgressGames(): Game[] {
  return GAMES.filter((g) => g.status === 'in-progress');
}

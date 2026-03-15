// ============================================================
// Mock Data for RetroTrack ROM Manager
// ============================================================

export interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedDate?: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'ultra-rare';
  points: number;
  /** Highlights progression type for the player */
  type?: 'normal' | 'missable' | 'win';
}

export interface GameScreenshot {
  id: number;
  label: string;
  color: string; // placeholder color
}

export interface GameDetail {
  gameId: number;
  description: string;
  developer: string;
  publisher: string;
  releaseDate: string;
  genre: string;
  players: string;
  hoursPlayed: number;
  headerColor: string; // hero banner placeholder color
  screenshotColors: GameScreenshot[];
  achievements: Achievement[];
}

export interface Game {
  id: number;
  title: string;
  console: string;
  consoleShort: string;
  coverColor: string; // placeholder color for mock covers
  status?: 'in-progress' | 'completed' | 'not-started';
  achievementPercent?: number;
  lastPlayed?: string;
  favourite?: boolean;
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
  { id: 1, name: 'RPG Favourites', icon: '❤️', gameIds: [14, 15, 22, 25, 9], expanded: false },
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

export function getRecentlyPlayed(limit = 6): Game[] {
  return GAMES.filter((g) => g.lastPlayed).slice(0, limit);
}

export function getRecentlyAdded(limit = 6): Game[] {
  return [...GAMES].reverse().slice(0, limit);
}

// ---- Game Details (extended info for game detail page) ----
export const GAME_DETAILS: GameDetail[] = [
  {
    gameId: 1,
    description: 'Super Mario 64 is a 1996 platform game for the Nintendo 64. As Mario, the player explores Princess Peach\'s castle and must rescue her from Bowser. The game features open-world playgrounds filled with enemies, obstacles, and collectible Power Stars.',
    developer: 'Nintendo EAD',
    publisher: 'Nintendo',
    releaseDate: 'June 23, 1996',
    genre: 'Platformer',
    players: '1 Player',
    hoursPlayed: 24.5,
    headerColor: '#c62828',
    screenshotColors: [
      { id: 1, label: 'Title Screen', color: '#b71c1c' },
      { id: 2, label: 'Bob-omb Battlefield', color: '#d32f2f' },
      { id: 3, label: 'Cool Cool Mountain', color: '#64b5f6' },
      { id: 4, label: 'Bowser Fight', color: '#e65100' },
    ],
    achievements: [
      { id: 1, title: 'First Star', description: 'Collect your first Power Star', icon: '⭐', unlocked: true, unlockedDate: 'Jan 15, 2026', rarity: 'common', points: 5, type: 'normal' },
      { id: 2, title: 'Wing Cap', description: 'Unlock the Wing Cap switch', icon: '🎩', unlocked: true, unlockedDate: 'Jan 16, 2026', rarity: 'common', points: 10, type: 'normal' },
      { id: 3, title: 'Star Collector', description: 'Collect 30 Power Stars', icon: '🌟', unlocked: true, unlockedDate: 'Jan 20, 2026', rarity: 'uncommon', points: 25, type: 'normal' },
      { id: 4, title: 'Bowser Defeated', description: 'Defeat Bowser for the first time', icon: '🐉', unlocked: true, unlockedDate: 'Jan 22, 2026', rarity: 'uncommon', points: 25, type: 'win' },
      { id: 5, title: 'Metal Mario', description: 'Unlock the Metal Cap', icon: '🔩', unlocked: true, unlockedDate: 'Feb 1, 2026', rarity: 'uncommon', points: 10, type: 'missable' },
      { id: 6, title: 'Coin Hoarder', description: 'Collect 100 coins in a single stage', icon: '🪙', unlocked: false, rarity: 'rare', points: 50, type: 'normal' },
      { id: 7, title: '70 Star Run', description: 'Collect 70 Power Stars', icon: '💫', unlocked: false, rarity: 'rare', points: 50, type: 'win' },
      { id: 8, title: 'All 120 Stars', description: 'Collect all 120 Power Stars', icon: '👑', unlocked: false, rarity: 'ultra-rare', points: 100, type: 'win' },
      { id: 9, title: 'Speedrunner', description: 'Complete the game in under 2 hours', icon: '⏱️', unlocked: false, rarity: 'ultra-rare', points: 100, type: 'missable' },
      { id: 10, title: 'Perfect Run', description: 'Complete any stage without taking damage', icon: '🛡️', unlocked: false, rarity: 'rare', points: 50, type: 'missable' },
    ],
  },
  {
    gameId: 4,
    description: 'The Legend of Zelda: Ocarina of Time is an action-adventure game set in the land of Hyrule. Players control Link as he travels through time to stop Ganondorf from obtaining the Triforce. Widely considered one of the greatest video games ever made.',
    developer: 'Nintendo EAD',
    publisher: 'Nintendo',
    releaseDate: 'November 21, 1998',
    genre: 'Action-Adventure',
    players: '1 Player',
    hoursPlayed: 38.2,
    headerColor: '#1b5e20',
    screenshotColors: [
      { id: 1, label: 'Title Screen', color: '#2e7d32' },
      { id: 2, label: 'Hyrule Field', color: '#4caf50' },
      { id: 3, label: 'Temple of Time', color: '#1565c0' },
      { id: 4, label: 'Ganon Battle', color: '#b71c1c' },
    ],
    achievements: [
      { id: 1, title: 'Kokiri Sword', description: 'Obtain the Kokiri Sword', icon: '⚔️', unlocked: true, unlockedDate: 'Dec 10, 2025', rarity: 'common', points: 5, type: 'normal' },
      { id: 2, title: 'First Dungeon', description: 'Complete the Deku Tree dungeon', icon: '🌳', unlocked: true, unlockedDate: 'Dec 11, 2025', rarity: 'common', points: 10, type: 'normal' },
      { id: 3, title: 'Epona\'s Song', description: 'Learn Epona\'s Song', icon: '🐴', unlocked: true, unlockedDate: 'Dec 14, 2025', rarity: 'uncommon', points: 10, type: 'missable' },
      { id: 4, title: 'Master Sword', description: 'Pull the Master Sword from the pedestal', icon: '🗡️', unlocked: false, rarity: 'uncommon', points: 25, type: 'win' },
      { id: 5, title: 'All Medallions', description: 'Collect all six sage medallions', icon: '🏅', unlocked: false, rarity: 'rare', points: 50, type: 'win' },
      { id: 6, title: 'Ganon Defeated', description: 'Defeat Ganon and save Hyrule', icon: '👑', unlocked: false, rarity: 'rare', points: 100, type: 'win' },
    ],
  },
  {
    gameId: 7,
    description: 'GoldenEye 007 is a first-person shooter based on the James Bond film. Players take on the role of British Secret Intelligence Service agent James Bond as he fights to prevent a criminal syndicate from using a satellite weapon.',
    developer: 'Rare',
    publisher: 'Nintendo',
    releaseDate: 'August 25, 1997',
    genre: 'First-Person Shooter',
    players: '1-4 Players',
    hoursPlayed: 52.0,
    headerColor: '#8d6e00',
    screenshotColors: [
      { id: 1, label: 'Title Screen', color: '#c9a227' },
      { id: 2, label: 'Dam Level', color: '#455a64' },
      { id: 3, label: 'Facility', color: '#37474f' },
      { id: 4, label: 'Multiplayer', color: '#5d4037' },
    ],
    achievements: [
      { id: 1, title: 'Licensed to Kill', description: 'Complete the Dam level', icon: '🔫', unlocked: true, unlockedDate: 'Oct 5, 2025', rarity: 'common', points: 5, type: 'normal' },
      { id: 2, title: 'Agent', description: 'Complete the game on Agent difficulty', icon: '🕵️', unlocked: true, unlockedDate: 'Oct 20, 2025', rarity: 'uncommon', points: 25, type: 'win' },
      { id: 3, title: 'Secret Agent', description: 'Complete the game on Secret Agent', icon: '🎖️', unlocked: true, unlockedDate: 'Nov 5, 2025', rarity: 'rare', points: 50, type: 'win' },
      { id: 4, title: '00 Agent', description: 'Complete the game on 00 Agent', icon: '🏆', unlocked: true, unlockedDate: 'Dec 1, 2025', rarity: 'ultra-rare', points: 100, type: 'win' },
    ],
  },
  {
    gameId: 14,
    description: 'Chrono Trigger is a role-playing game developed by a dream team of creators. Players travel through time to prevent a global catastrophe. The game features multiple endings, combo attacks, and a revolutionary battle system.',
    developer: 'Square',
    publisher: 'Square',
    releaseDate: 'March 11, 1995',
    genre: 'JRPG',
    players: '1 Player',
    hoursPlayed: 18.7,
    headerColor: '#0d47a1',
    screenshotColors: [
      { id: 1, label: 'Title Screen', color: '#1565c0' },
      { id: 2, label: 'Millennium Fair', color: '#4caf50' },
      { id: 3, label: 'Magus Battle', color: '#4a148c' },
      { id: 4, label: 'Lavos', color: '#b71c1c' },
    ],
    achievements: [
      { id: 1, title: 'Time Traveler', description: 'Travel through time for the first time', icon: '⏰', unlocked: true, unlockedDate: 'Mar 1, 2026', rarity: 'common', points: 5, type: 'normal' },
      { id: 2, title: 'Dual Tech', description: 'Perform your first Dual Tech', icon: '⚡', unlocked: true, unlockedDate: 'Mar 2, 2026', rarity: 'common', points: 10, type: 'normal' },
      { id: 3, title: 'Masamune', description: 'Repair the legendary sword', icon: '🗡️', unlocked: true, unlockedDate: 'Mar 5, 2026', rarity: 'uncommon', points: 25, type: 'missable' },
      { id: 4, title: 'Epoch', description: 'Obtain the time machine Epoch', icon: '🚀', unlocked: false, rarity: 'uncommon', points: 25, type: 'missable' },
      { id: 5, title: 'All Endings', description: 'See all possible endings', icon: '🎬', unlocked: false, rarity: 'ultra-rare', points: 100, type: 'win' },
    ],
  },
  {
    gameId: 12,
    description: 'The Legend of Zelda: A Link to the Past is an action-adventure game that returns to the overhead perspective of the original. Link must rescue the seven descendants of the sages and defeat the evil Ganon in the Dark World.',
    developer: 'Nintendo EAD',
    publisher: 'Nintendo',
    releaseDate: 'November 21, 1991',
    genre: 'Action-Adventure',
    players: '1 Player',
    hoursPlayed: 31.0,
    headerColor: '#2e7d32',
    screenshotColors: [
      { id: 1, label: 'Title Screen', color: '#388e3c' },
      { id: 2, label: 'Light World', color: '#66bb6a' },
      { id: 3, label: 'Dark World', color: '#4a148c' },
      { id: 4, label: 'Ganon Fight', color: '#c62828' },
    ],
    achievements: [
      { id: 1, title: 'Master Sword', description: 'Obtain the Master Sword', icon: '⚔️', unlocked: true, unlockedDate: 'Feb 10, 2026', rarity: 'common', points: 10, type: 'normal' },
      { id: 2, title: 'Dark World', description: 'Enter the Dark World', icon: '🌑', unlocked: true, unlockedDate: 'Feb 12, 2026', rarity: 'uncommon', points: 25, type: 'win' },
      { id: 3, title: 'All Crystals', description: 'Collect all seven crystals', icon: '💎', unlocked: false, rarity: 'rare', points: 50, type: 'win' },
      { id: 4, title: 'Ganon Defeated', description: 'Defeat Ganon', icon: '👑', unlocked: false, rarity: 'rare', points: 100, type: 'win' },
    ],
  },
  {
    gameId: 19,
    description: 'Sonic the Hedgehog is a platform game featuring Sega\'s mascot. Players control Sonic as he races through stages at high speed, collecting rings and defeating Dr. Robotnik to save the animals of South Island.',
    developer: 'Sonic Team',
    publisher: 'Sega',
    releaseDate: 'June 23, 1991',
    genre: 'Platformer',
    players: '1 Player',
    hoursPlayed: 8.3,
    headerColor: '#0d47a1',
    screenshotColors: [
      { id: 1, label: 'Title Screen', color: '#1565c0' },
      { id: 2, label: 'Green Hill Zone', color: '#4caf50' },
      { id: 3, label: 'Marble Zone', color: '#ff8f00' },
      { id: 4, label: 'Final Zone', color: '#b71c1c' },
    ],
    achievements: [
      { id: 1, title: 'Green Hill Clear', description: 'Complete Green Hill Zone', icon: '🟢', unlocked: true, unlockedDate: 'Feb 20, 2026', rarity: 'common', points: 5, type: 'normal' },
      { id: 2, title: 'Ring Collector', description: 'Collect 200 rings in a single act', icon: '💍', unlocked: true, unlockedDate: 'Feb 22, 2026', rarity: 'uncommon', points: 25, type: 'normal' },
      { id: 3, title: 'All Chaos Emeralds', description: 'Collect all six Chaos Emeralds', icon: '💎', unlocked: false, rarity: 'rare', points: 50, type: 'missable' },
      { id: 4, title: 'Robotnik Defeated', description: 'Defeat Dr. Robotnik in the Final Zone', icon: '🤖', unlocked: false, rarity: 'rare', points: 50, type: 'win' },
      { id: 5, title: 'Speed Demon', description: 'Complete Green Hill Act 1 in under 30 seconds', icon: '⚡', unlocked: false, rarity: 'ultra-rare', points: 100, type: 'missable' },
    ],
  },
  {
    gameId: 26,
    description: 'Castlevania: Symphony of the Night is an action-RPG that follows Alucard, the son of Dracula, as he explores Dracula\'s castle. The game popularized the "Metroidvania" genre with its open-ended exploration and RPG mechanics.',
    developer: 'Konami',
    publisher: 'Konami',
    releaseDate: 'March 20, 1997',
    genre: 'Action RPG / Metroidvania',
    players: '1 Player',
    hoursPlayed: 22.5,
    headerColor: '#1a0033',
    screenshotColors: [
      { id: 1, label: 'Title Screen', color: '#311b92' },
      { id: 2, label: 'Castle Entrance', color: '#4a148c' },
      { id: 3, label: 'Inverted Castle', color: '#880e4f' },
      { id: 4, label: 'Dracula Battle', color: '#b71c1c' },
    ],
    achievements: [
      { id: 1, title: 'Alucard Awakens', description: 'Begin the journey into Dracula\'s castle', icon: '🧛', unlocked: true, unlockedDate: 'Mar 1, 2026', rarity: 'common', points: 5, type: 'normal' },
      { id: 2, title: 'Soul Steal', description: 'Learn the Soul Steal spell', icon: '👻', unlocked: true, unlockedDate: 'Mar 3, 2026', rarity: 'uncommon', points: 10, type: 'normal' },
      { id: 3, title: 'Shape Shifter', description: 'Unlock all transformation relics', icon: '🦇', unlocked: true, unlockedDate: 'Mar 5, 2026', rarity: 'uncommon', points: 25, type: 'missable' },
      { id: 4, title: 'Inverted Castle', description: 'Discover the Inverted Castle', icon: '🔄', unlocked: false, rarity: 'rare', points: 50, type: 'missable' },
      { id: 5, title: 'True Ending', description: 'Achieve the best ending with 200.6% map', icon: '👑', unlocked: false, rarity: 'ultra-rare', points: 100, type: 'win' },
    ],
  },
  {
    gameId: 31,
    description: 'Pokémon Emerald is the definitive version of the Hoenn region games. Players embark on a journey to become the Pokémon Champion while stopping both Team Aqua and Team Magma. Features the Battle Frontier post-game.',
    developer: 'Game Freak',
    publisher: 'Nintendo / The Pokémon Company',
    releaseDate: 'September 16, 2004',
    genre: 'RPG',
    players: '1-4 Players (Link Cable)',
    hoursPlayed: 45.8,
    headerColor: '#1b5e20',
    screenshotColors: [
      { id: 1, label: 'Title Screen', color: '#2e7d32' },
      { id: 2, label: 'Littleroot Town', color: '#66bb6a' },
      { id: 3, label: 'Rayquaza', color: '#4caf50' },
      { id: 4, label: 'Battle Frontier', color: '#ff6f00' },
    ],
    achievements: [
      { id: 1, title: 'First Partner', description: 'Choose your starter Pokémon', icon: '🔴', unlocked: true, unlockedDate: 'Feb 1, 2026', rarity: 'common', points: 5, type: 'missable' },
      { id: 2, title: 'Badge Collector', description: 'Earn 4 gym badges', icon: '🏅', unlocked: true, unlockedDate: 'Feb 10, 2026', rarity: 'uncommon', points: 25, type: 'normal' },
      { id: 3, title: 'All 8 Badges', description: 'Earn all 8 gym badges', icon: '🎖️', unlocked: false, rarity: 'uncommon', points: 25, type: 'normal' },
      { id: 4, title: 'Champion', description: 'Defeat the Elite Four and Champion', icon: '👑', unlocked: false, rarity: 'rare', points: 50, type: 'win' },
      { id: 5, title: 'Pokédex Complete', description: 'Complete the Hoenn Pokédex', icon: '📖', unlocked: false, rarity: 'ultra-rare', points: 100, type: 'win' },
      { id: 6, title: 'Battle Frontier', description: 'Earn all gold symbols in Battle Frontier', icon: '🏆', unlocked: false, rarity: 'ultra-rare', points: 100, type: 'win' },
    ],
  },
];

// Helper for game details
export function getGameDetail(gameId: number): GameDetail | undefined {
  return GAME_DETAILS.find((d) => d.gameId === gameId);
}

export function getCategoriesForGame(gameId: number): string[] {
  return CUSTOM_CATEGORIES
    .filter((cat) => cat.gameIds.includes(gameId))
    .map((cat) => `${cat.icon} ${cat.name}`);
}

// ---- Emulator Configuration ----

export interface EmulatorPreset {
  id: string;
  name: string;
  defaultExe: string; // typical exe name
  supportedConsoles: string[]; // shortName references
  supportsProfiles: boolean;
}

export interface RetroArchCore {
  id: string;
  name: string;
  consoles: string[]; // shortName references
}

export interface EmulatorConfig {
  id: string;
  presetId: string | 'custom';
  name: string;
  executablePath: string;
  installDir: string;
  supportedConsoles: string[];
  retroarchCore?: string; // only for RetroArch
  args: string;
  supportedFileTypes: string;
}

export const EMULATOR_PRESETS: EmulatorPreset[] = [
  { id: 'retroarch', name: 'RetroArch', defaultExe: 'retroarch.exe', supportedConsoles: ['N64', 'SNES', 'GEN', 'PS1', 'GBA'], supportsProfiles: true },
  { id: 'pcsx2',     name: 'PCSX2',     defaultExe: 'pcsx2-qt.exe', supportedConsoles: ['PS2'], supportsProfiles: false },
  { id: 'duckstation', name: 'DuckStation', defaultExe: 'duckstation-qt-x64-ReleaseLTCG.exe', supportedConsoles: ['PS1'], supportsProfiles: false },
  { id: 'dolphin',   name: 'Dolphin',   defaultExe: 'Dolphin.exe', supportedConsoles: ['GC', 'WII'], supportsProfiles: false },
  { id: 'bizhawk',   name: 'BizHawk',   defaultExe: 'EmuHawk.exe', supportedConsoles: ['N64', 'SNES', 'GEN', 'PS1', 'GBA', 'NES', 'GB', 'GBC'], supportsProfiles: false },
  { id: 'project64', name: 'Project64', defaultExe: 'Project64.exe', supportedConsoles: ['N64'], supportsProfiles: false },
  { id: 'mgba',      name: 'mGBA',      defaultExe: 'mGBA.exe', supportedConsoles: ['GBA', 'GB', 'GBC'], supportsProfiles: false },
  { id: 'snes9x',    name: 'Snes9x',    defaultExe: 'snes9x-x64.exe', supportedConsoles: ['SNES'], supportsProfiles: false },
  { id: 'custom',    name: 'Custom',     defaultExe: '', supportedConsoles: [], supportsProfiles: false },
];

export const RETROARCH_CORES: RetroArchCore[] = [
  { id: 'mupen64plus', name: 'Mupen64Plus-Next', consoles: ['N64'] },
  { id: 'parallel_n64', name: 'ParaLLEl N64', consoles: ['N64'] },
  { id: 'snes9x', name: 'Snes9x', consoles: ['SNES'] },
  { id: 'bsnes', name: 'bsnes', consoles: ['SNES'] },
  { id: 'genesis_plus_gx', name: 'Genesis Plus GX', consoles: ['GEN'] },
  { id: 'picodrive', name: 'PicoDrive', consoles: ['GEN'] },
  { id: 'beetle_psx', name: 'Beetle PSX HW', consoles: ['PS1'] },
  { id: 'swanstation', name: 'SwanStation', consoles: ['PS1'] },
  { id: 'mgba', name: 'mGBA', consoles: ['GBA', 'GB', 'GBC'] },
  { id: 'vba_m', name: 'VBA-M', consoles: ['GBA', 'GB', 'GBC'] },
  { id: 'gambatte', name: 'Gambatte', consoles: ['GB', 'GBC'] },
  { id: 'fceumm', name: 'FCEUmm', consoles: ['NES'] },
  { id: 'mesen', name: 'Mesen', consoles: ['NES'] },
];

export const ALL_CONSOLE_OPTIONS: { shortName: string; name: string }[] = [
  { shortName: 'N64', name: 'Nintendo 64' },
  { shortName: 'SNES', name: 'Super Nintendo' },
  { shortName: 'NES', name: 'Nintendo (NES)' },
  { shortName: 'GBA', name: 'Game Boy Advance' },
  { shortName: 'GB', name: 'Game Boy' },
  { shortName: 'GBC', name: 'Game Boy Color' },
  { shortName: 'GEN', name: 'Sega Genesis' },
  { shortName: 'PS1', name: 'PlayStation' },
  { shortName: 'PS2', name: 'PlayStation 2' },
  { shortName: 'GC', name: 'GameCube' },
  { shortName: 'WII', name: 'Wii' },
];

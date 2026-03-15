export type ViewMode = 'grid' | 'list';

export type SortField = 'title' | 'console' | 'lastPlayed' | 'achievementPercent' | 'status';
export type SortDir = 'asc' | 'desc';

export interface SortConfig {
  field: SortField;
  dir: SortDir;
}

export type ListColumn =
  | 'title'
  | 'console'
  | 'status'
  | 'achievementPercent'
  | 'achievementsUnlocked'
  | 'achievementsTotal'
  | 'lastPlayed'
  | 'favourite';

export const ALL_COLUMNS: { key: ListColumn; label: string }[] = [
  { key: 'title', label: 'Title' },
  { key: 'console', label: 'Console' },
  { key: 'status', label: 'Status' },
  { key: 'achievementsUnlocked', label: 'Unlocked' },
  { key: 'achievementsTotal', label: 'Total' },
  { key: 'achievementPercent', label: '% Done' },
  { key: 'lastPlayed', label: 'Last Played' },
  { key: 'favourite', label: 'Favourite' },
];

export const DEFAULT_COLUMNS: ListColumn[] = [
  'title',
  'console',
  'status',
  'achievementsUnlocked',
  'achievementsTotal',
  'achievementPercent',
  'lastPlayed',
];

export interface ViewConfig {
  mode: ViewMode;
  sort: SortConfig;
  columns: ListColumn[];
}

export const DEFAULT_VIEW_CONFIG: ViewConfig = {
  mode: 'grid',
  sort: { field: 'title', dir: 'asc' },
  columns: [...DEFAULT_COLUMNS],
};

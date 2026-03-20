export interface SavedFolder {
  path: string;
  consoleId: number;
  consoleName: string;
  addedAt: string;
  gameCount: number;
}

export interface ScanResult {
  fileName: string;
  matched: boolean;
  consoleName?: string;
  title?: string;
}

export interface ScanProgress {
  phase: 'hashing' | 'converting' | 'validating' | 'done';
  current: number;
  total: number;
  fileName?: string;
  matched?: boolean;
  title?: string;
  consoleName?: string;
  warning?: string;
  cached?: boolean;
}



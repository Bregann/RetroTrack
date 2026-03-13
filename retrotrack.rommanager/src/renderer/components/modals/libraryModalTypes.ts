export interface SavedFolder {
  path: string;
  addedAt: string;
  gameCount: number;
}

export interface ScanResult {
  fileName: string;
  matched: boolean;
  console?: string;
  title?: string;
}

export const MOCK_RA_GAMES: Record<string, { title: string; console: string }> = {
  'super_mario_world.sfc': { title: 'Super Mario World', console: 'SNES' },
  'zelda_alttp.sfc': { title: 'The Legend of Zelda: A Link to the Past', console: 'SNES' },
  'sonic_the_hedgehog.md': { title: 'Sonic the Hedgehog', console: 'Genesis' },
  'pokemon_red.gb': { title: 'Pokémon Red Version', console: 'Game Boy' },
  'castlevania_sotn.bin': { title: 'Castlevania: Symphony of the Night', console: 'PS1' },
  'megaman_x.sfc': { title: 'Mega Man X', console: 'SNES' },
  'final_fantasy_7.bin': { title: 'Final Fantasy VII', console: 'PS1' },
  'metroid_fusion.gba': { title: 'Metroid Fusion', console: 'GBA' },
};

const MOCK_UNRECOGNIZED = ['readme.txt', 'save_backup.srm', 'notes.doc', 'cover.jpg'];

export function simulateSingleScan(filePath: string): Promise<ScanResult> {
  return new Promise((resolve) => {
    const fileName = filePath.split(/[\\/]/).pop() || filePath;
    const match = MOCK_RA_GAMES[fileName.toLowerCase()];
    setTimeout(
      () =>
        resolve(
          match
            ? { fileName, matched: true, console: match.console, title: match.title }
            : { fileName, matched: false },
        ),
      800 + Math.random() * 600,
    );
  });
}

export function simulateFolderScan(
  onProgress: (result: ScanResult, index: number, total: number) => void,
): Promise<ScanResult[]> {
  const allFiles = [...Object.keys(MOCK_RA_GAMES), ...MOCK_UNRECOGNIZED.slice(0, 2)];
  const shuffled = allFiles.sort(() => Math.random() - 0.5);
  const results: ScanResult[] = [];

  return new Promise((resolve) => {
    let i = 0;
    const next = () => {
      if (i >= shuffled.length) {
        resolve(results);
        return;
      }
      const file = shuffled[i];
      const match = MOCK_RA_GAMES[file.toLowerCase()];
      const result: ScanResult = match
        ? { fileName: file, matched: true, console: match.console, title: match.title }
        : { fileName: file, matched: false };
      results.push(result);
      onProgress(result, i, shuffled.length);
      i++;
      setTimeout(next, 300 + Math.random() * 400);
    };
    setTimeout(next, 500);
  });
}

import fs from 'fs';
import path from 'path';
import { BrowserWindow } from 'electron';
import { upsertScannedGames, type ScannedGameRow } from './database';

// ROM file extensions we care about — covers the most common RA-supported systems
const ROM_EXTENSIONS = new Set([
  '.nes', '.sfc', '.smc', '.gb', '.gbc', '.gba', '.nds',
  '.md', '.gen', '.sms', '.gg',
  '.pce', '.sgx',
  '.a26', '.a78',
  '.col', '.sg',
  '.ngp', '.ngc',
  '.ws', '.wsc',
  '.bin', '.cue', '.iso', '.chd', '.pbp',
  '.z64', '.n64', '.v64',
  '.ndd', '.d64',
  '.min',
  '.vec',
  '.j64', '.lnx',
  '.fig', '.bs',
  '.wad',
  '.m3u',
  '.elf', '.dol',
  '.32x',
]);

interface HashResult {
  filePath: string;
  fileName: string;
  hash: string | null;
}

interface ApiHashMatch {
  md5: string;
  gameId: number;
  title: string;
  consoleId: number;
  consoleName: string;
  imageIcon: string;
  imageBoxArt: string;
}

function collectRomFiles(dirPath: string): string[] {
  const results: string[] = [];
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(dirPath, { withFileTypes: true });
  } catch {
    return results;
  }
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectRomFiles(fullPath));
    } else if (ROM_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      results.push(fullPath);
    }
  }
  return results;
}

async function hashFile(filePath: string, consoleId: number): Promise<string | null> {
  try {
    // node-rcheevos is a native module — require it at runtime
    // eslint-disable-next-line global-require
    const { rhash } = require('node-rcheevos');
    return rhash(consoleId, filePath) as string;
  } catch {
    return null;
  }
}

async function validateHashesBatch(
  hashes: string[],
  apiBaseUrl: string,
  accessToken: string,
): Promise<ApiHashMatch[]> {
  const res = await fetch(
    `${apiBaseUrl}/api/Library/ValidateGameHashes`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: 'include',
      body: JSON.stringify({ hashes }),
    },
  );
  if (!res.ok) return [];
  const data = (await res.json()) as { matches: ApiHashMatch[] };
  return data.matches ?? [];
}

export interface ScanProgress {
  phase: 'hashing' | 'validating' | 'done';
  current: number;
  total: number;
  fileName?: string;
  matched?: boolean;
  title?: string;
  consoleName?: string;
}

export async function scanFolder(
  folderPath: string,
  consoleId: number,
  apiBaseUrl: string,
  accessToken: string,
  onProgress?: (progress: ScanProgress) => void,
): Promise<{ matched: number; total: number }> {
  // 1. Collect ROM files
  const romFiles = collectRomFiles(folderPath);
  const total = romFiles.length;

  if (total === 0) {
    onProgress?.({ phase: 'done', current: 0, total: 0 });
    return { matched: 0, total: 0 };
  }

  // 2. Hash all files using the specified console ID
  const hashResults: HashResult[] = [];
  for (let i = 0; i < romFiles.length; i++) {
    const filePath = romFiles[i];
    const fileName = path.basename(filePath);
    onProgress?.({ phase: 'hashing', current: i + 1, total, fileName });
    const hash = await hashFile(filePath, consoleId);
    hashResults.push({ filePath, fileName, hash });
  }

  // 3. Validate hashes against API in batches of 200
  const BATCH_SIZE = 200;
  const validHashes = hashResults.filter((r) => r.hash !== null);
  const hashToFiles = new Map<string, HashResult[]>();
  for (const r of validHashes) {
    const list = hashToFiles.get(r.hash!) ?? [];
    list.push(r);
    hashToFiles.set(r.hash!, list);
  }

  const allMatches = new Map<string, ApiHashMatch>();
  const uniqueHashes = [...hashToFiles.keys()];

  for (let i = 0; i < uniqueHashes.length; i += BATCH_SIZE) {
    const batch = uniqueHashes.slice(i, i + BATCH_SIZE);
    onProgress?.({
      phase: 'validating',
      current: Math.min(i + BATCH_SIZE, uniqueHashes.length),
      total: uniqueHashes.length,
    });
    const matches = await validateHashesBatch(batch, apiBaseUrl, accessToken);
    for (const m of matches) {
      allMatches.set(m.md5, m);
    }
  }

  // 4. Build scanned game rows and save to SQLite
  const now = new Date().toISOString();
  const scannedRows: ScannedGameRow[] = [];

  for (const [hash, files] of hashToFiles) {
    const match = allMatches.get(hash);
    if (match) {
      for (const file of files) {
        scannedRows.push({
          hash,
          filePath: file.filePath,
          fileName: file.fileName,
          gameId: match.gameId,
          title: match.title,
          consoleId: match.consoleId,
          consoleName: match.consoleName,
          imageIcon: match.imageIcon,
          imageBoxArt: match.imageBoxArt,
          folderPath: folderPath,
          addedAt: now,
        });

        onProgress?.({
          phase: 'validating',
          current: scannedRows.length,
          total: validHashes.length,
          fileName: file.fileName,
          matched: true,
          title: match.title,
          consoleName: match.consoleName,
        });
      }
    }
  }

  if (scannedRows.length > 0) {
    upsertScannedGames(scannedRows);
  }

  onProgress?.({ phase: 'done', current: scannedRows.length, total });

  return { matched: scannedRows.length, total };
}

export interface ScanFileResult {
  fileName: string;
  matched: boolean;
  title?: string;
  consoleName?: string;
  gameId?: number;
}

export async function scanFile(
  filePath: string,
  consoleId: number,
  apiBaseUrl: string,
  accessToken: string,
): Promise<ScanFileResult> {
  const fileName = path.basename(filePath);
  const hash = await hashFile(filePath, consoleId);
  if (!hash) {
    return { fileName, matched: false };
  }

  const matches = await validateHashesBatch([hash], apiBaseUrl, accessToken);
  if (matches.length === 0) {
    return { fileName, matched: false };
  }

  const match = matches[0];
  const now = new Date().toISOString();
  upsertScannedGames([
    {
      hash,
      filePath,
      fileName,
      gameId: match.gameId,
      title: match.title,
      consoleId: match.consoleId,
      consoleName: match.consoleName,
      imageIcon: match.imageIcon,
      imageBoxArt: match.imageBoxArt,
      folderPath: path.dirname(filePath),
      addedAt: now,
    },
  ]);

  return {
    fileName,
    matched: true,
    title: match.title,
    consoleName: match.consoleName,
    gameId: match.gameId,
  };
}

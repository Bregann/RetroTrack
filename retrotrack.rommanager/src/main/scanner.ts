import fs from 'fs';
import os from 'os';
import path from 'path';
import { execFileSync } from 'child_process';
import { upsertScannedGames, getCachedHash, setCachedHash, type ScannedGameRow } from './database';

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
  '.rvz', '.wbfs', '.gcz', '.gcm',
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
  achievementCount: number;
  points: number;
}

function collectRomFiles(dirPath: string): string[] {
  const results: string[] = [];
  collectRomFilesRecursive(dirPath, results);

  // For disc-based games, a .cue file describes the disc layout and references
  // one or more .bin files. rcheevos hashes through the .cue, so when a .cue
  // exists in a directory we skip the .bin files there to avoid duplicates.
  const dirsWithCue = new Set<string>();
  for (const f of results) {
    if (path.extname(f).toLowerCase() === '.cue') {
      dirsWithCue.add(path.dirname(f));
    }
  }
  if (dirsWithCue.size > 0) {
    return results.filter((f) => {
      if (path.extname(f).toLowerCase() !== '.bin') return true;
      return !dirsWithCue.has(path.dirname(f));
    });
  }
  return results;
}

function collectRomFilesRecursive(dirPath: string, results: string[]): void {
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(dirPath, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      collectRomFilesRecursive(fullPath, results);
    } else if (ROM_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      results.push(fullPath);
    }
  }
}

// Compressed disc formats that rcheevos can't hash directly — need conversion to ISO first
const COMPRESSED_DISC_EXTENSIONS = new Set(['.rvz', '.gcz']);

/**
 * Convert a compressed Wii/GC disc image to a temp ISO using DolphinTool.
 * Returns the temp ISO path, or null if conversion failed.
 */
function convertToIso(filePath: string, dolphinToolPath: string): string | null {
  const tempDir = os.tmpdir();
  const baseName = path.basename(filePath, path.extname(filePath));
  const tempIso = path.join(tempDir, `retrotrack_${baseName}_${Date.now()}.iso`);

  try {
    console.log(`[scanner] Converting to ISO: ${filePath}`);
    execFileSync(dolphinToolPath, ['convert', '-i', filePath, '-o', tempIso, '-f', 'iso'], {
      timeout: 300_000, // 5 min max per file
      windowsHide: true,
    });
    if (fs.existsSync(tempIso)) {
      console.log(`[scanner] Conversion succeeded: ${tempIso}`);
      return tempIso;
    }
    console.warn(`[scanner] DolphinTool ran but output ISO not found: ${tempIso}`);
    return null;
  } catch (err) {
    console.error(`[scanner] DolphinTool conversion failed for ${filePath}:`, err);
    // Clean up partial file if it exists
    try { fs.unlinkSync(tempIso); } catch { /* ignore */ }
    return null;
  }
}

async function hashFile(
  filePath: string,
  consoleId: number,
  dolphinToolPath?: string,
): Promise<string | null> {
  const ext = path.extname(filePath).toLowerCase();

  // Compressed Wii/GC formats need conversion to ISO before hashing
  if (COMPRESSED_DISC_EXTENSIONS.has(ext)) {
    if (!dolphinToolPath) {
      console.warn(
        `[scanner] Skipping ${filePath} — compressed format requires DolphinTool but no path configured. ` +
        'Set up Dolphin in Emulator Settings so DolphinTool can be found.',
      );
      return null;
    }

    // Check the hash cache first — converting RVZ/GCZ to ISO is expensive
    let stat: fs.Stats;
    try {
      stat = fs.statSync(filePath);
    } catch {
      console.warn(`[scanner] Could not stat file: ${filePath}`);
      return null;
    }

    const fileSize = stat.size;
    const fileMtime = Math.floor(stat.mtimeMs);

    const cached = getCachedHash(filePath, consoleId, fileSize, fileMtime);
    if (cached) {
      console.log(`[scanner] Hash cache hit for ${filePath}`);
      return cached;
    }

    const tempIso = convertToIso(filePath, dolphinToolPath);
    if (!tempIso) return null;

    try {
      const { rhash } = require('node-rcheevos');
      const hash = rhash(consoleId, tempIso) as string | null;
      if (!hash) {
        console.warn(`[scanner] rhash returned null/empty for converted ISO (consoleId=${consoleId}) original=${filePath}`);
      } else {
        setCachedHash(filePath, consoleId, fileSize, fileMtime, hash);
      }
      return hash;
    } catch (err) {
      console.error(`[scanner] rhash threw for converted ISO (consoleId=${consoleId}) original=${filePath}:`, err);
      return null;
    } finally {
      try { fs.unlinkSync(tempIso); } catch { /* ignore */ }
    }
  }

  // Standard path — hash directly
  try {
    const { rhash } = require('node-rcheevos');
    const hash = rhash(consoleId, filePath) as string | null;
    if (!hash) {
      console.warn(`[scanner] rhash returned null/empty for consoleId=${consoleId} file=${filePath}`);
    }
    return hash;
  } catch (err) {
    console.error(`[scanner] rhash threw for consoleId=${consoleId} file=${filePath}:`, err);
    return null;
  }
}

async function validateHashesBatch(
  hashes: string[],
  apiBaseUrl: string,
  accessToken: string,
): Promise<ApiHashMatch[]> {
  const MAX_RETRIES = 3;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 60_000); // 60s timeout

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
          signal: controller.signal,
        },
      );
      clearTimeout(timeout);

      if (!res.ok) {
        console.error(`[scanner] ValidateGameHashes returned ${res.status} ${res.statusText} (attempt ${attempt}/${MAX_RETRIES})`);
        if (attempt < MAX_RETRIES) continue;
        return [];
      }
      const data = (await res.json()) as { matches: ApiHashMatch[] };
      return data.matches ?? [];
    } catch (err) {
      console.error(`[scanner] ValidateGameHashes fetch failed (attempt ${attempt}/${MAX_RETRIES}):`, err);
      if (attempt < MAX_RETRIES) {
        // Wait briefly before retrying
        await new Promise((r) => setTimeout(r, 2000 * attempt));
        continue;
      }
      return [];
    }
  }
  return [];
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

/**
 * Search emulator install directories for DolphinTool(.exe).
 * Returns the full path if found, or undefined.
 */
export function findDolphinTool(emulatorInstallDirs: string[]): string | undefined {
  const exe = process.platform === 'win32' ? 'DolphinTool.exe' : 'DolphinTool';
  for (const dir of emulatorInstallDirs) {
    if (!dir) continue;
    const candidate = path.join(dir, exe);
    if (fs.existsSync(candidate)) {
      console.log(`[scanner] Found DolphinTool at ${candidate}`);
      return candidate;
    }
  }
  return undefined;
}

export async function scanFolder(
  folderPath: string,
  consoleId: number,
  apiBaseUrl: string,
  accessToken: string,
  onProgress?: (progress: ScanProgress) => void,
  dolphinToolPath?: string,
): Promise<{ matched: number; total: number }> {
  // 1. Collect ROM files
  const romFiles = collectRomFiles(folderPath);
  const total = romFiles.length;

  if (total === 0) {
    onProgress?.({ phase: 'done', current: 0, total: 0 });
    return { matched: 0, total: 0 };
  }

  // Check if any files need DolphinTool conversion and warn upfront
  const compressedFiles = romFiles.filter(
    (f) => COMPRESSED_DISC_EXTENSIONS.has(path.extname(f).toLowerCase()),
  );
  if (compressedFiles.length > 0 && !dolphinToolPath) {
    onProgress?.({
      phase: 'hashing',
      current: 0,
      total,
      warning:
        `Found ${compressedFiles.length} compressed Wii/GC file(s) (.rvz/.gcz) that require ` +
        'Dolphin to be configured in Emulator Settings. These files will be skipped.',
    });
  } else if (compressedFiles.length > 0) {
    onProgress?.({
      phase: 'hashing',
      current: 0,
      total,
      warning:
        `Found ${compressedFiles.length} compressed Wii/GC file(s) that need converting before hashing. ` +
        'This may take a while on first scan — results are cached for future scans.',
    });
  }

  // 2. Hash all files using the specified console ID
  const hashResults: HashResult[] = [];
  for (let i = 0; i < romFiles.length; i++) {
    const filePath = romFiles[i];
    const fileName = path.basename(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const isCompressed = COMPRESSED_DISC_EXTENSIONS.has(ext);

    if (isCompressed && dolphinToolPath) {
      // Check if this file has a cached hash (skip conversion entirely)
      let stat: fs.Stats | undefined;
      try { stat = fs.statSync(filePath); } catch { /* handled in hashFile */ }
      const isCached = stat
        ? !!getCachedHash(filePath, consoleId, stat.size, Math.floor(stat.mtimeMs))
        : false;

      onProgress?.({
        phase: 'converting',
        current: i + 1,
        total,
        fileName,
        cached: isCached,
      });
    } else {
      onProgress?.({ phase: 'hashing', current: i + 1, total, fileName });
    }

    const hash = await hashFile(filePath, consoleId, dolphinToolPath);
    hashResults.push({ filePath, fileName, hash });
  }

  // 3. Validate hashes against API in batches of 200
  const BATCH_SIZE = 200;
  const validHashes = hashResults.filter((r) => r.hash !== null);
  const hashToFiles = new Map<string, HashResult[]>();
  for (const r of validHashes) {
    const list = hashToFiles.get(r.hash!) ?? [];
    list.push(r);
    hashToFiles.set(r.hash!.toLowerCase(), list);
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
          achievementCount: match.achievementCount,
          points: match.points,
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
  dolphinToolPath?: string,
): Promise<ScanFileResult> {
  const fileName = path.basename(filePath);
  const hash = await hashFile(filePath, consoleId, dolphinToolPath);
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
      achievementCount: match.achievementCount,
      points: match.points,
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

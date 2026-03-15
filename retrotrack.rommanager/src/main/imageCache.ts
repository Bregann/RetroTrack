import path from 'path';
import fs from 'fs';
import { app, protocol, session, net } from 'electron';

const RA_MEDIA_ORIGIN = 'https://media.retroachievements.org';
const CACHE_SCHEME = 'ra-cache';

// Re-fetch cached images older than 4 days
const STALE_MS = 4 * 24 * 60 * 60 * 1000;

let cacheDir: string;

function ensureCacheDir() {
  if (!cacheDir) {
    cacheDir = path.join(app.getPath('userData'), 'image-cache');
  }
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }
}

/** Convert an RA image path (e.g. /Images/012345.png) to a safe local file path. */
function localPath(imagePath: string): string {
  const sanitised = imagePath.replace(/^[/]+/, '').replace(/\.\./g, '');
  return path.join(cacheDir, sanitised);
}

function mimeFor(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.png') return 'image/png';
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  if (ext === '.gif') return 'image/gif';
  if (ext === '.webp') return 'image/webp';
  return 'application/octet-stream';
}

async function fetchAndCache(imagePath: string, filePath: string): Promise<Response> {
  const response = await net.fetch(`${RA_MEDIA_ORIGIN}${imagePath}`);
  if (!response.ok) return new Response('Upstream error', { status: response.status });
  const buffer = Buffer.from(await response.arrayBuffer());
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, buffer);
  const contentType = response.headers.get('content-type') ?? mimeFor(filePath);
  return new Response(buffer, { headers: { 'Content-Type': contentType } });
}

/** Deletes all files in the image cache directory. */
export function clearImageCache(): number {
  ensureCacheDir();
  let count = 0;
  const deleteDir = (dir: string) => {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        deleteDir(full);
        fs.rmdirSync(full);
      } else {
        fs.unlinkSync(full);
        count++;
      }
    }
  };
  deleteDir(cacheDir);
  return count;
}
export function registerCacheScheme(): void {
  protocol.registerSchemesAsPrivileged([
    {
      scheme: CACHE_SCHEME,
      privileges: {
        standard: true,
        secure: true,
        supportFetchAPI: true,
        corsEnabled: true,
      },
    },
  ]);
}

/**
 * Must be called **after** app.ready.
 * Registers the protocol handler on the default session.
 * URLs: ra-cache://media.retroachievements.org/Images/012345.png
 */
export function registerCacheProtocol(): void {
  ensureCacheDir();

  session.defaultSession.protocol.handle(CACHE_SCHEME, async (request) => {
    const url = new URL(request.url);
    const imagePath = decodeURIComponent(url.pathname);

    if (!imagePath || imagePath === '/') {
      return new Response('Not found', { status: 404 });
    }

    const filePath = localPath(imagePath);

    if (fs.existsSync(filePath)) {
      const age = Date.now() - fs.statSync(filePath).mtimeMs;
      if (age < STALE_MS) {
        // Fresh cache hit — serve from disk
        return new Response(fs.readFileSync(filePath), {
          headers: { 'Content-Type': mimeFor(filePath) },
        });
      }
      // Stale — try to re-fetch; fall back to stale file on network error
      try {
        return await fetchAndCache(imagePath, filePath);
      } catch {
        return new Response(fs.readFileSync(filePath), {
          headers: { 'Content-Type': mimeFor(filePath) },
        });
      }
    }

    // Cache miss — fetch from RA and cache
    try {
      return await fetchAndCache(imagePath, filePath);
    } catch {
      return new Response('Fetch failed', { status: 502 });
    }
  });
}


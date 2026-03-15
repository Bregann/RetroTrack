import DiscordRPC from 'discord-rpc';

const DISCORD_CLIENT_ID = '1482703397978247310';

const RA_IMAGE_BASE = 'https://media.retroachievements.org';

let rpcClient: DiscordRPC.Client | null = null;
let connected = false;
let connecting = false;

interface PresenceInfo {
  gameTitle: string;
  consoleName: string;
  imageIcon: string | null; // e.g. "/Images/012345.png"
  startedAt: number;        // Date.now() timestamp
}

/**
 * Initialise the Discord RPC client if not already connected.
 * Silently fails if Discord is not running.
 */
async function ensureConnected(): Promise<boolean> {
  if (connected && rpcClient) return true;
  if (connecting) return false;

  connecting = true;
  try {
    rpcClient = new DiscordRPC.Client({ transport: 'ipc' });

    rpcClient.on('disconnected', () => {
      connected = false;
      rpcClient = null;
    });

    await rpcClient.login({ clientId: DISCORD_CLIENT_ID });
    connected = true;
    return true;
  } catch {
    // Discord is not running or client ID is invalid — that's fine
    rpcClient = null;
    connected = false;
    return false;
  } finally {
    connecting = false;
  }
}

/**
 * Set Discord Rich Presence to show the game being played.
 */
export async function setDiscordPresence(info: PresenceInfo): Promise<void> {
  const ok = await ensureConnected();
  if (!ok || !rpcClient) return;

  try {
    const largeImageKey = info.imageIcon
      ? `${RA_IMAGE_BASE}${info.imageIcon.startsWith('/') ? '' : '/'}${info.imageIcon}`
      : 'retrotrack';

    await rpcClient.setActivity({
      details: info.gameTitle,
      state: `Playing on ${info.consoleName}`,
      startTimestamp: new Date(info.startedAt),
      largeImageKey,
      largeImageText: info.gameTitle,
      smallImageKey: 'retrotrack',
      smallImageText: 'RetroTrack',
      instance: false,
    });
  } catch {
    // Silently handle RPC errors
  }
}

/**
 * Set Discord Rich Presence to the idle "browsing" state.
 */
export async function setIdlePresence(): Promise<void> {
  const ok = await ensureConnected();
  if (!ok || !rpcClient) return;

  try {
    await rpcClient.setActivity({
      details: 'Selecting a game',
      largeImageKey: 'retrotrack',
      largeImageText: 'RetroTrack',
      instance: false,
    });
  } catch {
    // Silently handle
  }
}

/**
 * Clear Discord Rich Presence entirely.
 */
export async function clearDiscordPresence(): Promise<void> {
  if (!rpcClient || !connected) return;

  try {
    await rpcClient.clearActivity();
  } catch {
    // Silently handle
  }
}

/**
 * Destroy the RPC client (call on app quit).
 */
export async function destroyDiscordPresence(): Promise<void> {
  if (rpcClient) {
    try {
      await rpcClient.destroy();
    } catch {
      // Silently handle
    }
    rpcClient = null;
    connected = false;
  }
}

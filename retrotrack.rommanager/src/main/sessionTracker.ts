import { BrowserWindow } from 'electron';
import { setDiscordPresence, setIdlePresence } from './discordPresence';

export interface GameSession {
  gameId: number;
  gameTitle: string;
  consoleName: string;
  imageIcon: string | null;
  pid: number;
  startedAt: number; // Date.now()
}

let activeSession: GameSession | null = null;
let pollTimer: ReturnType<typeof setInterval> | null = null;

const POLL_INTERVAL_MS = 5_000; // check every 5 seconds if process is still alive

/**
 * Start tracking a game session. Monitors the emulator process
 * and notifies the renderer when it exits so the session duration
 * can be reported to the API.
 */
export function startSession(session: Omit<GameSession, 'startedAt'>): void {
  // End any existing session first
  if (activeSession) {
    endSession();
  }

  activeSession = { ...session, startedAt: Date.now() };

  // Set Discord Rich Presence
  setDiscordPresence({
    gameTitle: session.gameTitle,
    consoleName: session.consoleName,
    imageIcon: session.imageIcon,
    startedAt: activeSession.startedAt,
  });

  // Poll the PID to detect when the emulator closes
  pollTimer = setInterval(() => {
    if (!activeSession) {
      stopPolling();
      return;
    }

    if (!isProcessRunning(activeSession.pid)) {
      endSession();
    }
  }, POLL_INTERVAL_MS);
}

/**
 * End the current session and notify the renderer with session duration.
 */
export function endSession(): void {
  if (!activeSession) return;

  const sessionSeconds = Math.round((Date.now() - activeSession.startedAt) / 1000);
  const { gameId } = activeSession;

  // Return to idle Discord presence
  setIdlePresence();

  // Notify renderer with session data so it can call the API
  const win = BrowserWindow.getAllWindows()[0];
  if (win && !win.isDestroyed()) {
    win.webContents.send('session:ended', { gameId, sessionSeconds });
  }

  activeSession = null;
  stopPolling();
}

/**
 * Get the current active session, if any.
 */
export function getActiveSession(): GameSession | null {
  return activeSession;
}

/**
 * Force-end a session (e.g. user clicks stop, or app is quitting).
 */
export function forceEndSession(): void {
  endSession();
}

function stopPolling(): void {
  if (pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
}

/**
 * Check if a process with the given PID is still running.
 */
function isProcessRunning(pid: number): boolean {
  try {
    // Sending signal 0 tests if the process exists without killing it
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

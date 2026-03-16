import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useLibraryData } from '../helpers/useLibraryData';
import { useInvalidateScannedGames } from '../helpers/useScannedGames';
import { useMutationPost } from '../helpers/mutations/useMutationPost';
import { useMutationDelete } from '../helpers/mutations/useMutationDelete';
import { QueryKeys } from '../helpers/queryKeys';

interface Props {
  gameId: number;
  playlistId?: string;
  x: number;
  y: number;
  onClose: () => void;
  onPlay?: () => void;
}

export default function GameContextMenu({ gameId, playlistId, x, y, onClose, onPlay }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x, y });
  const queryClient = useQueryClient();
  const { data: libraryData } = useLibraryData();
  const invalidateScanned = useInvalidateScannedGames();
  const [showPlaylistSub, setShowPlaylistSub] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'remove-library' | 'delete-disk' | null>(null);

  // Clamp to viewport after the menu renders
  useLayoutEffect(() => {
    if (!ref.current) return;
    const { offsetWidth: w, offsetHeight: h } = ref.current;
    const clampedX = Math.min(x, window.innerWidth - w - 8);
    const clampedY = Math.min(y, window.innerHeight - h - 8);
    setPos({ x: Math.max(8, clampedX), y: Math.max(8, clampedY) });
  }, [x, y, showPlaylistSub, confirmAction]);

  const trackedGames = libraryData?.trackedGames ?? [];
  const playlists = libraryData?.playlists ?? [];
  const isTracked = trackedGames.some((g) => g.gameId === gameId && g.isTracked);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (confirmAction) setConfirmAction(null);
        else onClose();
      }
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [onClose, confirmAction]);

  const trackMutation = useMutationPost<void, void>({
    url: `/api/TrackedGames/AddTrackedGame/${gameId}`,
    queryKey: [QueryKeys.LibraryData],
    invalidateQuery: true,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.GameDetail, gameId] });
      onClose();
    },
  });

  const untrackMutation = useMutationDelete<void, void>({
    url: `/api/TrackedGames/DeleteTrackedGame/${gameId}`,
    queryKey: [QueryKeys.LibraryData],
    invalidateQuery: true,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.GameDetail, gameId] });
      onClose();
    },
  });

  const addToPlaylistMutation = useMutationPost<{ gameId: number; playlistId: string }, void>({
    url: '/api/Playlists/AddGameToPlaylist',
    queryKey: [QueryKeys.LibraryData],
    invalidateQuery: true,
    onSuccess: () => onClose(),
  });

  const removeFromPlaylistMutation = useMutationDelete<{ playlistId: string; gameIds: number[] }, void>({
    url: '/api/Playlists/RemoveGamesFromPlaylist',
    queryKey: [QueryKeys.LibraryData],
    invalidateQuery: true,
    onSuccess: () => onClose(),
  });

  const handlePlay = () => {
    onClose();
    onPlay?.();
  };

  const handleTrackToggle = () => {
    if (isTracked) untrackMutation.mutate();
    else trackMutation.mutate();
  };

  const handleRemoveFromLibrary = async () => {
    await window.electron.scanner.removeScannedGame(gameId);
    invalidateScanned();
    onClose();
  };

  const handleDeleteFromDisk = async () => {
    const filePaths = await window.electron.scanner.getGameFilePaths(gameId);
    if (filePaths.length > 0) {
      await window.electron.shell.deleteFiles(filePaths);
    }
    await window.electron.scanner.removeScannedGame(gameId);
    invalidateScanned();
    onClose();
  };

  const handleOpenFileLocation = async () => {
    const filePaths = await window.electron.scanner.getGameFilePaths(gameId);
    if (filePaths.length > 0) {
      await window.electron.shell.showItemInFolder(filePaths[0]);
    }
    onClose();
  };

  // Confirmation dialogs
  if (confirmAction === 'remove-library') {
    return createPortal(
      <div ref={ref} className="context-menu" style={{ top: pos.y, left: pos.x }}>
        <div className="context-menu-confirm">
          <p>Remove this game from your library?</p>
          <p className="context-menu-confirm-sub">The ROM file will not be deleted.</p>
        </div>
        <div className="context-menu-confirm-actions">
          <button className="context-menu-item" onClick={() => setConfirmAction(null)}>
            Cancel
          </button>
          <button className="context-menu-item context-menu-item--danger" onClick={handleRemoveFromLibrary}>
            Remove
          </button>
        </div>
      </div>,
      document.body,
    );
  }

  if (confirmAction === 'delete-disk') {
    return createPortal(
      <div ref={ref} className="context-menu" style={{ top: pos.y, left: pos.x }}>
        <div className="context-menu-confirm">
          <p>Delete this game from disk?</p>
          <p className="context-menu-confirm-sub">The ROM file(s) will be permanently deleted. This cannot be undone.</p>
        </div>
        <div className="context-menu-confirm-actions">
          <button className="context-menu-item" onClick={() => setConfirmAction(null)}>
            Cancel
          </button>
          <button className="context-menu-item context-menu-item--danger" onClick={handleDeleteFromDisk}>
            Delete
          </button>
        </div>
      </div>,
      document.body,
    );
  }

  // Playlist sub-menu
  if (showPlaylistSub) {
    const availablePlaylists = playlists.filter((pl) => !pl.gameIds.includes(gameId));
    return createPortal(
      <div ref={ref} className="context-menu" style={{ top: pos.y, left: pos.x }}>
        <button className="context-menu-item" onClick={() => setShowPlaylistSub(false)}>
          ← Back
        </button>
        <div className="context-menu-separator" />
        {availablePlaylists.length === 0 ? (
          <div className="context-menu-item context-menu-item--disabled">
            Already in all playlists
          </div>
        ) : (
          availablePlaylists.map((pl) => (
            <button
              key={pl.playlistId}
              className="context-menu-item"
              onClick={() => addToPlaylistMutation.mutate({ gameId, playlistId: pl.playlistId })}
            >
              {pl.name}
            </button>
          ))
        )}
      </div>,
      document.body,
    );
  }

  return createPortal(
    <div ref={ref} className="context-menu" style={{ top: pos.y, left: pos.x }}>
      {onPlay && (
        <>
          <button className="context-menu-item" onClick={handlePlay}>
            ▶&nbsp;&nbsp;Play
          </button>
          <div className="context-menu-separator" />
        </>
      )}
      <button className="context-menu-item" onClick={handleTrackToggle}>
        {isTracked ? '★\u00a0\u00a0Remove from Tracked Games' : '☆\u00a0\u00a0Add to Tracked Games'}
      </button>
      <button className="context-menu-item" onClick={() => setShowPlaylistSub(true)}>
        +&nbsp;&nbsp;Add to Playlist...
      </button>
      {playlistId !== undefined && (
        <button className="context-menu-item" onClick={() => removeFromPlaylistMutation.mutate({ playlistId: playlistId!, gameIds: [gameId] })}>
          −&nbsp;&nbsp;Remove from Playlist
        </button>
      )}
      <div className="context-menu-separator" />
      <button
        className="context-menu-item context-menu-item--danger"
        onClick={() => setConfirmAction('remove-library')}
      >
        Remove from Library
      </button>
      <button
        className="context-menu-item context-menu-item--danger"
        onClick={() => setConfirmAction('delete-disk')}
      >
        Delete Game from Disk
      </button>
      <div className="context-menu-separator" />
      <button className="context-menu-item" onClick={handleOpenFileLocation}>
        📁&nbsp;&nbsp;Open File Location
      </button>
    </div>,
    document.body,
  );
}

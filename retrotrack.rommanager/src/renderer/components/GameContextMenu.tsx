import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { getGameById } from '../mockData';

interface Props {
  gameId: number;
  playlistId?: number;
  x: number;
  y: number;
  onClose: () => void;
}

export default function GameContextMenu({ gameId, playlistId, x, y, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const game = getGameById(gameId);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  if (!game) return null;

  const act = (label: string) => () => {
    console.log(`[RetroTrack] ${label}: ${game.title}`);
    onClose();
  };

  return createPortal(
    <div ref={ref} className="context-menu" style={{ top: y, left: x }}>
      <button className="context-menu-item" onClick={act('Play')}>
        ▶&nbsp;&nbsp;Play
      </button>
      <div className="context-menu-separator" />
      {game.favorite ? (
        <button className="context-menu-item" onClick={act('Remove from Favourites')}>
          ★&nbsp;&nbsp;Remove from Favourites
        </button>
      ) : (
        <button className="context-menu-item" onClick={act('Add to Favourites')}>
          ☆&nbsp;&nbsp;Add to Favourites
        </button>
      )}
      <button className="context-menu-item" onClick={act('Add to Playlist')}>
        +&nbsp;&nbsp;Add to Playlist...
      </button>
      {playlistId !== undefined && (
        <button className="context-menu-item" onClick={act('Remove from Playlist')}>
          −&nbsp;&nbsp;Remove from Playlist
        </button>
      )}
      <div className="context-menu-separator" />
      <button
        className="context-menu-item context-menu-item--danger"
        onClick={act('Remove from Library')}
      >
        Remove from Library
      </button>
      <button
        className="context-menu-item context-menu-item--danger"
        onClick={act('Delete from Disk')}
      >
        Delete Game from Disk
      </button>
      <div className="context-menu-separator" />
      <button className="context-menu-item" onClick={act('Open File Location')}>
        📁&nbsp;&nbsp;Open File Location
      </button>
    </div>,
    document.body,
  );
}

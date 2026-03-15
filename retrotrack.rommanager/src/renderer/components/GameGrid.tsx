import { useCallback, useState } from 'react';

import { useLibraryData } from '../helpers/useLibraryData';
import { useScannedGameIds, useScannedConsoleIds, useScannedGamesAsLibrary } from '../helpers/useScannedGames';
import { getConsoleTypeIcon } from '../enums/consoleType';
import { DEFAULT_VIEW_CONFIG, type ViewConfig } from './game-grid/viewConfig';
import GameSection, { SectionHeader } from './game-grid/GameSection';
import HomeView from './game-grid/HomeView';
import GameContextMenu from './GameContextMenu';

interface GameGridProps {
  selectedView: string;
  onGameClick?: (gameId: number) => void;
  onSelectView?: (view: string) => void;
  searchQuery?: string;
}

interface ContextMenuState {
  gameId: number;
  x: number;
  y: number;
  playlistId?: string;
}

function SectionView({ children }: { children: React.ReactNode }) {
  return <div className="game-grid-container">{children}</div>;
}

export default function GameGrid({ selectedView, onGameClick, onSelectView, searchQuery }: GameGridProps) {
  const [viewConfigs, setViewConfigs] = useState<Record<string, ViewConfig>>({});
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const { data: libraryData } = useLibraryData();
  const scannedGameIds = useScannedGameIds();
  const scannedConsoleIds = useScannedConsoleIds();
  const scannedGames = useScannedGamesAsLibrary();

  const trackedGames = (libraryData?.trackedGames ?? []).filter((g) => scannedGameIds.has(g.gameId));

  const getConfig = useCallback(
    (key: string): ViewConfig => viewConfigs[key] ?? DEFAULT_VIEW_CONFIG,
    [viewConfigs],
  );

  const setConfig = useCallback(
    (key: string) => (cfg: ViewConfig) =>
      setViewConfigs((prev) => ({ ...prev, [key]: cfg })),
    [],
  );

  const openContextMenu = (e: React.MouseEvent, gameId: number, playlistId?: string) => {
    e.preventDefault();
    setContextMenu({ gameId, x: e.clientX, y: e.clientY, playlistId });
  };

  const handlePlay = (gameId: number) => {
    onGameClick?.(gameId);
  };

  const contextMenuEl = contextMenu && (
    <GameContextMenu
      gameId={contextMenu.gameId}
      playlistId={contextMenu.playlistId}
      x={contextMenu.x}
      y={contextMenu.y}
      onClose={() => setContextMenu(null)}
      onPlay={() => handlePlay(contextMenu.gameId)}
    />
  );

  // Search: filter all available games by name
  const trimmedSearch = searchQuery?.trim().toLowerCase() ?? '';
  if (trimmedSearch.length > 0) {
    const trackedMap = new Map(trackedGames.map((g) => [g.gameId, g]));
    const allGames = scannedGames.map((g) => trackedMap.get(g.gameId) ?? g);
    const filtered = allGames.filter((g) => g.title.toLowerCase().includes(trimmedSearch));
    const cfgKey = 'search';
    return (
      <>
        <SectionView>
          <GameSection
            title={`Search results for "${searchQuery!.trim()}"`}
            games={filtered}
            config={getConfig(cfgKey)}
            onConfigChange={setConfig(cfgKey)}
            onGameClick={onGameClick}
            onGameContextMenu={(e, gid) => openContextMenu(e, gid)}
          />
        </SectionView>
        {contextMenuEl}
      </>
    );
  }

  if (selectedView === 'home' || selectedView === '') {
    return (
      <>
        <HomeView
          onGameClick={onGameClick}
          onSelectView={onSelectView}
          onGameContextMenu={(e, gid) => openContextMenu(e, gid)}
        />
        {contextMenuEl}
      </>
    );
  }

  if (selectedView === 'consoles') {
    const consoles = libraryData?.consoles ?? [];
    return (
      <SectionView>
        <SectionHeader title="All Consoles" count={consoles.length} />
        <div className="browse-card-grid">
          {consoles.map((c) => {
            const hasGames = scannedConsoleIds.has(c.consoleId);
            return (
              <button
                key={c.consoleId}
                type="button"
                className={`browse-card ${!hasGames ? 'browse-card--disabled' : ''}`}
                title={!hasGames ? 'No games are scanned for this console' : undefined}
                onClick={() => hasGames && onSelectView?.(`console-${c.consoleId}`)}
                style={!hasGames ? { cursor: 'default' } : undefined}
              >
                <span className="browse-card-icon">{getConsoleTypeIcon(c.consoleType)}</span>
                <span className="browse-card-name">{c.consoleName}</span>
              </button>
            );
          })}
        </div>
      </SectionView>
    );
  }

  if (selectedView === 'playlists') {
    const playlists = libraryData?.playlists ?? [];
    return (
      <SectionView>
        <SectionHeader title="RetroTrack Playlists" count={playlists.length} />
        <div className="browse-card-grid">
          {playlists.map((pl) => (
            <button
              key={pl.playlistId}
              type="button"
              className="browse-card"
              onClick={() => onSelectView?.(`playlist-${pl.playlistId}`)}
            >
              <span className="browse-card-icon">{pl.icon}</span>
              <span className="browse-card-name">{pl.name}</span>
              <span className="browse-card-meta">{pl.gameIds.length} games</span>
            </button>
          ))}
        </div>
      </SectionView>
    );
  }

  if (selectedView === 'tracked') {
    return (
      <>
        <SectionView>
          <GameSection
            title="MY TRACKED GAMES"
            games={trackedGames}
            config={getConfig('tracked')}
            onConfigChange={setConfig('tracked')}
            onGameClick={onGameClick}
            onGameContextMenu={(e, gid) => openContextMenu(e, gid)}
          />
        </SectionView>
        {contextMenuEl}
      </>
    );
  }

  const consoleMatch = selectedView.match(/^console-(\d+)$/);
  if (consoleMatch) {
    const consoleId = Number(consoleMatch[1]);
    const consoleScanned = scannedGames.filter((g) => g.consoleId === consoleId);

    // Prefer library data for console info (has icon type), fall back to scanned game data
    const consoleInfo = libraryData?.consoles.find((c) => c.consoleId === consoleId);
    const consoleName = consoleInfo?.consoleName ?? consoleScanned[0]?.consoleName ?? `Console ${consoleId}`;
    const consoleIcon = consoleInfo ? getConsoleTypeIcon(consoleInfo.consoleType) : '🎮';

    const cfgKey = `console-${consoleId}`;
    const trackedMap = new Map(trackedGames.map((g) => [g.gameId, g]));
    const games = consoleScanned.map((g) => trackedMap.get(g.gameId) ?? g);
    return (
      <>
        <SectionView>
          <GameSection
            title={`${consoleIcon} ${consoleName}`}
            games={games}
            config={getConfig(cfgKey)}
            onConfigChange={setConfig(cfgKey)}
            onGameClick={onGameClick}
            onGameContextMenu={(e, gid) => openContextMenu(e, gid)}
          />
        </SectionView>
        {contextMenuEl}
      </>
    );
  }

  const plMatch = selectedView.match(/^playlist-(.+)$/);
  if (plMatch) {
    const plId = plMatch[1];
    const pl = libraryData?.playlists.find((p) => p.playlistId === plId);
    if (pl) {
      const games = trackedGames.filter((g) => pl.gameIds.includes(g.gameId));
      const cfgKey = `playlist-${plId}`;
      return (
        <>
          <SectionView>
            <GameSection
              title={`${pl.name}`}
              games={games}
              config={getConfig(cfgKey)}
              onConfigChange={setConfig(cfgKey)}
              onGameClick={onGameClick}
              onGameContextMenu={(e, gid) => openContextMenu(e, gid, plId)}
            />
          </SectionView>
          {contextMenuEl}
        </>
      );
    }
  }

  return (
    <>
      <HomeView
        onGameClick={onGameClick}
        onSelectView={onSelectView}
        onGameContextMenu={(e, gid) => openContextMenu(e, gid)}
      />
      {contextMenuEl}
    </>
  );
}

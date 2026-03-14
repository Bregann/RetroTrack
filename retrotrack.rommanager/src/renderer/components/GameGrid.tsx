import { useCallback, useState } from 'react';
import {
  CUSTOM_CATEGORIES,
  getGameById,
} from '../mockData';
import { useLibraryData } from '../helpers/useLibraryData';
import { getConsoleTypeIcon } from '../enums/consoleType';
import { DEFAULT_VIEW_CONFIG, type ViewConfig } from './game-grid/viewConfig';
import GameSection, { SectionHeader } from './game-grid/GameSection';
import HomeView from './game-grid/HomeView';

interface GameGridProps {
  selectedView: string;
  onGameClick?: (gameId: number) => void;
  onSelectView?: (view: string) => void;
}

function SectionView({ children }: { children: React.ReactNode }) {
  return <div className="game-grid-container">{children}</div>;
}

export default function GameGrid({ selectedView, onGameClick, onSelectView }: GameGridProps) {
  const [viewConfigs, setViewConfigs] = useState<Record<string, ViewConfig>>({});
  const { data: libraryData } = useLibraryData();

  const getConfig = useCallback(
    (key: string): ViewConfig => viewConfigs[key] ?? DEFAULT_VIEW_CONFIG,
    [viewConfigs],
  );

  const setConfig = useCallback(
    (key: string) => (cfg: ViewConfig) =>
      setViewConfigs((prev) => ({ ...prev, [key]: cfg })),
    [],
  );

  if (selectedView === 'home' || selectedView === '') {
    return <HomeView onGameClick={onGameClick} onSelectView={onSelectView} />;
  }

  if (selectedView === 'consoles') {
    const consoles = libraryData?.consoles ?? [];
    return (
      <SectionView>
        <SectionHeader title="All Consoles" count={consoles.length} />
        <div className="browse-card-grid">
          {consoles.map((c) => (
            <button
              key={c.consoleId}
              type="button"
              className="browse-card"
              onClick={() => onSelectView?.(`console-${c.consoleId}`)}
            >
              <span className="browse-card-icon">{getConsoleTypeIcon(c.consoleType)}</span>
              <span className="browse-card-name">{c.consoleName}</span>
            </button>
          ))}
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
      <SectionView>
        <GameSection
          title="MY TRACKED GAMES"
          games={libraryData?.trackedGames ?? []}
          config={getConfig('tracked')}
          onConfigChange={setConfig('tracked')}
          onGameClick={onGameClick}
        />
      </SectionView>
    );
  }

  const consoleMatch = selectedView.match(/^console-(\d+)$/);
  if (consoleMatch) {
    const consoleId = Number(consoleMatch[1]);
    const consoleInfo = libraryData?.consoles.find((c) => c.consoleId === consoleId);
    if (consoleInfo) {
      const cfgKey = `console-${consoleId}`;
      const games = (libraryData?.trackedGames ?? []).filter((g) => g.consoleId === consoleId);
      return (
        <SectionView>
          <GameSection
            title={`${getConsoleTypeIcon(consoleInfo.consoleType)} ${consoleInfo.consoleName}`}
            games={games}
            config={getConfig(cfgKey)}
            onConfigChange={setConfig(cfgKey)}
            onGameClick={onGameClick}
          />
        </SectionView>
      );
    }
  }

  const catMatch = selectedView.match(/^cat-(\d+)$/);
  if (catMatch) {
    const cat = CUSTOM_CATEGORIES.find((c) => c.id === Number(catMatch[1]));
    if (cat) {
      const games = cat.gameIds.map((id) => getGameById(id)).filter(Boolean) as Game[];
      const cfgKey = `cat-${cat.id}`;
      return (
        <SectionView>
          <GameSection
            title={`${cat.icon} ${cat.name}`}
            games={games}
            config={getConfig(cfgKey)}
            onConfigChange={setConfig(cfgKey)}
            onGameClick={onGameClick}
          />
        </SectionView>
      );
    }
  }

  const plMatch = selectedView.match(/^playlist-(\d+)$/);
  if (plMatch) {
    const plId = Number(plMatch[1]);
    const pl = libraryData?.playlists.find((p) => p.playlistId === plId);
    if (pl) {
      const games = (libraryData?.trackedGames ?? []).filter((g) =>
        pl.gameIds.includes(g.gameId),
      );
      const cfgKey = `playlist-${plId}`;
      return (
        <SectionView>
          <GameSection
            title={`${pl.icon} ${pl.name}`}
            games={games}
            config={getConfig(cfgKey)}
            onConfigChange={setConfig(cfgKey)}
            onGameClick={onGameClick}
          />
        </SectionView>
      );
    }
  }

  return <HomeView onGameClick={onGameClick} onSelectView={onSelectView} />;
}

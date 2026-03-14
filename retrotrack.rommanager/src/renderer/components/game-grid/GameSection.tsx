import type { LibraryTrackedGame } from '../../helpers/libraryTypes';
import GameCard from './GameCard';
import GameListView from './GameListView';
import SectionToolbar from './SectionToolbar';
import type { ViewConfig, SortField } from './viewConfig';

export function SectionHeader({ title, count }: { title: string; count?: number }) {
  return (
    <div className="section-header">
      <h2>
        {title}
        {count !== undefined && <span className="section-count"> ({count} GAMES)</span>}
      </h2>
    </div>
  );
}

function deriveStatus(game: LibraryTrackedGame): 'completed' | 'in-progress' | 'not-started' {
  if (game.percentageComplete === 100) return 'completed';
  if (game.achievementsEarned > 0) return 'in-progress';
  return 'not-started';
}

const STATUS_ORDER = { completed: 2, 'in-progress': 1, 'not-started': 0 } as const;

function sortGames(games: LibraryTrackedGame[], field: SortField, dir: 'asc' | 'desc'): LibraryTrackedGame[] {
  return [...games].sort((a, b) => {
    let cmp = 0;
    switch (field) {
      case 'title':
        cmp = a.title.localeCompare(b.title);
        break;
      case 'console':
        cmp = a.consoleName.localeCompare(b.consoleName);
        break;
      case 'achievementPercent':
        cmp = a.percentageComplete - b.percentageComplete;
        break;
      case 'status':
        cmp = STATUS_ORDER[deriveStatus(a)] - STATUS_ORDER[deriveStatus(b)];
        break;
      default:
        break;
    }
    return dir === 'asc' ? cmp : -cmp;
  });
}

interface GameSectionProps {
  title: string;
  games: LibraryTrackedGame[];
  config: ViewConfig;
  onConfigChange: (c: ViewConfig) => void;
  onGameClick?: (gameId: number) => void;
}

export default function GameSection({
  title,
  games,
  config,
  onConfigChange,
  onGameClick,
}: GameSectionProps) {
  const sorted = sortGames(games, config.sort.field, config.sort.dir);

  const handleSortChange = (field: SortField) =>
    onConfigChange({
      ...config,
      sort: {
        field,
        dir: config.sort.field === field && config.sort.dir === 'asc' ? 'desc' : 'asc',
      },
    });

  return (
    <>
      <SectionToolbar
        title={title}
        count={games.length}
        config={config}
        onConfigChange={onConfigChange}
      />
      {games.length === 0 ? (
        <div className="empty-section">
          <span className="empty-section__icon">📂</span>
          <p className="empty-section__text">No games found — scan a folder to add ROMs to your library.</p>
        </div>
      ) : config.mode === 'list' ? (
        <GameListView
          games={sorted}
          columns={config.columns}
          sort={config.sort}
          onSortChange={handleSortChange}
          onGameClick={onGameClick}
        />
      ) : (
        <div className="game-grid">
          {sorted.map((g) => (
            <GameCard key={g.gameId} game={g} onClick={() => onGameClick?.(g.gameId)} />
          ))}
        </div>
      )}
    </>
  );
}

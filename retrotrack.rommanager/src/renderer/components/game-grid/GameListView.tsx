import type { LibraryTrackedGame } from '../../helpers/libraryTypes';
import { raImageUrl } from '../../helpers/imageUrl';
import type { ListColumn, SortConfig, SortField } from './viewConfig';
import { ALL_COLUMNS } from './viewConfig';

const SORTABLE: Partial<Record<ListColumn, SortField>> = {
  title: 'title',
  console: 'console',
  status: 'status',
  achievementsUnlocked: 'achievementsUnlocked',
  achievementsTotal: 'achievementsTotal',
  achievementPercent: 'achievementPercent',
  lastPlayed: 'lastPlayed',
};

interface Props {
  games: LibraryTrackedGame[];
  columns: ListColumn[];
  sort: SortConfig;
  onSortChange: (field: SortField) => void;
  onGameClick?: (gameId: number) => void;
  onGameContextMenu?: (e: React.MouseEvent, gameId: number) => void;
}

function deriveStatus(game: LibraryTrackedGame): 'completed' | 'in-progress' | 'not-started' {
  if (game.percentageComplete === 100) return 'completed';
  if (game.achievementsEarned > 0) return 'in-progress';
  return 'not-started';
}

function formatStatus(game: LibraryTrackedGame) {
  const s = deriveStatus(game);
  if (s === 'in-progress') return 'In Progress';
  if (s === 'completed') return 'Completed';
  return 'Not Started';
}

function statusClass(game: LibraryTrackedGame) {
  const s = deriveStatus(game);
  if (s === 'in-progress') return 'gl-status gl-status-progress';
  if (s === 'completed') return 'gl-status gl-status-complete';
  return 'gl-status gl-status-not-started';
}

function CellValue({ game, col }: { game: LibraryTrackedGame; col: ListColumn }) {
  switch (col) {
    case 'title': {
      const iconUrl = raImageUrl(game.imageIcon);
      return (
        <span className="gl-cell-title">
          {iconUrl && <img src={iconUrl} alt="" className="gl-game-icon" />}
          {game.title}
        </span>
      );
    }
    case 'console':
      return <span>{game.consoleName}</span>;
    case 'status':
      return <span className={statusClass(game)}>{formatStatus(game)}</span>;
    case 'achievementsUnlocked':
      return game.achievementCount === 0
        ? <span className="gl-cell-na">—</span>
        : <span>{game.achievementsEarned}</span>;
    case 'achievementsTotal':
      return game.achievementCount === 0
        ? <span className="gl-cell-na">—</span>
        : <span>{game.achievementCount}</span>;
    case 'achievementPercent':
      return game.achievementCount > 0
        ? <span>{Math.round(game.percentageComplete * 10) / 10}%</span>
        : <span className="gl-cell-na">—</span>;
    case 'lastPlayed': {
      if (!game.lastPlayedUtc) return <span className="gl-cell-na">—</span>;
      const d = new Date(game.lastPlayedUtc);
      const now = new Date();
      const diffMs = now.getTime() - d.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);
      let label: string;
      if (diffMins < 2) label = 'just now';
      else if (diffMins < 60) label = `${diffMins} minutes ago`;
      else if (diffHours < 2) label = '1 hour ago';
      else if (diffHours < 24) label = `${diffHours} hours ago`;
      else if (diffDays === 1) label = 'yesterday';
      else if (diffDays < 30) label = `${diffDays} days ago`;
      else label = d.toLocaleDateString();
      return <span title={d.toLocaleString()}>{label}</span>;
    }
    case 'favourite':
      return <span>—</span>;
    default:
      return <span>—</span>;
  }
}

export default function GameListView({ games, columns, sort, onSortChange, onGameClick, onGameContextMenu }: Props) {
  const colDefs = columns.map((key) => ALL_COLUMNS.find((c) => c.key === key)!);

  return (
    <div className="gl-table-wrap">
      <table className="gl-table">
        <thead>
          <tr>
            {colDefs.map((col) => {
              const sortField = SORTABLE[col.key];
              const isActive = sortField !== undefined && sort.field === sortField;
              return (
                <th
                  key={col.key}
                  className={`gl-th gl-th-${col.key}${sortField ? ' gl-th-sortable' : ''}${isActive ? ' gl-th-active' : ''}`}
                  onClick={sortField ? () => onSortChange(sortField) : undefined}
                >
                  {col.label}
                  {isActive && (
                    <span className="gl-sort-arrow">{sort.dir === 'asc' ? ' ↑' : ' ↓'}</span>
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {games.map((game) => (
            <tr
              key={game.gameId}
              className="gl-row"
              onClick={() => onGameClick?.(game.gameId)}
              onContextMenu={(e) => { e.preventDefault(); onGameContextMenu?.(e, game.gameId); }}
            >
              {columns.map((col) => (
                <td key={col} className={`gl-td gl-td-${col}`}>
                  <CellValue game={game} col={col} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

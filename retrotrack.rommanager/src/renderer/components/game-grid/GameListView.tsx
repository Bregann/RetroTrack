import type { LibraryTrackedGame } from '../../helpers/libraryTypes';
import type { ListColumn, SortConfig, SortField } from './viewConfig';
import { ALL_COLUMNS } from './viewConfig';

const SORTABLE: Partial<Record<ListColumn, SortField>> = {
  title: 'title',
  console: 'console',
  status: 'status',
  achievementPercent: 'achievementPercent',
};

interface Props {
  games: LibraryTrackedGame[];
  columns: ListColumn[];
  sort: SortConfig;
  onSortChange: (field: SortField) => void;
  onGameClick?: (gameId: number) => void;
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
    case 'title':
      return <span className="gl-cell-title">{game.title}</span>;
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
        ? <span>{game.percentageComplete}%</span>
        : <span className="gl-cell-na">—</span>;
    case 'lastPlayed':
      return <span className="gl-cell-na">—</span>;
    case 'favorite':
      return <span>—</span>;
    default:
      return <span>—</span>;
  }
}

export default function GameListView({ games, columns, sort, onSortChange, onGameClick }: Props) {
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

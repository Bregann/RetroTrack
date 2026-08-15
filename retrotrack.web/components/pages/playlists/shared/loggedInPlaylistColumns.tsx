import { Badge, Progress, Text } from '@mantine/core'
import type { Column } from '@/components/shared/PaginatedTable'
import { LoggedInGameItem } from '@/interfaces/api/playlists/GetLoggedInPlaylistDataResponse'
import awardHelper from '@/helpers/awardHelper'
import {
  getConsoleColumn,
  getCountColumns,
  getGameIconColumn,
  getGenreColumn,
  getMedianTimeColumns,
  getOrderIndexColumn,
  getTitleColumn
} from './playlistColumns'

interface ColumnOptions {
  /** Clicking a genre badge searches for it, so the table drives search state */
  onGenreClick: (_genre: string) => void
}

/** Per-user award, shown only on the logged-in table. */
function getStatusColumn(): Column<LoggedInGameItem> {
  return {
    title: 'Status',
    key: 'highestAward',
    sortable: true,
    render: (game) => {
      const hasStarted = game.achievementsEarnedSoftcore > 0 || game.achievementsEarnedHardcore > 0
      // Checked against undefined rather than falsiness: BeatenSoftcore is 0, so a
      // truthiness test would report a genuinely beaten game as merely "Started"
      const isNotStartedButHasProgress = game.highestAward === undefined && hasStarted

      return (
        <div style={{ minWidth: '165px' }}>
          <Badge
            color={isNotStartedButHasProgress ? 'cyan' : awardHelper.getAwardColour(game.highestAward)}
            variant="light"
            leftSection={awardHelper.getAwardIcon(game.highestAward)}
          >
            {isNotStartedButHasProgress ? 'Started' : awardHelper.getAwardLabel(game.highestAward)}
          </Badge>
        </div>
      )
    }
  }
}

/** Achievements earned against the game's total, shown only on the logged-in table. */
function getProgressColumn(): Column<LoggedInGameItem> {
  return {
    title: 'Progress',
    key: 'achievementsEarnedHardcore',
    sortable: true,
    toggleDescFirst: true,
    render: (game) => {
      const totalEarned = Math.max(game.achievementsEarnedSoftcore, game.achievementsEarnedHardcore)
      const achievementPercentage = game.achievementCount > 0 ? (totalEarned / game.achievementCount) * 100 : 0
      const isHardcore = game.achievementsEarnedHardcore > game.achievementsEarnedSoftcore
      return (
        <div style={{ minWidth: '120px' }}>
          <Progress
            value={achievementPercentage}
            size="sm"
            mb="xs"
            color={isHardcore ? 'yellow' : 'blue'}
          />
          <Text size="xs" c="dimmed" ta="center">
            {totalEarned} / {game.achievementCount}
          </Text>
        </div>
      )
    }
  }
}

/**
 * The logged-in playlist table: the shared columns plus per-user status and
 * progress. Achievements is pulled out of the shared count columns here so the
 * progress bar can sit directly beside it.
 */
export function getLoggedInPlaylistColumns(
  options: ColumnOptions
): Column<LoggedInGameItem>[] {
  const [achievements, ...otherCounts] = getCountColumns<LoggedInGameItem>()

  return [
    getGameIconColumn(),
    getOrderIndexColumn(),
    getTitleColumn(),
    getConsoleColumn(),
    getGenreColumn(options),
    getStatusColumn(),
    achievements,
    getProgressColumn(),
    ...otherCounts,
    ...getMedianTimeColumns()
  ]
}

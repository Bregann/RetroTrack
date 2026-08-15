import { Badge, Group, Image, Text } from '@mantine/core'
import tableStyles from '@/css/components/publicGamesTable.module.scss'
import type { Column } from '@/components/shared/PaginatedTable'
import { PlaylistGameItem } from '@/interfaces/api/playlists/GetPublicPlaylistDataResponse'

/**
 * Column definitions shared by the public and logged-in playlist tables.
 *
 * Generic over the row type so the logged-in table - whose rows extend
 * PlaylistGameItem with progress fields - can reuse these without casting.
 */

interface SharedColumnOptions {
  /** Clicking a genre badge searches for it, so the table drives search state */
  onGenreClick: (_genre: string) => void
}

export function getGameIconColumn<T extends PlaylistGameItem>(): Column<T> {
  return {
    title: '',
    key: 'gameIconUrl',
    render: (game) => (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minWidth: '64px' }}>
        <Image
          src={`https://media.retroachievements.org${game.gameIconUrl}`}
          alt={game.title}
          width={64}
          height={64}
          className={tableStyles.roundedImage}
        />
      </div>
    )
  }
}

export function getOrderIndexColumn<T extends PlaylistGameItem>(): Column<T> {
  return {
    title: '#',
    key: 'orderIndex',
    sortable: true,
    render: (game) => (
      <Text fw={600} size="sm" c="dimmed" style={{ textAlign: 'center', minWidth: '40px' }}>
        {game.orderIndex}
      </Text>
    )
  }
}

export function getTitleColumn<T extends PlaylistGameItem>(): Column<T> {
  return {
    title: 'Game Title',
    key: 'title',
    sortable: true,
    render: (game) => (
      <Text fw={500}>{game.title}</Text>
    )
  }
}

export function getConsoleColumn<T extends PlaylistGameItem>(): Column<T> {
  return {
    title: 'Console',
    key: 'consoleName',
    sortable: true
  }
}

export function getGenreColumn<T extends PlaylistGameItem>({
  onGenreClick
}: SharedColumnOptions): Column<T> {
  return {
    title: 'Genre',
    key: 'genre',
    sortable: true,
    render: (game) => {
      const genres = game.genre.split(',').map(g => g.trim()).filter(g => g.length > 0)
      return (
        <div style={{ minWidth: '140px', maxWidth: '200px' }}>
          <Group gap="xs" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            {genres.map((genre) => (
              <Badge
                key={genre}
                color="blue"
                variant="light"
                size="sm"
                style={{ cursor: 'pointer' }}
                onClick={(e) => {
                  e.stopPropagation() // Prevent row click
                  onGenreClick(genre)
                }}
              >
                {genre}
              </Badge>
            ))}
          </Group>
        </div>
      )
    }
  }
}

/** Achievements, Points and Players - plain sortable counts with no custom render */
export function getCountColumns<T extends PlaylistGameItem>(): Column<T>[] {
  return [
    {
      title: 'Achievements',
      key: 'achievementCount',
      sortable: true,
      toggleDescFirst: true
    },
    {
      title: 'Points',
      key: 'points',
      sortable: true,
      toggleDescFirst: true
    },
    {
      title: 'Players',
      key: 'players',
      sortable: true,
      toggleDescFirst: true
    }
  ]
}

export function getMedianTimeColumns<T extends PlaylistGameItem>(): Column<T>[] {
  return [
    {
      title: 'Time to Beat',
      key: 'medianTimeToBeatHardcoreSeconds',
      sortable: true,
      toggleDescFirst: true,
      render: (game) => game.medianTimeToBeatHardcoreFormatted ?? 'N/A'
    },
    {
      title: 'Time to Master',
      key: 'medianTimeToMasterSeconds',
      sortable: true,
      toggleDescFirst: true,
      render: (game) => game.medianTimeToMasterFormatted ?? 'N/A'
    }
  ]
}

/** The public playlist table: no per-user status or progress columns. */
export function getPublicPlaylistColumns(
  options: SharedColumnOptions
): Column<PlaylistGameItem>[] {
  return [
    getGameIconColumn(),
    getOrderIndexColumn(),
    getTitleColumn(),
    getConsoleColumn(),
    getGenreColumn(options),
    ...getCountColumns(),
    ...getMedianTimeColumns()
  ]
}

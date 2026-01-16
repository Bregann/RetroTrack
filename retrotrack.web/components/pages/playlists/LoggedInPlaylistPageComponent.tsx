'use client'

import {
  Container,
  Group,
  Stack,
  Text,
  Card,
  Image,
  SimpleGrid,
  Button,
  Progress,
  Box,
  ActionIcon,
  Title,
  Badge,
  TextInput,
  Loader,
  Center,
  Select
} from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import {
  IconTrophy,
  IconDeviceGamepad,
  IconHeart,
  IconArrowLeft,
  IconSearch,
  IconPlayerPlay,
  IconCrown,
  IconMedal,
  IconTargetArrow,
  IconEdit,
  IconTrash,
  IconList,
  IconPlus,
  IconX
} from '@tabler/icons-react'
import pageStyles from '@/css/pages/gamePage.module.scss'
import playlistStyles from '@/css/pages/playlists.module.scss'
import tableStyles from '@/css/components/publicGamesTable.module.scss'
import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import PaginatedTable from '@/components/shared/PaginatedTable'
import type { Column, SortOption } from '@/components/shared/PaginatedTable'
import { useGameModal } from '@/context/gameModalContext'
import { GetLoggedInPlaylistDataResponse, LoggedInGameItem } from '@/interfaces/api/playlists/GetLoggedInPlaylistDataResponse'
import { HighestAwardKind } from '@/enums/highestAwardKind'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { doQueryGet } from '@/helpers/apiClient'
import { useMutationApiData } from '@/helpers/mutations/useMutationApiData'
import notificationHelper from '@/helpers/notificationHelper'
import Link from 'next/link'
import EditPlaylistDetailsModal from '@/components/playlists/EditPlaylistDetailsModal'
import DeletePlaylistGamesModal from '@/components/playlists/DeletePlaylistGamesModal'
import ManageGameOrderModal from '@/components/playlists/ManageGameOrderModal'
import AddGamesToPlaylistModal from '@/components/playlists/AddGamesToPlaylistModal'

interface LoggedInPlaylistPageProps {
  playlistId: string
}

function getAwardColor(award?: HighestAwardKind): string {
  switch (award) {
    case HighestAwardKind.Mastered: return 'yellow'
    case HighestAwardKind.Completed: return 'blue'
    case HighestAwardKind.BeatenHardcore: return 'red'
    case HighestAwardKind.BeatenSoftcore: return 'orange'
    default: return 'gray'
  }
}

function getAwardIcon(award?: HighestAwardKind) {
  switch (award) {
    case HighestAwardKind.Mastered: return <IconCrown size={16} />
    case HighestAwardKind.Completed: return <IconMedal size={16} />
    case HighestAwardKind.BeatenHardcore: return <IconTargetArrow size={16} />
    case HighestAwardKind.BeatenSoftcore: return <IconPlayerPlay size={16} />
    default: return <IconDeviceGamepad size={16} />
  }
}

function getAwardLabel(award?: HighestAwardKind): string {
  switch (award) {
    case HighestAwardKind.Mastered: return 'Mastered'
    case HighestAwardKind.Completed: return 'Completed'
    case HighestAwardKind.BeatenHardcore: return 'Beaten (Hardcore)'
    case HighestAwardKind.BeatenSoftcore: return 'Beaten (Softcore)'
    default: return 'Not Started'
  }
}

export function LoggedInPlaylistPage(props: LoggedInPlaylistPageProps) {
  const router = useRouter()
  const isMobile = useMediaQuery('(max-width: 768px)')
  const gameModal = useGameModal()
  const queryClient = useQueryClient()

  const [searchInput, setSearchInput] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState<string | null>(null)
  const [searchDropdownValue, setSearchDropdownValue] = useState<string>('0')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(100)
  const [editModalOpened, setEditModalOpened] = useState(false)
  const [manageGamesModalOpened, setManageGamesModalOpened] = useState(false)
  const [orderModalOpened, setOrderModalOpened] = useState(false)
  const [addGamesModalOpened, setAddGamesModalOpened] = useState(false)
  const [sortOption, setSortOption] = useState<SortOption<LoggedInGameItem>>({
    key: 'orderIndex',
    direction: 'asc',
  })

  // Build query string for API call
  const queryString = useMemo(() => {
    const skip = (page - 1) * pageSize
    const take = pageSize

    const sortKeyMap: Record<string, string> = {
      orderIndex: 'SortByIndex',
      title: 'SortByGameTitle',
      consoleName: 'SortByConsoleName',
      genre: 'SortByGenre',
      achievementCount: 'SortByAchievementCount',
      points: 'SortByPoints',
      players: 'SortByPlayers',
      highestAward: 'SortByCompletionStatus',
      achievementsEarnedHardcore: 'SortByAchievementProgress'
    }

    const sortParam = sortKeyMap[sortOption.key as string] !== undefined ? sortKeyMap[sortOption.key as string] : 'SortByIndex'
    const sortValue = sortOption.direction === 'asc'

    let query = `PlaylistId=${props.playlistId}&${sortParam}=${sortValue}&Skip=${skip}&Take=${take}`

    if (searchTerm !== null && searchTerm !== '') {
      query += `&SearchType=${searchDropdownValue}&SearchTerm=${encodeURIComponent(searchTerm)}`
    }

    return query
  }, [page, pageSize, props.playlistId, searchTerm, searchDropdownValue, sortOption.direction, sortOption.key])

  const { data: playlistData, isLoading: isLoadingPlaylistData, isError: isErrorPlaylistData } = useQuery<GetLoggedInPlaylistDataResponse>({
    queryKey: [queryString],
    queryFn: async () => await doQueryGet<GetLoggedInPlaylistDataResponse>('/api/playlists/GetLoggedInPlaylistData?'.concat(queryString)),
    staleTime: 60000
  })

  const toggleLikeMutation = useMutationApiData<null, null>({
    url: `/api/playlists/TogglePlaylistLike/${props.playlistId}`,
    queryKey: [],
    invalidateQuery: false,
    apiMethod: 'POST',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryString] })
      queryClient.invalidateQueries({ queryKey: ['getUserPlaylists'] })
      queryClient.invalidateQueries({ queryKey: ['getPublicPlaylists'] })

      queryClient.invalidateQueries({
        predicate: (query) => {
          return query.queryKey.some((key: unknown) =>
            typeof key === 'string' &&
            (key.includes('playlist') || key.includes('Playlist'))
          )
        }
      })

      notificationHelper.showSuccessNotification(
        'Success',
        'Playlist like updated!',
        2000,
        <IconHeart />
      )
    },
    onError: (error) => {
      const errorMessage = error.message !== null && error.message !== undefined && error.message.trim() !== ''
        ? error.message
        : 'Failed to update like status. Please try again.'

      notificationHelper.showErrorNotification(
        'Error',
        errorMessage,
        3000,
        <IconHeart />
      )
    }
  })

  // Table columns configuration
  const columns: Column<LoggedInGameItem>[] = [
    {
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
    },
    {
      title: '#',
      key: 'orderIndex',
      sortable: true,
      render: (game) => (
        <Text fw={600} size="sm" c="dimmed" style={{ textAlign: 'center', minWidth: '40px' }}>
          {game.orderIndex}
        </Text>
      )
    },
    {
      title: 'Game Title',
      key: 'title',
      sortable: true,
      render: (game) => (
        <Text fw={500}>{game.title}</Text>
      )
    },
    {
      title: 'Console',
      key: 'consoleName',
      sortable: true
    },
    {
      title: 'Genre',
      key: 'genre',
      sortable: true,
      render: (game) => {
        const genres = game.genre.split(',').map(g => g.trim()).filter(g => g.length > 0)
        return (
          <div style={{ minWidth: '140px', maxWidth: '200px' }}>
            <Group gap="xs" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
              {genres.map((genre, index) => (
                <Badge
                  key={index}
                  color="blue"
                  variant="light"
                  size="sm"
                  style={{ cursor: 'pointer' }}
                  onClick={(e) => {
                    e.stopPropagation() // Prevent row click
                    setSearchDropdownValue('1') // Set to Genre
                    setSearchTerm(genre)
                    setSearchInput(genre)
                    setPage(1) // Reset to first page
                  }}
                >
                  {genre}
                </Badge>
              ))}
            </Group>
          </div>
        )
      }
    },
    {
      title: 'Status',
      key: 'highestAward',
      sortable: true,
      render: (game) => {
        const hasStarted = game.achievementsEarnedSoftcore > 0 || game.achievementsEarnedHardcore > 0
        const isNotStartedButHasProgress = !game.highestAward && hasStarted

        return (
          <div style={{ minWidth: '165px' }}>
            <Badge
              color={isNotStartedButHasProgress ? 'cyan' : getAwardColor(game.highestAward)}
              variant="light"
              leftSection={getAwardIcon(game.highestAward)}
            >
              {isNotStartedButHasProgress ? 'Started' : getAwardLabel(game.highestAward)}
            </Badge>
          </div>
        )
      }
    },
    {
      title: 'Achievements',
      key: 'achievementCount',
      sortable: true,
      toggleDescFirst: true
    },
    {
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
    },
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

  if (isErrorPlaylistData && playlistData === undefined) {
    return (
      <Container size="95%" py="md">
        <Container ta="center">
          <Title order={2} pt="xl">Error</Title>
          <Text pb="lg">Sorry about that, we couldn&apos;t load the playlist data, try again later.</Text>
          <Button size="md" radius="md" variant="light" component={Link} href={'/playlists'}>Back to Playlists</Button>
        </Container>
      </Container>
    )
  }

  if (isLoadingPlaylistData && playlistData === undefined) {
    return (
      <Center style={{ height: '60vh' }}>
        <Loader size="xl" variant="dots" />
      </Center>
    )
  }

  return (
    <Container size="95%" px="md" py="xl" className={pageStyles.pageContainer}>
      {/* Header with back button */}
      <Group mb="xl">
        <Button
          variant="subtle"
          leftSection={<IconArrowLeft size={16} />}
          onClick={() => router.back()}
        >
          Back
        </Button>
      </Group>

      {/* Playlist Header */}
      <Card radius="md" p="lg" mb="xl" className={playlistStyles.playlistHeaderCard}>
        <Group align="flex-start" wrap="nowrap" gap="lg">
          {/* Playlist Cover */}
          <Box className={playlistStyles.playlistCover}>
            <div className={playlistStyles.gameIconsGrid}>
              {playlistData?.icons.slice(0, 4).map((icon, index) => (
                <div key={index} className={playlistStyles.gameIconWrapper}>
                  <Image
                    src={`https://media.retroachievements.org/${icon}`}
                    alt={`Game ${index + 1}`}
                    width={80}
                    height={80}
                    className={playlistStyles.gameIcon}
                  />
                </div>
              ))}
            </div>
          </Box>

          {/* Playlist Info */}
          <Stack style={{ flex: 1 }} gap="sm">
            <Group justify="space-between" align="flex-start">
              <div>
                <Group gap="xs" mb="xs" align="center">
                  <Title order={1} size="2rem">
                    {playlistData?.name}
                  </Title>
                  <ActionIcon
                    variant="subtle"
                    color="blue"
                    size="sm"
                    onClick={() => setEditModalOpened(true)}
                    title="Edit playlist details"
                  >
                    <IconEdit size={16} />
                  </ActionIcon>
                </Group>
                <Group gap="md" align="center" mb="sm">
                  <Text size="lg" c="dimmed">@{playlistData?.createdBy}</Text>
                  {playlistData !== undefined ? (
                    playlistData.isPlaylistOwner ? (
                      <Badge color={playlistData.isPublic ? 'green' : 'red'} variant="light">
                        My Playlist - {playlistData.isPublic ? 'Public' : 'Private'}
                      </Badge>
                    ) : (
                      <Badge color={playlistData.isPublic ? 'blue' : 'gray'} variant="light">
                        {playlistData.isPublic ? 'Public Playlist' : 'Private Playlist'}
                      </Badge>
                    )
                  ) : null}
                </Group>
              </div>

              {/* Action Buttons */}
              <Group gap="xs">
                <Button
                  leftSection={<IconHeart size={16} fill={playlistData?.isLiked === true ? 'currentColor' : 'none'} />}
                  variant={playlistData?.isLiked === true ? 'filled' : 'light'}
                  color="red"
                  onClick={async () => { await toggleLikeMutation.mutateAsync(null) }}
                  loading={toggleLikeMutation.isPending}
                  disabled={toggleLikeMutation.isPending}
                >
                  {playlistData?.numberOfLikes?.toLocaleString()} {playlistData?.isLiked === true ? 'Liked' : 'Likes'}
                </Button>
              </Group>
            </Group>

            {playlistData?.description?.trim() !== '' && (
              <Text size="md" c="dimmed" mb="md">
                {playlistData?.description}
              </Text>
            )}

            <Group gap="lg">
              <Text size="sm" c="dimmed">
                <strong>{playlistData?.numberOfGames?.toLocaleString()}</strong> games
              </Text>
              <Text size="sm" c="dimmed">
                <strong>{playlistData?.numberOfConsoles?.toLocaleString()}</strong> consoles
              </Text>
              <Text size="sm" c="dimmed">
                Created {new Date(playlistData?.createdAt ?? new Date()).toLocaleDateString()}
              </Text>
              <Text size="sm" c="dimmed">
                Updated {new Date(playlistData?.updatedAt ?? new Date()).toLocaleDateString()}
              </Text>
            </Group>
          </Stack>
        </Group>
      </Card>

      {/* Progress Stats */}
      <SimpleGrid cols={isMobile ? 2 : 4} mb="xl" spacing="md">
        <Card radius="md" p="md" className={playlistStyles.statCard}>
          <Group justify="space-between" mb="xs">
            <Text size="sm" c="dimmed">Beaten</Text>
            <Group gap={4}>
              <IconPlayerPlay size={16} color="orange" />
            </Group>
          </Group>
          <Group align="baseline" gap={4}>
            <Text size="xl" fw={700}>{((playlistData?.totalGamesBeatenHardcore ?? 0) + (playlistData?.totalGamesBeatenSoftcore ?? 0)).toLocaleString()}</Text>
            <Text size="sm" c="dimmed">/{playlistData?.totalGamesInPlaylist?.toLocaleString()}</Text>
          </Group>
          <Text size="xs" c="dimmed" mb="xs">{playlistData?.percentageBeaten}%</Text>
          <Progress value={playlistData?.percentageBeaten ?? 0} size="xs" color="orange" />
          {playlistData?.totalGamesBeatenSoftcore !== 0 && playlistData?.totalGamesBeatenHardcore !== playlistData?.totalGamesBeatenSoftcore && (
            <Text size="xs" c="dimmed" mt="xs">
              {playlistData?.totalGamesBeatenHardcore === 0
                ? `SC: ${playlistData?.totalGamesBeatenSoftcore?.toLocaleString()}`
                : `HC: ${playlistData?.totalGamesBeatenHardcore?.toLocaleString()} | SC: ${playlistData?.totalGamesBeatenSoftcore?.toLocaleString()}`}
            </Text>
          )}
        </Card>

        <Card radius="md" p="md" className={playlistStyles.statCard}>
          <Group justify="space-between" mb="xs">
            <Text size="sm" c="dimmed">Completed / Mastered</Text>
            <Group gap={4}>
              <IconMedal size={16} color="blue" />
            </Group>
          </Group>
          <Group align="baseline" gap={4}>
            <Text size="xl" fw={700}>{((playlistData?.totalGamesCompletedSoftcore ?? 0) + (playlistData?.totalGamesMasteredHardcore ?? 0)).toLocaleString()}</Text>
            <Text size="sm" c="dimmed">/{playlistData?.totalGamesInPlaylist?.toLocaleString()}</Text>
          </Group>
          <Text size="xs" c="dimmed" mb="xs">{playlistData?.percentageMastered}%</Text>
          <Progress value={playlistData?.percentageMastered ?? 0} size="xs" color="blue" />
          {playlistData?.totalGamesCompletedSoftcore !== 0 && playlistData?.totalGamesMasteredHardcore !== playlistData?.totalGamesCompletedSoftcore && (
            <Text size="xs" c="dimmed" mt="xs">
              {playlistData?.totalGamesMasteredHardcore === 0
                ? `SC: ${playlistData?.totalGamesCompletedSoftcore?.toLocaleString()}`
                : `HC: ${playlistData?.totalGamesMasteredHardcore?.toLocaleString()} | SC: ${playlistData?.totalGamesCompletedSoftcore?.toLocaleString()}`}
            </Text>
          )}
        </Card>

        <Card radius="md" p="md" className={playlistStyles.statCard}>
          <Group justify="space-between" mb="xs">
            <Text size="sm" c="dimmed">Points</Text>
            <IconTrophy size={16} color="orange" />
          </Group>
          <Group align="baseline" gap={4}>
            <Text size="xl" fw={700}>{playlistData?.totalPointsToEarn?.toLocaleString()}</Text>
          </Group>
        </Card>

        <Card radius="md" p="md" className={playlistStyles.statCard}>
          <Group justify="space-between" mb="xs">
            <Text size="sm" c="dimmed">Achievements</Text>
            <IconMedal size={16} color="blue" />
          </Group>
          <Group align="baseline" gap={4}>
            <Text size="xl" fw={700}>{(Math.max(playlistData?.totalAchievementsEarnedSoftcore ?? 0, playlistData?.totalAchievementsEarnedHardcore ?? 0)).toLocaleString()}</Text>
            <Text size="sm" c="dimmed">/{playlistData?.totalAchievementsToEarn?.toLocaleString()}</Text>
          </Group>
          <Text size="xs" c="dimmed" mb="xs">{playlistData?.percentageAchievementsGained}%</Text>
          <Progress value={playlistData?.percentageAchievementsGained ?? 0} size="xs" color="green" />
          {playlistData?.totalAchievementsEarnedSoftcore !== 0 && playlistData?.totalAchievementsEarnedHardcore !== playlistData?.totalAchievementsEarnedSoftcore && (
            <Text size="xs" c="dimmed" mt="xs">
              {playlistData?.totalAchievementsEarnedHardcore === 0
                ? `SC: ${playlistData?.totalAchievementsEarnedSoftcore?.toLocaleString()}`
                : `HC: ${playlistData?.totalAchievementsEarnedHardcore?.toLocaleString()} | SC: ${playlistData?.totalAchievementsEarnedSoftcore?.toLocaleString()}`}
            </Text>
          )}
        </Card>
      </SimpleGrid>

      {/* Search and Filters */}
      <Group mb="md" className={playlistStyles.searchContainer} justify="space-between">
        <Group style={{ flex: 1, maxWidth: 600 }} gap="xs">
          <TextInput
            placeholder="Search games..."
            leftSection={<IconSearch size={16} />}
            value={searchInput}
            onChange={(e) => {
              const value = e.currentTarget.value
              setSearchInput(value)
              if (value.trim() === '') {
                setSearchTerm(null)
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && searchInput.trim() !== '') {
                setSearchTerm(searchInput.trim())
              }
            }}
            className={playlistStyles.searchInput}
            style={{ flex: 1, minWidth: 200 }}
            rightSection={
              searchInput !== '' ? (
                <ActionIcon
                  size="sm"
                  variant="subtle"
                  onClick={() => {
                    setSearchInput('')
                    setSearchTerm(null)
                  }}
                >
                  <IconX size={16} />
                </ActionIcon>
              ) : null
            }
          />
          <Select
            data={[
              { value: '0', label: 'Game Title' },
              { value: '1', label: 'Genre' }
            ]}
            value={searchDropdownValue}
            onChange={(value) => setSearchDropdownValue(value ?? '0')}
            style={{ minWidth: 120 }}
            clearable
          />
          <Button
            variant="filled"
            color="blue"
            leftSection={<IconSearch size={16} />}
            className={playlistStyles.searchButton}
            onClick={() => setSearchTerm(searchInput.trim() !== '' ? searchInput.trim() : null)}
            disabled={searchInput.trim() === ''}
          >
            Search
          </Button>
        </Group>

        {/* Playlist Management Actions */}
        <Group gap="xs">
          <ActionIcon
            variant="light"
            color="blue"
            size="lg"
            title="Add games to playlist"
            onClick={() => setAddGamesModalOpened(true)}
          >
            <IconPlus size={20} />
          </ActionIcon>
          <ActionIcon
            variant="light"
            color="green"
            size="lg"
            onClick={() => setOrderModalOpened(true)}
            title="Manage game order"
          >
            <IconList size={20} />
          </ActionIcon>
          <ActionIcon
            variant="light"
            color="red"
            size="lg"
            onClick={() => setManageGamesModalOpened(true)}
            title="Delete games from playlist"
          >
            <IconTrash size={20} />
          </ActionIcon>
        </Group>
      </Group>

      {/* Games Table */}
      <PaginatedTable
        data={playlistData?.games ?? []}
        columns={columns}
        page={page}
        total={Math.ceil((playlistData?.numberOfGames ?? 0) / pageSize)}
        onPageChange={setPage}
        onRowClick={(game) => gameModal.showModal(game.gameId)}
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => {
          setPageSize(newPageSize)
          setPage(1) // Reset to first page when changing page size
        }}
        pageSizeOptions={[10, 25, 50, 100]}
        showPageSizeSelector={true}
        sortOption={sortOption}
        onSortChange={(opt) => {
          setPage(1)
          setSortOption(opt)
        }}
        actions={[
          {
            onClick: (game) => gameModal.showModal(game.gameId),
            label: 'Game Modal',
            variant: 'filled'
          },
          {
            onClick: (game) => router.push(`/game/${game.gameId}`),
            label: 'Game Page',
            variant: 'filled'
          }
        ]}
      />

      {/* Edit Playlist Details Modal */}
      <EditPlaylistDetailsModal
        opened={editModalOpened}
        onClose={() => setEditModalOpened(false)}
        playlistId={props.playlistId}
        initialName={playlistData?.name ?? ''}
        initialDescription={playlistData?.description ?? ''}
        initialIsPublic={playlistData?.isPublic ?? false}
        queryKey={queryString}
      />

      {/* Manage Playlist Games Modal */}
      <DeletePlaylistGamesModal
        opened={manageGamesModalOpened}
        onClose={() => setManageGamesModalOpened(false)}
        playlistId={props.playlistId}
        games={playlistData?.games ?? []}
        isLoading={isLoadingPlaylistData}
        queryKey={queryString}
        onResetTable={() => {
          setPage(1)
          setSortOption({
            key: 'orderIndex',
            direction: 'asc'
          })
        }}
      />

      {/* Manage Game Order Modal */}
      <ManageGameOrderModal
        opened={orderModalOpened}
        onClose={() => setOrderModalOpened(false)}
        games={playlistData?.games ?? []}
        playlistId={props.playlistId}
      />

      {/* Add Games to Playlist Modal */}
      <AddGamesToPlaylistModal
        opened={addGamesModalOpened}
        onClose={() => setAddGamesModalOpened(false)}
        playlistId={props.playlistId}
        queryKey={queryString}
        onResetTable={() => {
          setPage(1)
          setSortOption({
            key: 'orderIndex',
            direction: 'asc'
          })
        }}
      />
    </Container>
  )
}

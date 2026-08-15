'use client'

import {
  Container,
  Group,
  Button,
  Title,
  Text,
  Loader,
  Center
} from '@mantine/core'
import { IconArrowLeft, IconHeart } from '@tabler/icons-react'
import pageStyles from '@/css/pages/gamePage.module.scss'
import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import PaginatedTable from '@/components/shared/PaginatedTable'
import type { SortOption } from '@/components/shared/PaginatedTable'
import { useGameModal } from '@/context/gameModalContext'
import { GetLoggedInPlaylistDataResponse, LoggedInGameItem } from '@/interfaces/api/playlists/GetLoggedInPlaylistDataResponse'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { doQueryGet } from '@/helpers/apiClient'
import { useMutationApiData } from '@/helpers/mutations/useMutationApiData'
import notificationHelper from '@/helpers/notificationHelper'
import Link from 'next/link'
import EditPlaylistDetailsModal from '@/components/playlists/EditPlaylistDetailsModal'
import DeletePlaylistGamesModal from '@/components/playlists/DeletePlaylistGamesModal'
import ManageGameOrderModal from '@/components/playlists/ManageGameOrderModal'
import AddGamesToPlaylistModal from '@/components/playlists/AddGamesToPlaylistModal'
import { PlaylistHeaderCard } from './shared/PlaylistHeaderCard'
import { PlaylistStatsGrid } from './shared/PlaylistStatsGrid'
import { PlaylistSearchBar } from './shared/PlaylistSearchBar'
import { getLoggedInPlaylistColumns } from './shared/loggedInPlaylistColumns'

interface LoggedInPlaylistPageProps {
  playlistId: string
}

export function LoggedInPlaylistPage(props: LoggedInPlaylistPageProps) {
  const router = useRouter()
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

  // Column definitions live in ./shared/loggedInPlaylistColumns; memoised so the
  // table does not receive a new array identity on every render
  const columns = useMemo(
    () => getLoggedInPlaylistColumns({
      onGenreClick: (genre) => {
        setSearchDropdownValue('1') // Set to Genre
        setSearchTerm(genre)
        setSearchInput(genre)
        setPage(1) // Reset to first page
      }
    }),
    []
  )

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

  // Covers the initial load and any later undefined state, so everything below
  // can treat playlistData as present rather than optional-chaining every field
  if (playlistData === undefined) {
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

      <PlaylistHeaderCard
        playlist={playlistData}
        onEdit={() => setEditModalOpened(true)}
        onToggleLike={async () => { await toggleLikeMutation.mutateAsync(null) }}
        likePending={toggleLikeMutation.isPending}
      />

      <PlaylistStatsGrid playlist={playlistData} />

      <PlaylistSearchBar
        searchInput={searchInput}
        onSearchInputChange={setSearchInput}
        searchType={searchDropdownValue}
        onSearchTypeChange={setSearchDropdownValue}
        onSearch={setSearchTerm}
        onAddGames={() => setAddGamesModalOpened(true)}
        onManageOrder={() => setOrderModalOpened(true)}
        onDeleteGames={() => setManageGamesModalOpened(true)}
      />


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

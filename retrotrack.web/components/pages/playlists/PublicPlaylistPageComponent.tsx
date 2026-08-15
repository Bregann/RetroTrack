'use client'

import {
  Container,
  Group,
  Text,
  Button,
  Title,
  Loader,
  Center,
  SimpleGrid
} from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import {
  IconTrophy,
  IconDeviceGamepad,
  IconArrowLeft,
  IconMedal,
  IconTargetArrow
} from '@tabler/icons-react'
import pageStyles from '@/css/pages/gamePage.module.scss'
import playlistStyles from '@/css/pages/playlists.module.scss'
import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import PaginatedTable from '@/components/shared/PaginatedTable'
import { useGameModal } from '@/context/gameModalContext'
import { useQuery } from '@tanstack/react-query'
import { doQueryGet } from '@/helpers/apiClient'
import { GetPublicPlaylistDataResponse, PlaylistGameItem } from '@/interfaces/api/playlists/GetPublicPlaylistDataResponse'
import type { SortOption } from '@/components/shared/PaginatedTable'
import Link from 'next/link'
import LoginModal from '@/components/navigation/LoginModal'
import RegisterModal from '@/components/navigation/RegisterModal'
import { PlaylistHeaderCard } from './shared/PlaylistHeaderCard'
import { PlaylistSearchBar } from './shared/PlaylistSearchBar'
import { PlaylistSummaryCard } from './shared/PlaylistSummaryCard'
import { SignInPrompt } from './shared/SignInPrompt'
import { getPublicPlaylistColumns } from './shared/playlistColumns'

interface PublicPlaylistPageProps {
  playlistId: string
}

export function PublicPlaylistPage({ playlistId }: PublicPlaylistPageProps) {
  const router = useRouter()
  const isMobile = useMediaQuery('(max-width: 768px)')
  const gameModal = useGameModal()

  // Modal state
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const [registerModalOpen, setRegisterModalOpen] = useState(false)

  // Search and sorting state - similar to PublicGamesTable pattern
  const [searchInput, setSearchInput] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState<string | null>(null)
  const [searchDropdownValue, setSearchDropdownValue] = useState<string>('0')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(100)
  const [sortOption, setSortOption] = useState<SortOption<PlaylistGameItem>>({
    key: 'orderIndex',
    direction: 'asc',
  })

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
      players: 'SortByPlayers'
    }

    const sortParam = sortKeyMap[sortOption.key] !== undefined ? sortKeyMap[sortOption.key] : 'SortByIndex'
    const sortValue = sortOption.direction === 'asc'

    let query = `PlaylistId=${playlistId}&${sortParam}=${sortValue}&Skip=${skip}&Take=${take}`

    if (searchTerm !== null && searchTerm !== '') {
      query += `&SearchType=${searchDropdownValue}&SearchTerm=${encodeURIComponent(searchTerm)}`
    }

    return query
  }, [page, pageSize, playlistId, searchTerm, searchDropdownValue, sortOption.direction, sortOption.key])

  const { data: playlistData, isError: isErrorPlaylistData } = useQuery<GetPublicPlaylistDataResponse>({
    queryKey: [queryString.concat('-public')],
    queryFn: async () => await doQueryGet<GetPublicPlaylistDataResponse>('/api/playlists/GetPublicPlaylistData?'.concat(queryString)),
    staleTime: 60000
  })

  // Column definitions live in ./shared/playlistColumns; memoised so the table
  // does not receive a new array identity on every render
  const columns = useMemo(
    () => getPublicPlaylistColumns({
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
      {/* Login prompt banner with back arrow */}
      <Group align="center" gap="md" mb="xl">
        <IconArrowLeft
          size={24}
          onClick={() => router.back()}
          className={playlistStyles.loginIcon}
        />
        <SignInPrompt onSignIn={() => setLoginModalOpen(true)} />
      </Group>

      <PlaylistHeaderCard playlist={playlistData} />

      <SimpleGrid cols={isMobile ? 2 : 4} mb="xl" spacing="md">
        <PlaylistSummaryCard
          label="Total Games"
          icon={<IconDeviceGamepad size={16} />}
          value={playlistData.numberOfGames}
          caption="In this playlist"
        />
        <PlaylistSummaryCard
          label="Total Points"
          icon={<IconTrophy size={16} color="orange" />}
          value={playlistData.totalPointsToEarn}
          caption="Available to earn"
        />
        <PlaylistSummaryCard
          label="Achievements"
          icon={<IconMedal size={16} color="blue" />}
          value={playlistData.totalAchievementsToEarn}
          caption="Total available"
        />
        <PlaylistSummaryCard
          label="Consoles"
          icon={<IconTargetArrow size={16} color="green" />}
          value={playlistData.numberOfConsoles}
          caption="Different systems"
        />
      </SimpleGrid>

      <PlaylistSearchBar
        searchInput={searchInput}
        onSearchInputChange={setSearchInput}
        searchType={searchDropdownValue}
        onSearchTypeChange={setSearchDropdownValue}
        onSearch={setSearchTerm}
      />

      {/* Games Table */}
      <PaginatedTable
        data={playlistData.games}
        columns={columns}
        page={page}
        total={Math.ceil(playlistData.numberOfGames / pageSize)}
        onPageChange={(newPage) => setPage(newPage)}
        onRowClick={(game) => gameModal.showModal(game.gameId)}
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => {
          setPageSize(newPageSize)
          setPage(1)
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

      <SignInPrompt
        variant="footer"
        onSignIn={() => setLoginModalOpen(true)}
        onRegister={() => setRegisterModalOpen(true)}
      />

      {/* Modals */}
      <LoginModal
        onClose={setLoginModalOpen}
        openedState={loginModalOpen}
      />

      <RegisterModal
        onClose={setRegisterModalOpen}
        openedState={registerModalOpen}
        onSwitchToLogin={() => {
          setRegisterModalOpen(false)
          setLoginModalOpen(true)
        }}
      />
    </Container>
  )
}

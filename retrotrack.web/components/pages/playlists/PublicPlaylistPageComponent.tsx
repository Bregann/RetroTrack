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
  Box,
  Title,
  Badge,
  TextInput,
  Loader,
  Center
} from '@mantine/core'
import { useMediaQuery, useDebouncedState } from '@mantine/hooks'
import {
  IconTrophy,
  IconDeviceGamepad,
  IconHeart,
  IconArrowLeft,
  IconSearch,
  IconMedal,
  IconTargetArrow
} from '@tabler/icons-react'
import pageStyles from '@/css/pages/gamePage.module.scss'
import playlistStyles from '@/css/pages/playlists.module.scss'
import tableStyles from '@/css/components/publicGamesTable.module.scss'
import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import PaginatedTable from '@/components/shared/PaginatedTable'
import { useGameModal } from '@/context/gameModalContext'
import { useQuery } from '@tanstack/react-query'
import { doQueryGet } from '@/helpers/apiClient'
import { GetPublicPlaylistDataResponse, PlaylistGameItem } from '@/interfaces/api/playlists/GetPublicPlaylistDataResponse'
import type { Column, SortOption } from '@/components/shared/PaginatedTable'
import Link from 'next/link'
import LoginModal from '@/components/navigation/LoginModal'
import RegisterModal from '@/components/navigation/RegisterModal'

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
  const [searchInput, setSearchInput] = useDebouncedState<string | null>(null, 200)
  const [searchTerm, setSearchTerm] = useState<string | null>(null)
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
      query += `&SearchTerm=${encodeURIComponent(searchTerm)}`
    }

    return query
  }, [page, pageSize, playlistId, searchTerm, sortOption.direction, sortOption.key])

  const { data: playlistData, isLoading: isLoadingPlaylistData, isError: isErrorPlaylistData } = useQuery<GetPublicPlaylistDataResponse>({
    queryKey: [queryString.concat('-public')],
    queryFn: async () => await doQueryGet<GetPublicPlaylistDataResponse>('/api/playlists/GetPublicPlaylistData?'.concat(queryString)),
    staleTime: 60000
  })

  const columns: Column<PlaylistGameItem>[] = [
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
      sortable: true
    },
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
      {/* Login prompt banner with back arrow */}
      <Group align="center" gap="md" mb="xl">
        <IconArrowLeft
          size={24}
          style={{
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onClick={() => router.back()}
          className={playlistStyles.loginIcon}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateX(-4px)'
            e.currentTarget.style.opacity = '0.8'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateX(0px)'
            e.currentTarget.style.opacity = '1'
          }}
        />
        <Card radius="md" p="md" className={playlistStyles.infoBanner} style={{ flex: 1 }}>
          <Group justify="space-between" align="center">
            <Group gap="md">
              <div>
                <Text fw={500} mb="xs">
                  Sign in to track your progress on these games!
                </Text>
                <Text size="sm" c="dimmed">
                  See your achievements, completion status, and personal stats for each game in this playlist.
                </Text>
              </div>
            </Group>
            <Button variant="filled" color="blue" onClick={() => setLoginModalOpen(true)}>
              Sign In
            </Button>
          </Group>
        </Card>
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
                <Title order={1} size="2rem" mb="xs">
                  {playlistData?.name}
                </Title>
                <Group gap="md" align="center" mb="sm">
                  <Text size="lg" c="dimmed">@{playlistData?.createdBy}</Text>
                  <Badge color="green" variant="light">
                    Public Playlist
                  </Badge>
                </Group>
              </div>

              {/* Action Buttons */}
              <Group gap="xs">
                <Button
                  leftSection={<IconHeart size={16} />}
                  variant="light"
                  color="red"
                >
                  {playlistData?.numberOfLikes} Likes
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
                <strong>{playlistData?.numberOfGames}</strong> games
              </Text>
              <Text size="sm" c="dimmed">
                <strong>{playlistData?.numberOfConsoles}</strong> consoles
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

      {/* Basic Stats */}
      <SimpleGrid cols={isMobile ? 2 : 4} mb="xl" spacing="md">
        <Card radius="md" p="md" className={playlistStyles.statCard}>
          <Group justify="space-between" mb="xs">
            <Text size="sm" c="dimmed">Total Games</Text>
            <IconDeviceGamepad size={16} />
          </Group>
          <Text size="xl" fw={700}>{playlistData?.numberOfGames}</Text>
          <Text size="xs" c="dimmed">In this playlist</Text>
        </Card>

        <Card radius="md" p="md" className={playlistStyles.statCard}>
          <Group justify="space-between" mb="xs">
            <Text size="sm" c="dimmed">Total Points</Text>
            <IconTrophy size={16} color="orange" />
          </Group>
          <Text size="xl" fw={700}>{playlistData?.totalPointsToEarn}</Text>
          <Text size="xs" c="dimmed">Available to earn</Text>
        </Card>

        <Card radius="md" p="md" className={playlistStyles.statCard}>
          <Group justify="space-between" mb="xs">
            <Text size="sm" c="dimmed">Achievements</Text>
            <IconMedal size={16} color="blue" />
          </Group>
          <Text size="xl" fw={700}>{playlistData?.totalAchievementsToEarn}</Text>
          <Text size="xs" c="dimmed">Total available</Text>
        </Card>

        <Card radius="md" p="md" className={playlistStyles.statCard}>
          <Group justify="space-between" mb="xs">
            <Text size="sm" c="dimmed">Consoles</Text>
            <IconTargetArrow size={16} color="green" />
          </Group>
          <Text size="xl" fw={700}>{playlistData?.numberOfConsoles}</Text>
          <Text size="xs" c="dimmed">Different systems</Text>
        </Card>
      </SimpleGrid>

      {/* Search and Filters */}
      <Group mb="md" className={playlistStyles.searchContainer}>
        <Group style={{ flex: 1, maxWidth: 500 }} gap="xs">
          <TextInput
            placeholder="Search games..."
            leftSection={<IconSearch size={16} />}
            value={searchInput ?? ''}
            onChange={(e) => {
              if (e.currentTarget.value.trim() === '') {
                setSearchTerm(null)
                setSearchInput(null)
              }
              setSearchInput(e.currentTarget.value)
            }}
            className={playlistStyles.searchInput}
            style={{ flex: 1 }}
          />
          <Button
            variant="filled"
            color="blue"
            leftSection={<IconSearch size={16} />}
            className={playlistStyles.searchButton}
            onClick={() => setSearchTerm(searchInput)}
            disabled={searchInput === null || searchInput.trim() === ''}
          >
            Search
          </Button>
        </Group>
      </Group>

      {/* Games Table */}
      <PaginatedTable
        data={playlistData?.games ?? []}
        columns={columns}
        page={page}
        total={Math.ceil((playlistData?.numberOfGames ?? 0) / pageSize)}
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

      {/* Call to action for better experience */}
      <Group justify="space-between" align="center" mt="md" p="sm" style={{
        background: 'light-dark(#f8f9fa, rgba(255, 255, 255, 0.02))',
        borderRadius: 8,
        border: '1px solid light-dark(#e9ecef, rgba(255, 255, 255, 0.1))'
      }}>
        <Text size="sm" c="dimmed">
          Sign in to track your progress on these games
        </Text>
        <Group gap="xs">
          <Button variant="filled" color="blue" size="xs" onClick={() => setLoginModalOpen(true)}>
            Sign In
          </Button>
          <Button variant="outline" color="blue" size="xs" onClick={() => setRegisterModalOpen(true)}>
            Create Account
          </Button>
        </Group>
      </Group>

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

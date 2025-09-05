'use client'

import { useState, useMemo } from 'react'
import {
  Card,
  Container,
  Stack,
  Text,
  TextInput,
  Group,
  Badge,
  Pagination,
  Center,
  Select,
  Button,
  Divider,
  ActionIcon,
  Loader
} from '@mantine/core'
import { IconSearch, IconTrophy, IconDeviceGamepad2, IconFilterSearch, IconX, IconChevronDown, IconChevronUp } from '@tabler/icons-react'
import styles from '@/css/pages/search.module.scss'
import { pressStart2P } from '@/font/pressStart2P'
import { useQuery } from '@tanstack/react-query'
import { doQueryGet } from '@/helpers/apiClient'
import { DoSearchResponse } from '@/interfaces/api/search/DoSearchResponse'
import { GetSearchConsolesResponse } from '@/interfaces/api/search/GetSearchConsolesResponse'
import { OrderByType } from '@/enums/OrderByType'
import { GameCard } from '@/components/search/GameCard'
import { AchievementCard } from '@/components/search/AchievementCard'

export default function SearchComponent() {
  const [searchInput, setSearchInput] = useState('')
  const [searchTerm, setSearchTerm] = useState<string | null>(null)
  const [orderBy, setOrderBy] = useState<OrderByType>(OrderByType.AlphabeticalAtoZ)
  const [selectedConsoleId, setSelectedConsoleId] = useState<number>(-1)
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [showGames, setShowGames] = useState(true)
  const [showAchievements, setShowAchievements] = useState(true)

  const resultsPerPage = 25

  const { data: consolesData } = useQuery<GetSearchConsolesResponse>({
    queryKey: ['searchConsoles'],
    queryFn: async () => await doQueryGet<GetSearchConsolesResponse>('/api/search/GetSearchConsoles'),
    staleTime: 300000 // 5 minutes
  })

  const queryString = useMemo(() => {
    if (searchTerm === null || searchTerm.trim() === '') return null

    const skip = (currentPage - 1) * resultsPerPage
    const take = resultsPerPage

    return `SearchTerm=${encodeURIComponent(searchTerm)}&OrderBy=${orderBy}&ConsoleId=${selectedConsoleId}&Skip=${skip}&Take=${take}`
  }, [searchTerm, orderBy, selectedConsoleId, currentPage])

  // Fetch search results
  const { data, isLoading, isError } = useQuery<DoSearchResponse>({
    queryKey: ['search', queryString],
    queryFn: async () => await doQueryGet<DoSearchResponse>(`/api/search/DoSearch?${queryString}`),
    enabled: queryString !== null,
    staleTime: 30000
  })

  const filteredGames = data?.gameResults ?? []
  const filteredAchievements = data?.achievementResults ?? []

  const getTotalPages = () => {
    if (data === undefined) return 0

    const totalGames = data.totalGameResults
    const totalAchievements = data.totalAchievementResults
    const totalResults = Math.max(totalGames, totalAchievements)

    return Math.ceil(totalResults / resultsPerPage)
  }

  const performSearch = () => {
    setSearchTerm(searchInput.trim() !== '' ? searchInput.trim() : null)
    setCurrentPage(1)
  }

  const clearSearch = () => {
    setSearchTerm(null)
    setSearchInput('')
    setSelectedConsoleId(-1)
    setCurrentPage(1)
  }

  return (
    <Container size="100%" px={0}>
      <Stack gap="xl">
        {/* Header */}
        <Stack align="center" gap="lg" mb="md">
          <Text
            size="2rem"
            fw={700}
            ta="center"
            className={pressStart2P.className}
          >
            Search RetroTrack
          </Text>
          <Text ta="center" size="lg" c="dimmed" maw={600}>
            Search for games and achievements across the RetroAchievements database
          </Text>
        </Stack>

        {/* Search Bar */}
        <Card className={styles.searchContainer} radius="md" p="lg">
          <Stack gap="md">
            <Group gap="md" wrap="nowrap">
              <TextInput
                placeholder="Search for games, achievements, or consoles..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && performSearch()}
                leftSection={<IconSearch size={16} />}
                rightSection={
                  searchInput.length > 0 && (
                    <ActionIcon variant="subtle" onClick={clearSearch}>
                      <IconX size={16} />
                    </ActionIcon>
                  )
                }
                style={{ flex: 1 }}
                size="md"
              />
              <Button
                variant="filled"
                leftSection={<IconSearch size={16} />}
                onClick={performSearch}
                disabled={searchInput.trim().length === 0}
              >
                Search
              </Button>
              <Button
                variant="light"
                leftSection={<IconFilterSearch size={16} />}
                onClick={() => setShowFilters(!showFilters)}
              >
                Filters
              </Button>
            </Group>

            {/* Filters */}
            {showFilters &&
              <>
                <Divider />
                <Group gap="md" wrap="wrap">
                  <Select
                    label="Console"
                    value={selectedConsoleId.toString()}
                    onChange={(value) => setSelectedConsoleId(parseInt(value ?? '-1'))}
                    data={[
                      { value: '-1', label: 'All Consoles' },
                      ...(consolesData?.consoles.map(console => ({
                        value: console.id.toString(),
                        label: console.name
                      })) ?? [])
                    ]}
                    style={{ minWidth: 200 }}
                  />
                  <Select
                    label="Sort by"
                    value={orderBy.toString()}
                    onChange={(value) => setOrderBy(parseInt(value ?? '0') as OrderByType)}
                    data={[
                      { value: OrderByType.AlphabeticalAtoZ.toString(), label: 'A to Z' },
                      { value: OrderByType.AlphabeticalZtoA.toString(), label: 'Z to A' },
                      { value: OrderByType.PointsAsc.toString(), label: 'Points (Low to High)' },
                      { value: OrderByType.PointsDesc.toString(), label: 'Points (High to Low)' },
                      { value: OrderByType.RecentlyAdded.toString(), label: 'Recently Added' }
                    ]}
                    style={{ minWidth: 150 }}
                  />
                </Group>
              </>
            }
          </Stack>
        </Card>

        {/* Results */}
        {searchTerm !== null &&
          <Stack gap="lg">
            {isLoading &&
              <Center>
                <Loader size="lg" />
                <Text ml="md">Searching...</Text>
              </Center>
            }

            {!isLoading && !isError && data !== undefined && (
              <>
                {/* Results Summary */}
                <Group justify="space-between" align="center">
                  <Text size="lg" fw={500}>
                    Found {data.totalGameResults} games and {data.totalAchievementResults} achievements
                  </Text>
                  <Text size="sm" c="dimmed">
                    Page {currentPage}
                  </Text>
                </Group>

                {/* Games Results */}
                {filteredGames.length > 0 &&
                  <Stack gap="md">
                    <Group gap="xs" align="center" style={{ cursor: 'pointer' }} onClick={() => setShowGames(!showGames)}>
                      <IconDeviceGamepad2 size={20} />
                      <Text size="xl" fw={600}>Games</Text>
                      <Badge variant="light" color="blue">
                        {data.totalGameResults}
                      </Badge>
                      {showGames ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
                    </Group>
                    {showGames && (
                      <Stack gap="sm">
                        {filteredGames.map((game) => (
                          <GameCard
                            key={game.gameId}
                            game={game}
                            searchTerm={searchTerm ?? ''}
                          />
                        ))}
                      </Stack>
                    )}
                  </Stack>
                }

                {/* Achievements Results */}
                {filteredAchievements.length > 0 &&
                  <Stack gap="md">
                    <Group gap="xs" align="center" style={{ cursor: 'pointer' }} onClick={() => setShowAchievements(!showAchievements)}>
                      <IconTrophy size={20} />
                      <Text size="xl" fw={600}>Achievements</Text>
                      <Badge variant="light" color="orange">
                        {data.totalAchievementResults}
                      </Badge>
                      {showAchievements ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
                    </Group>
                    {showAchievements && (
                      <Stack gap="sm">
                        {filteredAchievements.map((achievement) => (
                          <AchievementCard
                            key={achievement.achievementId}
                            achievement={achievement}
                            searchTerm={searchTerm ?? ''}
                          />
                        ))}
                      </Stack>
                    )}
                  </Stack>
                }

                {/* No Results */}
                {filteredGames.length === 0 && filteredAchievements.length === 0 &&
                  <Card className={styles.searchCard} radius="md" p="xl">
                    <Stack align="center" gap="md">
                      <IconSearch size={48} color="var(--mantine-color-gray-5)" />
                      <Text size="lg" fw={500} ta="center">
                        No results found
                      </Text>
                      <Text size="md" c="dimmed" ta="center" maw={400}>
                        Try adjusting your search terms or filters to find what you&apos;re looking for.
                      </Text>
                    </Stack>
                  </Card>
                }

                {/* Pagination */}
                {getTotalPages() > 1 &&
                  <Center>
                    <Pagination
                      value={currentPage}
                      onChange={setCurrentPage}
                      total={getTotalPages()}
                      size="md"
                    />
                  </Center>
                }
              </>
            )}

            {isError &&
              <Card className={styles.searchCard} radius="md" p="xl">
                <Stack align="center" gap="md">
                  <Text size="lg" fw={500} ta="center" c="red">
                    Search Error
                  </Text>
                  <Text size="md" c="dimmed" ta="center" maw={400}>
                    There was an error performing your search. Please try again.
                  </Text>
                </Stack>
              </Card>
            }
          </Stack>
        }

        {/* Empty State */}
        {searchTerm === null &&
          <Card className={styles.searchCard} radius="md" p="xl">
            <Stack align="center" gap="md">
              <IconSearch size={64} color="var(--mantine-color-gray-4)" />
              <Text size="xl" fw={600} ta="center">
                Start your search
              </Text>
              <Text size="md" c="dimmed" ta="center" maw={500}>
                Enter a game title, achievement name, or console to begin searching through thousands of retro games and achievements.
              </Text>
              <Group gap="md" mt="md">
                <Button
                  variant="light"
                  onClick={() => { setSearchInput('mario'); performSearch() }}
                  size="sm"
                >
                  Try &quot;mario&quot;
                </Button>
                <Button
                  variant="light"
                  onClick={() => { setSearchInput('zelda'); performSearch() }}
                  size="sm"
                >
                  Try &quot;zelda&quot;
                </Button>
                <Button
                  variant="light"
                  onClick={() => { setSearchInput('nintendo'); performSearch() }}
                  size="sm"
                >
                  Try &quot;nintendo&quot;
                </Button>
              </Group>
            </Stack>
          </Card>
        }
      </Stack>
    </Container>
  )
}

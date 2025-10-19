'use client'

import {
  Container,
  Group,
  Stack,
  Text,
  Card,
  Image,
  ThemeIcon,
  SimpleGrid,
  Button,
  Divider,
  Progress,
  Box,
  Checkbox,
  Tooltip,
  Paper,
  ActionIcon,
  Title,
  Badge,
  Flex,
  ScrollArea,
  Textarea,
  Select,
} from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import {
  IconTrophy,
  IconStar,
  IconDeviceGamepad,
  IconUsers,
  IconCheck,
  IconAward,
  IconBuilding,
  IconTools,
  IconExclamationMark,
  IconRefresh,
  IconInfoCircle,
  IconCrown,
  IconArrowLeft,
  IconPlus,
} from '@tabler/icons-react'
import styles from '@/css/components/gameModal.module.scss'
import pageStyles from '@/css/pages/gamePage.module.scss'
import { AchievementType } from '@/enums/achievementType'
import { useEffect, useRef, useState } from 'react'
import notificationHelper from '@/helpers/notificationHelper'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { doQueryGet } from '@/helpers/apiClient'
import { GetLoggedInSpecificGameInfoResponse } from '@/interfaces/api/games/GetLoggedInSpecificGameInfoResponse'
import { useMutationApiData } from '@/helpers/mutations/useMutationApiData'
import { useRouter } from 'next/navigation'
import { GetLeaderboardsFromGameIdResponse } from '@/interfaces/api/games/GetLeaderboardsFromGameIdResponse'
import { AddGameToPlaylistRequest } from '@/interfaces/api/playlists/AddGameToPlaylistRequest'

interface LoggedInGamePageProps {
  gameId: number
}

export function LoggedInGamePage(props: LoggedInGamePageProps) {
  const router = useRouter()
  const isSmall = useMediaQuery('(max-width: 1100px)')
  const isMobile = useMediaQuery('(max-width: 768px)')
  const queryClient = useQueryClient()

  const { isLoading, isError, data, refetch } = useQuery({
    queryKey: ['getGameInfoForUser', props.gameId],
    refetchOnMount: true,
    queryFn: async () => await doQueryGet<GetLoggedInSpecificGameInfoResponse>(`/api/games/GetGameInfoForUser/${props.gameId}`)
  })

  const { data: achievementLeaderboardsData } = useQuery({
    queryKey: ['getAchievementLeaderboards', props.gameId],
    refetchOnMount: true,
    queryFn: async () => await doQueryGet<GetLeaderboardsFromGameIdResponse>(`/api/games/GetLeaderboardsFromGameId/${props.gameId}`)
  })


  const { mutateAsync: trackedGameMutation } = useMutationApiData({
    url: data?.gameTracked === true ? `/api/trackedgames/DeleteTrackedGame/${props.gameId}` : `/api/trackedgames/AddTrackedGame/${props.gameId}`,
    invalidateQuery: false,
    queryKey: ['getGameInfoForUser', props.gameId],
    apiMethod: data?.gameTracked === true ? 'DELETE' : 'POST',
    onSuccess: async () => {
      // set the query data to the opposite of what it is currently
      queryClient.setQueryData(['getGameInfoForUser', props.gameId], (oldData: GetLoggedInSpecificGameInfoResponse | undefined) => {
        if (oldData === undefined) return oldData
        return {
          ...oldData,
          gameTracked: !oldData.gameTracked
        }
      })

      queryClient.invalidateQueries({ queryKey: ['getTrackedGames'] })
      notificationHelper.showSuccessNotification('Success', data?.gameTracked === true ? 'Game untracked.' : 'Game tracked.', 3000, <IconCheck size={16} />)
    },
    onError: () => {
      notificationHelper.showErrorNotification('Error', 'Failed to update tracked game.', 3000, <IconInfoCircle size={16} />)
    }
  })

  const [userNotes, setUserNotes] = useState<string | null>(null)
  const [hideUnlockedAchievements, setHideUnlockedAchievements] = useState(false)
  const [showProgressionOnly, setShowProgressionOnly] = useState(false)
  const [showMissableOnly, setShowMissableOnly] = useState(false)
  const [autoUpdateChecked, setAutoUpdateChecked] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null)
  const gameAutoUpdateTimerRef = useRef<NodeJS.Timeout | null>(null)
  const gameUpdateButtonTimerRef = useRef<NodeJS.Timeout | null>(null)

  const handleGameUpdate = async () => {
    setDisabled(true)
    await refetch()
    notificationHelper.showSuccessNotification('Game Updated', 'Game information has been updated', 3000, <IconCheck />)
    gameUpdateButtonTimerRef.current = setTimeout(() => {
      setDisabled(false)
    }, 30000)
  }

  const { mutateAsync: handleSaveNotes } = useMutationApiData<string, null>({
    url: `/api/games/UpdateUserGameNotes/${props.gameId}`,
    invalidateQuery: true,
    queryKey: ['getGameInfoForUser', props.gameId],
    apiMethod: 'POST',
    onSuccess: async () => {
      notificationHelper.showSuccessNotification('Success', 'User notes updated.', 3000, <IconCheck size={16} />)
    },
    onError: () => {
      notificationHelper.showErrorNotification('Error', 'Failed to update user notes.', 3000, <IconInfoCircle size={16} />)
    }
  })

  // Transform user playlists into dropdown format
  const playlistOptions = (data?.playlists ?? []).map(playlist => ({
    value: playlist.id,
    label: playlist.name
  }))

  const { mutateAsync: addToPlaylistMutation } = useMutationApiData<AddGameToPlaylistRequest, null>({
    url: '/api/playlists/AddGameToPlaylist',
    invalidateQuery: true,
    queryKey: ['getGameInfoForUser', props.gameId],
    apiMethod: 'POST',
    onSuccess: async () => {
      notificationHelper.showSuccessNotification('Success', 'Game added to playlist successfully!', 3000, <IconCheck size={16} />)
      setSelectedPlaylistId(null)
    },
    onError: () => {
      notificationHelper.showErrorNotification('Error', 'Failed to add game to playlist.', 3000, <IconInfoCircle size={16} />)
    }
  })

  const handleAddToPlaylist = async () => {
    if (selectedPlaylistId === null || selectedPlaylistId === undefined || selectedPlaylistId.trim() === '') {
      notificationHelper.showErrorNotification('Error', 'Please select a playlist first.', 3000, <IconInfoCircle size={16} />)
      return
    }

    const requestData: AddGameToPlaylistRequest = {
      gameId: props.gameId,
      playlistId: selectedPlaylistId
    }

    await addToPlaylistMutation(requestData)
  }

  useEffect(() => {
    return () => {
      if (gameUpdateButtonTimerRef.current !== null) {
        clearTimeout(gameUpdateButtonTimerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (autoUpdateChecked) {
      notificationHelper.showSuccessNotification('Enabled', 'Achievement auto updates enabled', 3000, <IconCheck />)
      gameAutoUpdateTimerRef.current = setInterval(async () => {
        await refetch()
      }, 60000)
    }
    if (!autoUpdateChecked && gameAutoUpdateTimerRef.current !== null) {
      clearInterval(gameAutoUpdateTimerRef.current)
      gameAutoUpdateTimerRef.current = null
      notificationHelper.showSuccessNotification('Disabled', 'Achievement auto updates disabled', 3000, <IconCheck />)
    }

  }, [autoUpdateChecked, refetch])

  useEffect(() => {
    if (data !== undefined) {
      setUserNotes(data.userNotes ?? null)
      console.log(data.userNotes)
    }
  }, [data])

  return (
    <Container size="100%" px="md" py="xl" className={pageStyles.pageContainer}>
      {/* Header with back button */}
      <Group mb="xl">
        <Button
          variant="subtle"
          leftSection={<IconArrowLeft size={16} />}
          onClick={() => router.back()}
        >
          Back
        </Button>

        {/* Game Title Header */}
        {isLoading ? (
          <Text>Loading...</Text>
        ) : isError ? (
          <Text c="red">Error loading game info</Text>
        ) : data !== null && data !== undefined ? (
          <Group gap="md" align="center" style={{ flexWrap: 'nowrap' }}>
            <Box className={styles.iconBox}>
              <Image
                src={`https://media.retroachievements.org${data.gameImage}`}
                alt="Game Icon"
                width={64}
                height={64}
                radius="sm"
                className={styles.gameIcon}
              />
            </Box>
            <Title order={1} size="2rem">
              {data.title}
            </Title>
          </Group>
        ) : null}
      </Group>
      {/* Main Content */}
      {isLoading && (
        <Text ta="center">Loading game details...</Text>
      )}

      {isError && (
        <Text c="red" ta="center">Error loading game info</Text>
      )}

      {data !== null && data !== undefined && (
        <Flex direction={isMobile ? 'column' : 'row'} gap="xl">
          {/* Left Content - Game Details and Achievements */}
          <Box style={{ flex: isMobile ? 'none' : '3' }}>
            {/* Game Screenshots */}
            <SimpleGrid cols={isSmall ? 1 : 3} mb="md">
              <Image
                src={`https://media.retroachievements.org${data.imageInGame}`}
                alt="In-Game Screenshot"
                radius="sm"
                className={styles.gameScreenshot}
              />
              <Image
                src={`https://media.retroachievements.org${data.imageTitle}`}
                alt="Title Screen"
                radius="sm"
                className={styles.gameScreenshot}
              />
              <Box className={styles.gameCoverBox}>
                <Image
                  src={`https://media.retroachievements.org${data.imageBoxArt}`}
                  alt="Box Art"
                  radius="sm"
                  className={styles.gameCoverArt}
                />
              </Box>
            </SimpleGrid>

            <Divider my="sm" label="Summary" labelPosition="center" styles={{ label: { fontSize: 15 } }} />

            <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }} mb="md">
              <Card withBorder>
                <Stack align="center" gap={6}>
                  <ThemeIcon size="xl" radius="md" color="yellow">
                    <IconTrophy size={24} />
                  </ThemeIcon>
                  <Text fw={700} ta={'center'}>{data.achievementsAwardedTotal.toLocaleString()}/{data.achievementCount.toLocaleString()} Achievements</Text>
                  <Stack gap="xs" justify="center" ta={'center'}>
                    <Text size="sm" c="dimmed">
                      {((data.achievementsAwardedTotal / data.achievementCount) * 100).toFixed(2)}% complete
                    </Text>
                    {data.achievementsAwardedSoftcore !== data.achievementsAwardedHardcore && <Text size="sm" c="cyan">Softcore: {data.achievementsAwardedSoftcore}</Text>}
                    {data.achievementsAwardedHardcore !== 0 && <Text size="sm" c="orange">Hardcore: {data.achievementsAwardedHardcore}</Text>}
                    <Text size="sm" c="grey">Locked: {data.achievementCount - data.achievementsAwardedTotal}</Text>
                  </Stack>
                </Stack>
              </Card>

              <Card withBorder>
                <Stack align="center" gap={6}>
                  <ThemeIcon size="xl" radius="md" color="teal">
                    <IconStar size={24} />
                  </ThemeIcon>
                  <Text fw={700} ta={'center'}>{data.pointsAwardedTotal.toLocaleString()}/{data.totalGamePoints.toLocaleString()} Points</Text>
                  <Stack gap="xs" justify="center" ta={'center'}>
                    <Text size="sm" c="dimmed">
                      {((data.pointsAwardedTotal / data.totalGamePoints) * 100).toFixed(2)}% complete
                    </Text>
                    {data.pointsAwardedSoftcore !== data.pointsAwardedHardcore && <Text size="sm" c="cyan">Softcore: {data.pointsAwardedSoftcore}</Text>}
                    {data.pointsAwardedHardcore !== 0 && <Text size="sm" c="cyan">Hardcore: {data.pointsAwardedHardcore}</Text>}
                  </Stack>
                </Stack>
              </Card>

              <Card withBorder radius="md" p="md">
                <Stack align="center" gap="sm">
                  <ThemeIcon size="xl" radius="md" color="violet">
                    <IconDeviceGamepad size={24} />
                  </ThemeIcon>
                  <Text fw={700}>Game Info</Text>

                  <Group gap="xl" align="flex-start" justify="center" style={{ width: '100%' }}>
                    <Stack gap="4">
                      <Group gap="xs">
                        <IconDeviceGamepad size={16} />
                        <Text size="sm">{data.consoleName}</Text>
                      </Group>
                      <Group gap="xs">
                        <IconStar size={16} />
                        <Text size="sm">{data.genre !== '' || 'Not Set'}</Text>
                      </Group>
                    </Stack>

                    <Stack gap="4">
                      <Group gap="xs">
                        <IconBuilding size={16} />
                        <Text size="sm">Publisher: {data.publisher !== '' || 'Not Set'}</Text>
                      </Group>
                      <Group gap="xs">
                        <IconTools size={16} />
                        <Text size="sm">Developer: {data.developer !== '' || 'Not Set'}</Text>
                      </Group>
                    </Stack>
                  </Group>

                  <Group gap="xs">
                    <IconUsers size={16} />
                    <Text size="sm">{data.players} Players</Text>
                  </Group>
                </Stack>
              </Card>

              <Card withBorder>
                <Stack align="center" gap={6}>
                  <ThemeIcon size="xl" radius="md" color="teal">
                    <IconCheck size={24} />
                  </ThemeIcon>
                  <Text fw={700} ta={'center'}>Completion State</Text>
                  <Stack gap={4}>
                    <Group gap="6" justify='center'>
                      <IconDeviceGamepad size={16} />
                      <Text>Date Beaten:</Text>
                    </Group>

                    <Text size="sm" c="dimmed" ta={'center'}>
                      {data.dateBeatenHardcore === null && data.dateBeatenSoftcore === null
                        ? 'N/A'
                        : data.dateBeatenHardcore ?? data.dateBeatenSoftcore}
                    </Text>

                    <Group gap="6" justify='center' mt={10}>
                      <IconDeviceGamepad size={16} />
                      <Text>Date Completed/Mastered:</Text>
                    </Group>
                    <Text size="sm" c="dimmed" ta={'center'}>
                      {data.dateMastered === null && data.dateCompleted === null
                        ? 'N/A'
                        : data.dateMastered ?? data.dateCompleted}
                    </Text>
                  </Stack>
                </Stack>
              </Card>
            </SimpleGrid>

            <Divider my="sm" label="Achievements" labelPosition="center" styles={{ label: { fontSize: 15 } }} />
            <Progress.Root size={20} className={styles.progressBar}>
              {data.achievementsAwardedHardcore != 0 && <Progress.Section value={data.achievementsAwardedHardcore} color="orange">
                <Progress.Label>Hardcore ({data.achievementsAwardedHardcore})</Progress.Label>
              </Progress.Section>}
              {data.achievementsAwardedSoftcore !== data.achievementsAwardedHardcore && <Progress.Section value={data.achievementsAwardedSoftcore} color="cyan">
                <Progress.Label>Softcore ({data.achievementsAwardedSoftcore})</Progress.Label>
              </Progress.Section>}
              <Progress.Section value={data.achievementCount - data.achievementsAwardedTotal} color="grey">
                <Progress.Label>Locked ({data.achievementCount - data.achievementsAwardedTotal})</Progress.Label>
              </Progress.Section>
            </Progress.Root>
            <Group>
              <Checkbox
                label="Hide Unlocked Achievements"
                checked={hideUnlockedAchievements}
                onChange={(e) => setHideUnlockedAchievements(e.currentTarget.checked)}
              />
              <Checkbox
                label="Show Progression Achievements Only"
                checked={showProgressionOnly}
                onChange={(e) => setShowProgressionOnly(e.currentTarget.checked)}
              />
              <Checkbox
                label="Show Missable Achievements Only"
                checked={showMissableOnly}
                onChange={(e) => setShowMissableOnly(e.currentTarget.checked)}
              />
            </Group>

            <Stack gap="xs" mb="md" mt="sm">
              <Text fw={500}>Your Notes</Text>
              <Textarea
                placeholder="Write your notes here..."
                minRows={3}
                autosize
                value={userNotes ?? ''}
                onChange={(e) => setUserNotes(e.currentTarget.value)}
              />
              <Group justify="right">
                <Button onClick={async () => { await handleSaveNotes(userNotes ?? '') }}>Save Notes</Button>
              </Group>
            </Stack>

            <SimpleGrid cols={isSmall ? 1 : 2} mb="md" mt={10}>
              {data.achievements
                .sort((a, b) => {
                  // Sort by unlock status first (unlocked first)
                  const aUnlocked = a.dateEarnedSoftcore !== null || a.dateEarnedHardcore !== null
                  const bUnlocked = b.dateEarnedSoftcore !== null || b.dateEarnedHardcore !== null
                  if (aUnlocked !== bUnlocked) {
                    return aUnlocked ? -1 : 1
                  }
                  // Then sort by achievement type if both have valid types
                  if (a.type !== null && b.type !== null) {
                    return a.type - b.type
                  }
                  return 0
                })
                .filter((x) => {
                  if (hideUnlockedAchievements) {
                    return x.dateEarnedSoftcore === null || x.dateEarnedHardcore === null
                  }
                  return true
                })
                .filter((x) => {
                  if (showProgressionOnly && showMissableOnly) {
                    return (
                      x.type === AchievementType.Progression ||
                      x.type === AchievementType.Missable ||
                      x.type === AchievementType.Win_Condition
                    )
                  }
                  if (showProgressionOnly) {
                    return (
                      x.type === AchievementType.Progression ||
                      x.type === AchievementType.Win_Condition
                    )
                  }
                  if (showMissableOnly) {
                    return x.type === AchievementType.Missable
                  }
                  return true
                }).map((achievement) => {
                  return (
                    <Card
                      key={achievement.id}
                      withBorder
                      radius="sm"
                      p="sm"
                      style={{
                        position: 'relative',
                        borderWidth: 2,
                        backgroundColor: achievement.dateEarnedSoftcore !== null || achievement.dateEarnedHardcore !== null
                          ? 'light-dark(#e8f5e9, #1b3a29)' // Light green/dark green background for unlocked
                          : 'light-dark(#f9f9f9, #263042)',
                        borderColor:
                          achievement.type === AchievementType.Missable
                            ? 'var(--mantine-color-orange-filled)'
                            : achievement.type === AchievementType.Progression
                              ? 'var(--mantine-color-cyan-filled)'
                              : achievement.type === AchievementType.Win_Condition
                                ? 'var(--mantine-color-green-filled)'
                                : 'transparent',
                        opacity: achievement.dateEarnedSoftcore !== null || achievement.dateEarnedHardcore !== null ? 1 : 0.8
                      }}
                    >
                      {/* Achievement Icon and Details */}
                      <Group align="center" gap="md">
                        <Box className={styles.iconBox}>
                          <Image
                            src={`https://media.retroachievements.org/Badge/${achievement.badgeName}`}
                            alt="Achievement Icon"
                            width={64}
                            height={64}
                            radius="sm"
                            style={{ objectFit: 'contain' }}
                          />
                        </Box>

                        <Stack gap={2} style={{ flex: 1 }}>
                          <Text fw={500}>{achievement.title}</Text>
                          <Text size="sm" c="dimmed">{achievement.description}</Text>
                          {achievement.dateEarnedSoftcore !== null && <Text size="xs" c="dimmed" mt={5}>Unlocked: {achievement.dateEarnedSoftcore}</Text>}
                        </Stack>

                        <Text fw={600} size="lg" c="yellow" mb={20}>{achievement.points}</Text>
                      </Group>
                      {(() => {
                        switch (achievement.type) {
                          case AchievementType.Progression:
                            return (
                              <Tooltip label="Progression Achievement" position="top" withArrow>
                                <Box className={styles.achievementIconTypeBox}>
                                  <ThemeIcon color="cyan" size="sm" radius="xl">
                                    <IconCheck size={16} />
                                  </ThemeIcon>
                                </Box>
                              </Tooltip>
                            )
                          case AchievementType.Missable:
                            return (
                              <Tooltip label="Missable Achievement" position="top" withArrow>
                                <Box className={styles.achievementIconTypeBox}>
                                  <ThemeIcon color="orange" size="sm" radius="xl">
                                    <IconExclamationMark size={16} />
                                  </ThemeIcon>
                                </Box>
                              </Tooltip>
                            )
                          case AchievementType.Win_Condition:
                            return (
                              <Tooltip label="Win Condition" position="top" withArrow>
                                <Box className={styles.achievementIconTypeBox}>
                                  <ThemeIcon color="green" size="sm" radius="xl">
                                    <IconAward size={16} />
                                  </ThemeIcon>
                                </Box>
                              </Tooltip>
                            )
                          default:
                            return null
                        }
                      })()}
                    </Card>
                  )
                })
              }
            </SimpleGrid>
            <Paper className={styles.footer}>
              <Group justify="space-between" gap="xs" wrap="nowrap">
                {/* Left side - Update button and Track Game */}
                <Group gap="xs">
                  <Tooltip label="Update game">
                    <ActionIcon
                      size="lg"
                      onClick={async () => { await handleGameUpdate() }} disabled={disabled}
                      visibleFrom='sm'
                      color="green">
                      <IconRefresh />
                    </ActionIcon>
                  </Tooltip>
                  <Button
                    onClick={async () => { await trackedGameMutation({}) }}
                    color={data.gameTracked ? 'red' : 'blue'}
                  >
                    {data.gameTracked ? 'Untrack Game' : 'Track Game'}
                  </Button>
                </Group>

                {/* Center - Playlist Controls (only show if user has playlists) */}
                {playlistOptions.length > 0 && (
                  <Group gap="xs" style={{ flex: 1, justifyContent: 'center' }}>
                    <Select
                      placeholder="Select a playlist"
                      data={playlistOptions}
                      value={selectedPlaylistId}
                      onChange={setSelectedPlaylistId}
                      style={{ minWidth: 180 }}
                      clearable
                      size="sm"
                    />
                    <Button
                      leftSection={<IconPlus size={14} />}
                      onClick={handleAddToPlaylist}
                      disabled={selectedPlaylistId === null || selectedPlaylistId === undefined || selectedPlaylistId.trim() === ''}
                      color="green"
                      variant="light"
                      size="sm"
                    >
                      Add to Playlist
                    </Button>
                  </Group>
                )}

                {/* Right side - External links and Auto Update */}
                <Group gap="xs">
                  <Button
                    component="a"
                    variant="gradient"
                    gradient={{ from: 'indigo', to: 'cyan' }}
                    target="_blank"
                    style={{ ':hover': { color: 'white' } }}
                    href={'https://retroachievements.org/game/' + data.gameId}
                    size="sm"
                  >
                    RA Page
                  </Button>
                  <Checkbox
                    label="Auto Update Achievements"
                    checked={autoUpdateChecked}
                    onChange={(e) => setAutoUpdateChecked(e.currentTarget.checked)}
                  />
                </Group>
              </Group>
            </Paper>
          </Box>

          {/* Right Sidebar - Achievement Leaderboards */}
          {!isMobile && achievementLeaderboardsData !== undefined && achievementLeaderboardsData.totalLeaderboards > 0 && (
            <Box style={{ flex: '1', minWidth: 280, maxWidth: 320 }}>
              <Card withBorder p="md" style={{ position: 'sticky', top: 80, maxHeight: 'calc(100vh - 100px)', overflow: 'hidden' }} className={pageStyles.leaderboardCard}>
                <Group mb="md" justify="space-between">
                  <Title order={3} size="h4">
                    <Group gap="xs">
                      <IconTrophy size={20} />
                      Leaderboards
                    </Group>
                  </Title>
                  {achievementLeaderboardsData !== undefined && (
                    <Badge variant="light" size="sm">
                      {achievementLeaderboardsData.totalLeaderboards} leaderboards
                    </Badge>
                  )}
                </Group>

                <ScrollArea h={500}>
                  <Stack gap="sm">
                    {achievementLeaderboardsData?.leaderboards.map((leaderboard) => (
                      <Card
                        key={leaderboard.leaderboardId}
                        withBorder
                        p="xs"
                        style={{
                          backgroundColor: 'light-dark(#f8f9fa, #25262b)',
                          borderColor: 'light-dark(#dee2e6, #373a40)'
                        }}
                      >
                        <Stack gap="xs">
                          {/* Leaderboard Title */}
                          <Group justify="space-between" align="flex-start">
                            <Box style={{ flex: 1 }}>
                              <Text fw={600} size="xs" lineClamp={1}>
                                {leaderboard.title}
                              </Text>
                              <Text size="xs" c="dimmed" lineClamp={1} style={{ fontSize: '0.7rem' }}>
                                {leaderboard.description}
                              </Text>
                            </Box>
                          </Group>

                          {/* Top Entry */}
                          <Box
                            p="xs"
                            style={{
                              backgroundColor: 'light-dark(#fff9e6, #2d2a1f)',
                              borderRadius: 4,
                              border: '1px solid gold'
                            }}
                          >
                            <Group justify="space-between" align="center">
                              <Group gap="xs">
                                <IconCrown size={12} color="gold" />
                                <Text fw={600} size="xs">
                                  {leaderboard.topUser}
                                </Text>
                              </Group>
                              <Text fw={700} size="xs" c="yellow">
                                {leaderboard.topScore}
                              </Text>
                            </Group>
                          </Box>

                          {/* Author */}
                          <Group gap="xs" justify="flex-end">
                            <Text size="xs" c="dimmed" style={{ fontSize: '0.65rem' }}>
                              by {leaderboard.author}
                            </Text>
                          </Group>
                        </Stack>
                      </Card>
                    ))}
                  </Stack>
                </ScrollArea>
              </Card>
            </Box>
          )}
        </Flex>
      )}
    </Container>
  )
}

'use client'

import {
  Modal,
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
} from '@tabler/icons-react'
import styles from '@/css/components/gameModal.module.scss'
import { AchievementType } from '@/enums/achievementType'
import { useEffect, useRef, useState } from 'react'
import notificationHelper from '@/helpers/notificationHelper'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { doQueryGet } from '@/helpers/apiClient'
import { GetLoggedInSpecificGameInfoResponse } from '@/interfaces/api/games/GetLoggedInSpecificGameInfoResponse'
import { useMutationApiData } from '@/helpers/mutations/useMutationApiData'

interface LoggedInGameModalProps {
  gameId: number
  onClose: () => void
}

export function LoggedInGameModal(props: LoggedInGameModalProps) {
  const isSmall = useMediaQuery('(max-width: 1100px)')
  const queryClient = useQueryClient()

  const { isLoading, isError, data, refetch } = useQuery({
    queryKey: ['getGameInfoForUser', props.gameId],
    refetchOnMount: true,
    queryFn: async () => await doQueryGet<GetLoggedInSpecificGameInfoResponse>(`/api/games/GetGameInfoForUser/${props.gameId}`)
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

      notificationHelper.showSuccessNotification('Success', data?.gameTracked === true ? 'Game untracked.' : 'Game tracked.', 3000, <IconCheck size={16} />)
    },
    onError: () => {
      notificationHelper.showErrorNotification('Error', 'Failed to update tracked game.', 3000, <IconInfoCircle size={16} />)
    }
  })

  const [hideUnlockedAchievements, setHideUnlockedAchievements] = useState(false)
  const [showProgressionOnly, setShowProgressionOnly] = useState(false)
  const [showMissableOnly, setShowMissableOnly] = useState(false)
  const [autoUpdateChecked, setAutoUpdateChecked] = useState(false)
  const [disabled, setDisabled] = useState(false)
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

  return (
    <Modal
      opened={props.gameId !== undefined}
      onClose={() => props.onClose()}
      size={'75%'}
      padding="sm"
      radius="sm"
      title={
        // If gameQuery is loading, show a loading state
        isLoading ? (
          <Text>Loading...</Text>
        ) : isError ? (
          <Text c="red">Error loading game info</Text>
        ) : (
          <Group gap="md" align="center" justify="center" style={{ flexWrap: 'nowrap' }}>
            <Box className={styles.iconBox}>
              <Image
                src={`https://media.retroachievements.org${data?.gameImage}`}
                alt="Game Icon"
                width={64}
                height={64}
                radius="sm"
                className={styles.gameIcon}
              />
            </Box>
            <Text size="xl" fw={700}>
              {data?.title}
            </Text>
          </Group>
        )
      }
    >
      {/* If gameQuery is loading, show a loading state */}
      {isLoading &&
        <Text>Loading game details...</Text>
      }

      {isError &&
        <Text c="red">Error loading game info</Text>
      }

      {data !== undefined &&
        <>
          <SimpleGrid cols={isSmall ? 1 : 3} mb="md" mt={20}>
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
                      <Text size="sm">Developer: {data.developer!== '' || 'Not Set'}</Text>
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

          <SimpleGrid cols={isSmall ? 1 : 2} mb="md" mt={10}>
            {data.achievements
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
                      backgroundColor: 'light-dark(#f9f9f9, #263042)',
                      borderColor:
                        achievement.type === AchievementType.Missable
                          ? 'var(--mantine-color-orange-filled)'
                          : achievement.type === AchievementType.Progression
                            ? 'var(--mantine-color-cyan-filled)'
                            : achievement.type === AchievementType.Win_Condition
                              ? 'var(--mantine-color-green-filled)'
                              : 'transparent'
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

          {/* Notes Section */}
          {/* <Stack gap="xs" mb="md">
          <Text fw={500}>Your Notes</Text>
          <Textarea
            placeholder="Write your notes here..."
            minRows={3}
            autosize
          />
          <Group justify="right">
            <Button>Save Notes</Button>
          </Group>
        </Stack> */}
          <Paper className={styles.footer}>
            <Group justify="apart" gap="xs">
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
              <Button
                component="a"
                variant="gradient"
                gradient={{ from: 'indigo', to: 'cyan' }}
                target="_blank"
                style={{ ':hover': { color: 'white' } }}
                href={'https://retroachievements.org/game/' + data.gameId}
              >
                RA Page
              </Button>
              <Checkbox
                label="Auto Update Achievements"
                checked={autoUpdateChecked}
                onChange={(e) => setAutoUpdateChecked(e.currentTarget.checked)}
              />
            </Group>
          </Paper>

        </>
      }
    </Modal>
  )
}

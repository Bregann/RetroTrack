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
  Textarea,
  Button,
  Divider,
  Progress,
  Box,
  Checkbox,
  Tooltip,
  Paper,
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
} from '@tabler/icons-react'
import styles from '@/css/components/gameModal.module.scss'
import { useLoggedInGameInfoQuery } from '@/hooks/games/useLoggedInGameInfoQuery'
import { AchievementType } from '@/enums/achievementType'
import { useEffect, useRef, useState } from 'react'
import notificationHelper from '@/helpers/notificationHelper'

interface LoggedInGameModalProps {
  gameId: number
  onClose: () => void
}

export function LoggedInGameModal(props: LoggedInGameModalProps) {
  const isSmall = useMediaQuery('(max-width: 1100px)')
  const gameQuery = useLoggedInGameInfoQuery(props.gameId)

  const [hideUnlockedAchievements, setHideUnlockedAchievements] = useState(false)
  const [showProgressionOnly, setShowProgressionOnly] = useState(false)
  const [showMissableOnly, setShowMissableOnly] = useState(false)
  const [autoUpdateChecked, setAutoUpdateChecked] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const gameAutoUpdateTimerRef = useRef<NodeJS.Timeout | null>(null)
  const gameUpdateButtonTimerRef = useRef<NodeJS.Timeout | null>(null)

  const handleGameUpdate = async () => {
    setDisabled(true)
    await gameQuery.refetch()
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
      console.log('Setting up interval for game updates')
      gameAutoUpdateTimerRef.current = setInterval(async () => {
        await gameQuery.refetch()
      }, 60000)
    }
    if (!autoUpdateChecked && gameAutoUpdateTimerRef.current !== null) {
      clearInterval(gameAutoUpdateTimerRef.current)
      gameAutoUpdateTimerRef.current = null
      notificationHelper.showSuccessNotification('Disabled', 'Achievement auto updates disabled', 3000, <IconCheck />)
    }

  }, [autoUpdateChecked, gameQuery])

  return (
    <Modal
      opened={props.gameId !== undefined}
      onClose={() => props.onClose()}
      size={'75%'}
      padding="sm"
      radius="sm"
      title={
        // If gameQuery is loading, show a loading state
        gameQuery.isLoading ? (
          <Text>Loading...</Text>
        ) : gameQuery.isError ? (
          <Text c="red">Error loading game info</Text>
        ) : (
          <Group gap="md" align="center" justify="center" style={{ flexWrap: 'nowrap' }}>
            <Box className={styles.iconBox}>
              <Image
                src={`https://media.retroachievements.org${gameQuery.data?.gameImage}`}
                alt="Game Icon"
                width={64}
                height={64}
                radius="sm"
                className={styles.gameIcon}
              />
            </Box>
            <Text size="xl" fw={700}>
              {gameQuery.data?.title}
            </Text>
          </Group>
        )
      }
    >
      {/* If gameQuery is loading, show a loading state */}
      {gameQuery.isLoading &&
        <Text>Loading game details...</Text>
      }

      {gameQuery.isError &&
        <Text c="red">Error loading game info</Text>
      }

      {gameQuery.data !== undefined &&
      <>
        <SimpleGrid cols={isSmall ? 1 : 3} mb="md">
          <Image
            src={`https://media.retroachievements.org${gameQuery.data.imageInGame}`}
            alt="In-Game Screenshot"
            radius="sm"
            className={styles.gameScreenshot}
          />
          <Image
            src={`https://media.retroachievements.org${gameQuery.data.imageTitle}`}
            alt="Title Screen"
            radius="sm"
            className={styles.gameScreenshot}
          />
          <Box className={styles.gameCoverBox}>
            <Image
              src={`https://media.retroachievements.org${gameQuery.data.imageBoxArt}`}
              alt="Box Art"
              radius="sm"
              className={styles.gameCoverArt}
            />
          </Box>
        </SimpleGrid>

        <Divider my="sm" label="Summary" labelPosition="center" styles={{ label: { fontSize: 15 } }} />

        <SimpleGrid cols={isSmall ? 2 : 4} mb="md">
          <Card withBorder>
            <Stack align="center" gap={6}>
              <ThemeIcon size="xl" radius="md" color="yellow">
                <IconTrophy size={24} />
              </ThemeIcon>
              <Text fw={700} ta={'center'}>{gameQuery.data.achievementsAwardedTotal}/{gameQuery.data.achievementCount} Achievements</Text>
              <Stack gap="xs" justify="center" ta={'center'}>
                <Text size="sm" c="dimmed">73.73% complete</Text>
                {gameQuery.data.achievementsAwardedSoftcore !== gameQuery.data.achievementsAwardedHardcore && <Text size="sm" c="cyan">Softcore: {gameQuery.data.achievementsAwardedSoftcore}</Text>}
                {gameQuery.data.achievementsAwardedHardcore !== 0 && <Text size="sm" c="orange">Hardcore: {gameQuery.data.achievementsAwardedHardcore}</Text>}
                <Text size="sm" c="grey">Locked: {gameQuery.data.achievementCount - gameQuery.data.achievementsAwardedTotal}</Text>
              </Stack>
            </Stack>
          </Card>

          <Card withBorder>
            <Stack align="center" gap={6}>
              <ThemeIcon size="xl" radius="md" color="teal">
                <IconStar size={24} />
              </ThemeIcon>
              <Text fw={700} ta={'center'}>{gameQuery.data.pointsAwardedTotal}/{gameQuery.data.totalGamePoints} Points</Text>
              <Stack gap="xs" justify="center" ta={'center'}>
                <Text size="sm" c="dimmed">73.73% complete</Text>
                {gameQuery.data.pointsAwardedSoftcore !== gameQuery.data.pointsAwardedHardcore && <Text size="sm" c="cyan">Softcore: {gameQuery.data.pointsAwardedSoftcore}</Text>}
                {gameQuery.data.pointsAwardedHardcore !== 0 && <Text size="sm" c="cyan">Hardcore: {gameQuery.data.pointsAwardedHardcore}</Text>}
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
                    <Text size="sm">{gameQuery.data.consoleName}</Text>
                  </Group>
                  <Group gap="xs">
                    <IconStar size={16} />
                    <Text size="sm">{gameQuery.data.genre || 'Not Set'}</Text>
                  </Group>
                </Stack>

                <Stack gap="4">
                  <Group gap="xs">
                    <IconBuilding size={16} />
                    <Text size="sm">Publisher: {gameQuery.data.publisher || 'Not Set'}</Text>
                  </Group>
                  <Group gap="xs">
                    <IconTools size={16} />
                    <Text size="sm">Developer: {gameQuery.data.developer || 'Not Set'}</Text>
                  </Group>
                </Stack>
              </Group>

              <Group gap="xs">
                <IconUsers size={16} />
                <Text size="sm">{gameQuery.data.players} Players</Text>
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
                  {gameQuery.data.dateBeatenHardcore === null && gameQuery.data.dateBeatenSoftcore === null
                    ? 'N/A'
                    : gameQuery.data.dateBeatenHardcore ?? gameQuery.data.dateBeatenSoftcore}
                </Text>

                <Group gap="6" justify='center' mt={10}>
                  <IconDeviceGamepad size={16} />
                  <Text>Date Completed/Mastered:</Text>
                </Group>
                <Text size="sm" c="dimmed" ta={'center'}>
                  {gameQuery.data.dateMastered === null && gameQuery.data.dateCompleted === null
                    ? 'N/A'
                    : gameQuery.data.dateMastered ?? gameQuery.data.dateCompleted}
                </Text>
              </Stack>
            </Stack>
          </Card>
        </SimpleGrid>

        <Divider my="sm" label="Achievements" labelPosition="center" styles={{ label: { fontSize: 15 } }}/>
        <Progress.Root size={20} className={styles.progressBar}>
          {gameQuery.data.achievementsAwardedHardcore != 0 && <Progress.Section value={gameQuery.data.achievementsAwardedHardcore} color="orange">
            <Progress.Label>Hardcore ({gameQuery.data.achievementsAwardedHardcore})</Progress.Label>
          </Progress.Section>}
          {gameQuery.data.achievementsAwardedSoftcore !== gameQuery.data.achievementsAwardedHardcore && <Progress.Section value={gameQuery.data.achievementsAwardedSoftcore} color="cyan">
            <Progress.Label>Softcore ({gameQuery.data.achievementsAwardedSoftcore})</Progress.Label>
          </Progress.Section>}
          <Progress.Section value={gameQuery.data.achievementCount - gameQuery.data.achievementsAwardedTotal} color="grey">
            <Progress.Label>Locked ({gameQuery.data.achievementCount - gameQuery.data.achievementsAwardedTotal})</Progress.Label>
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
          {gameQuery.data.achievements
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
                  x.type === AchievementType.Progression||
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
                      {achievement.dateEarnedSoftcore && <Text size="xs" c="dimmed" mt={5}>Unlocked: {achievement.dateEarnedSoftcore}</Text>}
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
          <Group justify="apart">
            <Button onClick={async () => { await handleGameUpdate() }} disabled={disabled}>Update Game</Button>
            <Group gap="sm">
              <Button>
            Track Game
              </Button>
              <Button>Game Page</Button>
              <Button>RA Page</Button>
              <Checkbox
                label="Auto Update Achievements"
                checked={autoUpdateChecked}
                onChange={(e) => setAutoUpdateChecked(e.currentTarget.checked)}
              />
            </Group>
          </Group>
        </Paper>

      </>
      }
    </Modal>
  )
}

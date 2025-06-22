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
import { useState } from 'react'

interface LoggedInGameModalProps {
  gameId: number
  onClose: () => void
}

export function LoggedInGameModal(props: LoggedInGameModalProps) {
  const isSmall = useMediaQuery('(max-width: 1100px)')
  const gameQuery = useLoggedInGameInfoQuery(props.gameId)

  const [showProgressionOnly, setShowProgressionOnly] = useState(false)
  const [showMissableOnly, setShowMissableOnly] = useState(false)

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
                {gameQuery.data.achievementsAwardedSoftcore !== 0 && <Text size="sm" c="cyan">Softcore: {gameQuery.data.achievementsAwardedSoftcore}</Text>}
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
                {gameQuery.data.pointsAwardedSoftcore !== 0 && <Text size="sm" c="cyan">Softcore: {gameQuery.data.pointsAwardedSoftcore}</Text>}
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
                <Group gap="6"><IconDeviceGamepad size={16} /> <Text>Date Beaten:</Text></Group>
                <Text size="sm" c="dimmed" ta={'center'}>2023-10-01</Text>

                <Group gap="6"><IconDeviceGamepad size={16} /> <Text>Date Mastered:</Text></Group>
                <Text size="sm" c="dimmed" ta={'center'}>2023-10-01</Text>
              </Stack>
            </Stack>
          </Card>
        </SimpleGrid>

        <Divider my="sm" label="Achievements" labelPosition="center" styles={{ label: { fontSize: 15 } }} />
        <Progress.Root size={20} className={styles.progressBar}>
          {gameQuery.data.achievementsAwardedHardcore != 0 && <Progress.Section value={gameQuery.data.achievementsAwardedHardcore} color="orange">
            <Progress.Label>Hardcore ({gameQuery.data.achievementsAwardedHardcore})</Progress.Label>
          </Progress.Section>}
          {gameQuery.data.achievementsAwardedSoftcore != 0 && <Progress.Section value={gameQuery.data.achievementsAwardedSoftcore} color="orange">
            <Progress.Label>Softcore ({gameQuery.data.achievementsAwardedSoftcore})</Progress.Label>
          </Progress.Section>}
          <Progress.Section value={gameQuery.data.achievementCount - gameQuery.data.achievementsAwardedTotal} color="grey">
            <Progress.Label>Locked ({gameQuery.data.achievementCount - gameQuery.data.achievementsAwardedTotal})</Progress.Label>
          </Progress.Section>
        </Progress.Root>
        <Group>
          <Checkbox
            label="Hide Unlocked Achievements"
          />
          <Checkbox
            label="Show Progression Achievements Only"
          />
          <Checkbox
            label="Show Missable Achievements Only"
          />
        </Group>

        <SimpleGrid cols={isSmall ? 1 : 2} mb="md" mt={10}>
          {gameQuery.data.achievements
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
                      {achievement.dateEarnedSoftcore && <Text size="xs" c="dimmed" mt={5}>{achievement.dateEarnedSoftcore}</Text>}
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


        <SimpleGrid cols={isSmall ? 1 : 2} mb="md" mt={10}>
          <Card withBorder radius="sm" p="sm" style={{ position: 'relative' }}>
            <Group align="center" gap="md">
              <Box className={styles.iconBox}>
                <Image
                  src="https://media.retroachievements.org/Badge/451988.png"
                  alt="Achv 1"
                  width={64}
                  height={64}
                  radius="sm"
                  style={{ objectFit: 'contain' }}
                />
              </Box>

              <Stack gap={2} style={{ flex: 1 }}>
                <Text fw={500}>Achievement Title 1</Text>
                <Text size="sm" c="dimmed">
                Achievement Description 1
                </Text>
              </Stack>

              <Text fw={600} size="lg" c="yellow" mb={20}>
              10
              </Text>
            </Group>

            {/* Optional badge icon in bottom right */}
            <Box className={styles.achievementIconTypeBox}>
              {/* e.g. progression icon */}
              <ThemeIcon color="cyan" size="sm" radius="xl">
                <IconAward size={16} />
              </ThemeIcon>
            </Box>
          </Card>
          <Card withBorder radius="sm" p="sm" style={{ position: 'relative' }}>
            <Group align="center" gap="md">
              <Box style={{ width: 64, height: 64, flexShrink: 0 }}>
                <Image
                  src="https://media.retroachievements.org/Badge/451988.png"
                  alt="Achv 1"
                  width={64}
                  height={64}
                  radius="sm"
                  style={{ objectFit: 'contain' }}
                />
              </Box>

              <Stack gap={2} style={{ flex: 1 }}>
                <Text fw={500}>Achievement Title 1</Text>
                <Text size="sm" c="dimmed">
                Achievement Description 1
                </Text>
                <Text size="xs" c="dimmed" mt={5}>
                Unlocked on: 2023-10-01 12:34:56
                </Text>
              </Stack>

              <Text fw={600} size="lg" c="yellow" mb={20}>
              10
              </Text>
            </Group>

            <Box
              style={{
                position: 'absolute',
                bottom: 8,
                right: 8,
              }}
            >
              <ThemeIcon color="cyan" size="sm" radius="xl">
                <IconAward size={16} />
              </ThemeIcon>
            </Box>
          </Card>
          <Card withBorder radius="sm" p="sm" style={{ position: 'relative' }}>
            <Group align="center" gap="md">
              <Box style={{ width: 64, height: 64, flexShrink: 0 }}>
                <Image
                  src="https://media.retroachievements.org/Badge/451988.png"
                  alt="Achv 1"
                  width={64}
                  height={64}
                  radius="sm"
                  style={{ objectFit: 'contain' }}
                />
              </Box>

              <Stack gap={2} style={{ flex: 1 }}>
                <Text fw={500}>Achievement Title 1</Text>
                <Text size="sm" c="dimmed">
                Achievement Description 1
                </Text>
              </Stack>

              <Text fw={600} size="lg" c="yellow" mb={20}>
              10
              </Text>
            </Group>

            <Box
              style={{
                position: 'absolute',
                bottom: 8,
                right: 8,
              }}
            >
              <ThemeIcon color="cyan" size="sm" radius="xl">
                <IconAward size={16} />
              </ThemeIcon>
            </Box>
          </Card>
        </SimpleGrid>

        {/* Notes Section */}
        <Stack gap="xs" mb="md">
          <Text fw={500}>Your Notes</Text>
          <Textarea
            placeholder="Write your notes here..."
            minRows={3}
            autosize
          />
          <Group justify="right">
            <Button>Save Notes</Button>
          </Group>
        </Stack>

        {/* Action Buttons */}
        <Group justify="apart">
          <Button variant="outline">Update</Button>
          <Group gap="sm">
            <Button variant="gradient" gradient={{ from: 'cyan', to: 'blue' }}>
            Track Game
            </Button>
            <Button>Details</Button>
            <Button>RA Page</Button>
          </Group>
        </Group>
      </>
      }
    </Modal >
  )
}

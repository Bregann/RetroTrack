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
  IconAward,
  IconBuilding,
  IconTools,
  IconCheck,
  IconExclamationMark,
} from '@tabler/icons-react'
import styles from '@/css/components/gameModal.module.scss'
import { useState } from 'react'
import { AchievementType } from '@/enums/achievementType'
import { useQuery } from '@tanstack/react-query'
import { doQueryGet } from '@/helpers/apiClient'
import { GetPublicSpecificGameInfoResponse } from '@/interfaces/api/games/GetPublicSpecificGameInfoResponse'
import Link from 'next/link'

interface LoggedOutGameModalProps {
  gameId: number
  onClose: () => void
}

export function LoggedOutGameModal(props: LoggedOutGameModalProps) {
  const isSmall = useMediaQuery('(max-width: 1100px)')
  const { isLoading, isError, data } = useQuery({
    queryKey: ['getPublicSpecificGameInfo', props.gameId],
    refetchOnMount: true,
    queryFn: async () => await doQueryGet<GetPublicSpecificGameInfoResponse>(`/api/games/getPublicSpecificGameInfo/${props.gameId}`)
  })

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

          <SimpleGrid cols={isSmall ? 2 : 3} mb="md">
            <Card withBorder>
              <Stack align="center" justify="center" h="100%" style={{ minHeight: 120 }}>
                <ThemeIcon size="xl" radius="md" color="yellow">
                  <IconTrophy size={24} />
                </ThemeIcon>
                <Text fw={700} ta="center">{data.achievementCount} Achievements</Text>
              </Stack>
            </Card>

            <Card withBorder>
              <Stack align="center" justify="center" h="100%" style={{ minHeight: 120 }}>
                <ThemeIcon size="xl" radius="md" color="teal">
                  <IconStar size={24} />
                </ThemeIcon>
                <Text fw={700} ta={'center'}>{data.achievements.reduce((partialSum, x) => partialSum + x.points, 0)} Points</Text>
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
          </SimpleGrid>

          <Divider my="sm" label="Achievements" labelPosition="center" styles={{ label: { fontSize: 15 } }} />
          <Group>
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
              .sort((a, b) => {
                // Sort by achievement order, or by id if achievement order is 0
                const aSort = a.achievementOrder !== 0 ? a.achievementOrder : a.id
                const bSort = b.achievementOrder !== 0 ? b.achievementOrder : b.id
                return aSort - bSort
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
                      backgroundColor: 'light-dark(#f9f9f9, #263042)',
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

          {/* Action Buttons */}
          <Paper className={styles.footer}>
            <Group justify="apart">
              <Button
                component="a"
                variant="gradient"
                gradient={{ from: 'indigo', to: 'cyan' }}
                target="_blank"
                style={{ ':hover': { color: 'white' } }}
                href={'https://retroachievements.org/game/' + data.gameId}
              >
                RetroAchievements Page
              </Button>
              <Button
                component={Link}
                variant="gradient"
                gradient={{ from: 'teal', to: 'lime', deg: 105 }}
                href={'/game/'.concat(data.gameId.toString()) }
                onClick={() => props.onClose()}
              >
                RetroTrack Page
              </Button>
            </Group>
          </Paper>
        </>
      }
    </Modal >
  )
}

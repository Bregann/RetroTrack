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
  Box,
  Checkbox,
  Tooltip,
  Paper,
  Title,
  Badge,
  Flex,
  ScrollArea,
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
  IconCrown,
} from '@tabler/icons-react'
import styles from '@/css/components/gameModal.module.scss'
import pageStyles from '@/css/pages/gamePage.module.scss'
import { useState } from 'react'
import { AchievementType } from '@/enums/achievementType'
import { useQuery } from '@tanstack/react-query'
import { doQueryGet } from '@/helpers/apiClient'
import { GetPublicSpecificGameInfoResponse } from '@/interfaces/api/games/GetPublicSpecificGameInfoResponse'
import { GetLeaderboardsFromGameIdResponse } from '@/interfaces/api/games/GetLeaderboardsFromGameIdResponse'

interface PublicGamePageProps {
  gameId: number
}

export function PublicGamePage(props: PublicGamePageProps) {
  const isSmall = useMediaQuery('(max-width: 1100px)')
  const isMobile = useMediaQuery('(max-width: 768px)')

  const { isLoading, isError, data } = useQuery({
    queryKey: ['getPublicSpecificGameInfo', props.gameId],
    refetchOnMount: true,
    queryFn: async () => await doQueryGet<GetPublicSpecificGameInfoResponse>(`/api/games/getPublicSpecificGameInfo/${props.gameId}`)
  })

  const { data: achievementLeaderboardsData } = useQuery({
    queryKey: ['getAchievementLeaderboards', props.gameId],
    refetchOnMount: true,
    queryFn: async () => await doQueryGet<GetLeaderboardsFromGameIdResponse>(`/api/games/GetLeaderboardsFromGameId/${props.gameId}`)
  })

  const [showProgressionOnly, setShowProgressionOnly] = useState(false)
  const [showMissableOnly, setShowMissableOnly] = useState(false)

  return (
    <Container size="100%" px="md" py="xl" className={pageStyles.pageContainer}>
      {/* Header with back button */}
      <Group mb="xl">
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

            {/* Game Summary Cards */}
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
                        <Text size="sm">{data.genre !== '' ? data.genre : 'Not Set'}</Text>
                      </Group>
                    </Stack>

                    <Stack gap="4">
                      <Group gap="xs">
                        <IconBuilding size={16} />
                        <Text size="sm">Publisher: {data.publisher !== '' ? data.publisher : 'Not Set'}</Text>
                      </Group>
                      <Group gap="xs">
                        <IconTools size={16} />
                        <Text size="sm">Developer: {data.developer !== '' ? data.developer : 'Not Set'}</Text>
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
            <Group mb="md">
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

            {/* Achievements Grid */}
            <SimpleGrid cols={isSmall ? 1 : 2} mb="md">
              {data.achievements
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
            <Paper className={styles.footer} mb="xl">
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
              </Group>
            </Paper>
          </Box>


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

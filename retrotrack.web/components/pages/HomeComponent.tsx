'use client'

import { GetRecentlyAddedAndUpdatedGamesResponse } from '@/interfaces/api/games/GetRecentlyAddedAndUpdatedGamesResponse'
import { Badge, Card, Container, Divider, Grid, Group, Stack, Text } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { IconStar, IconTrophy } from '@tabler/icons-react'
import Image from 'next/image'
import styles from '@/css/pages/home.module.scss'
import { useGameModal } from '@/context/gameModalContext'
import consoleHelper from '@/helpers/consoleHelper'
import { useQuery } from '@tanstack/react-query'
import { doQueryGet } from '@/helpers/apiClient'
import { pressStart2P } from '@/font/pressStart2P'

export default function HomeComponent() {
  const isLg = useMediaQuery('(min-width: 1600px)')
  const isXl = useMediaQuery('(min-width: 2440px)')
  const span = isXl ? 4 : isLg ? 6 : 12

  const gameModal = useGameModal()

  const { data: pageData, isLoading: isLoadingPageData, isError: isErrorPageData, error: pageDataError } = useQuery<GetRecentlyAddedAndUpdatedGamesResponse>({
    queryKey: ['recentlyAddedAndUpdatedGames'],
    queryFn: async () => await doQueryGet<GetRecentlyAddedAndUpdatedGamesResponse>('/api/games/GetRecentlyAddedAndUpdatedGames'),
    staleTime: 60000
  })

  return (
    <Container size="100%" px="md" py="xl">
      <Stack align="center" gap="lg" mb="xl">
        <Text
          size="2rem"
          fw={700}
          ta="center"
          className={pressStart2P.className}
        >
          Welcome to RetroTrack
        </Text>
        <Text ta="center" size="lg" c="dimmed" maw={600}>
          What will you play today? Here are the latest sets added or updated on RetroAchievements. Click on a set to view the set!
        </Text>
      </Stack>

      {isLoadingPageData && (
        <Card radius="md" p="xl" className={styles.gameCard}>
          <Text ta="center" size="lg" c="dimmed">
            Loading latest sets...
          </Text>
        </Card>
      )}

      {isErrorPageData && (
        <Card radius="md" p="xl" className={styles.gameCard}>
          <Text ta="center" size="lg" c="red">
            An error occurred: {(pageDataError as Error).message}
          </Text>
        </Card>
      )}

      {pageData !== undefined && pageData.days.map((day, index) => {
        return (
          <Stack key={index} gap="xl" mb="2xl">
            <Divider
              label={day.date}
              labelPosition="center"
              classNames={{
                label: styles.mainDividerText,
              }}
            />
            <Grid gutter="xl">
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <Stack gap="lg">
                  <Divider
                    label='New Sets'
                    labelPosition="center"
                    classNames={{
                      label: styles.subDividerText,
                    }}
                  />
                  <Grid gutter="md">
                    {day.newSets.map((set, setIndex) => {
                      return (
                        <Grid.Col span={span} key={setIndex}>
                          <Card padding="lg" radius="md" className={styles.gameCard} onClick={() => gameModal.showModal(set.gameId)} style={{ cursor: 'pointer' }}>
                            <Stack gap="md">
                              <Group align="flex-start" gap="sm">
                                <Image
                                  src={`https://media.retroachievements.org${set.gameIcon}`}
                                  alt={`${set.title} achievement icon`}
                                  width={72}
                                  height={72}
                                  className={styles.roundedImage}
                                />
                                <Text
                                  fw={700}
                                  size="lg"
                                  style={{ flex: 1, wordBreak: 'break-word' }}
                                >
                                  {set.title}
                                </Text>
                              </Group>
                              <Group align='center' justify='center'>
                                <Badge color={consoleHelper.getConsoleColour(set.consoleType)} variant="filled" size="md">
                                  {set.consoleName}
                                </Badge>
                              </Group>
                              <Group gap="lg" wrap="wrap" align='center' justify='center'>
                                <Group gap={4} align="center">
                                  <IconTrophy size={18} color="#FFD700" />
                                  <Text size="sm" fw={600}>
                                    {set.achievementCount} Achievements
                                  </Text>
                                </Group>
                                <Group gap={4} align="center">
                                  <IconStar size={18} color="#4EA8DE" />
                                  <Text size="sm" fw={600}>
                                    {set.points} Points
                                  </Text>
                                </Group>
                              </Group>
                            </Stack>
                          </Card>
                        </Grid.Col>
                      )
                    })}
                  </Grid>
                </Stack>
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <Stack gap="lg">
                  <Divider
                    label='Updated Sets'
                    labelPosition="center"
                    classNames={{
                      label: styles.subDividerText,
                    }}
                  />
                  <Grid gutter="md">
                    {day.updatedSets.map((set, setIndex) => {
                      return (
                        <Grid.Col span={span} key={setIndex}>
                          <Card padding="lg" radius="md" className={styles.gameCard} onClick={() => gameModal.showModal(set.gameId)} style={{ cursor: 'pointer' }}>
                            <Stack gap="md">
                              <Group align="flex-start" gap="sm">
                                <Image
                                  src={`https://media.retroachievements.org${set.gameIcon}`}
                                  alt={`${set.title} achievement icon`}
                                  width={72}
                                  height={72}
                                  className={styles.roundedImage}
                                />
                                <Text
                                  fw={700}
                                  size="lg"
                                  style={{ flex: 1, wordBreak: 'break-word' }}
                                >
                                  {set.title}
                                </Text>
                              </Group>
                              <Group align='center' justify='center'>
                                <Badge color={consoleHelper.getConsoleColour(set.consoleType)} variant="filled" size="md">
                                  {set.consoleName}
                                </Badge>
                              </Group>
                              <Group gap="lg" wrap="wrap" align='center' justify='center'>
                                <Group gap={4} align="center">
                                  <IconTrophy size={18} color="#FFD700" />
                                  <Text size="sm" fw={600}>
                                    {set.achievementCount} Achievements
                                  </Text>
                                </Group>
                                <Group gap={4} align="center">
                                  <IconStar size={18} color="#4EA8DE" />
                                  <Text size="sm" fw={600}>
                                    {set.points} Points
                                  </Text>
                                </Group>
                              </Group>
                            </Stack>
                          </Card>
                        </Grid.Col>
                      )
                    })}
                  </Grid>
                </Stack>
              </Grid.Col>
            </Grid>
          </Stack>
        )
      })}
    </Container>
  )
}

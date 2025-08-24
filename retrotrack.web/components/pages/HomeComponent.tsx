'use client'

import { GetRecentlyAddedAndUpdatedGamesResponse } from '@/interfaces/api/games/GetRecentlyAddedAndUpdatedGamesResponse'
import { Badge, Card, Container, Divider, Grid, Group, Stack, Text } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { IconStar, IconTrophy } from '@tabler/icons-react'
import Image from 'next/image'
import styles from '@/css/pages/home.module.scss'
import { useGameModal } from '@/context/gameModalContext'
import consoleHelper from '@/helpers/consoleHelper'
import { Press_Start_2P } from 'next/font/google'
import { useQuery } from '@tanstack/react-query'
import { doQueryGet } from '@/helpers/apiClient'

const pressStart2P = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

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
    <>
      <Container size="95%">
        <Text
          size={'28px'}
          mt={'xl'}
          mb="sm"
          ta="center"
          className={pressStart2P.className}
        >
          Welcome to RetroTrack
        </Text>
        <Text ta="center">
          What will you play today? Here are the latest sets added or updated on RetroAchievements. Click on a set to view the set!
        </Text>

        {isLoadingPageData &&
          <Text ta="center" mt="md">
            Loading...
          </Text>
        }

        {isErrorPageData &&
          <Text ta="center" mt="md" c="red">
            An error occurred: {(pageDataError as Error).message}
          </Text>
        }

        {pageData !== undefined && pageData.days.map((day, index) => {
          return (
            <div key={index}>
              <Divider
                label={day.date}
                labelPosition="center"
                classNames={{
                  label: styles.mainDividerText,
                }}
              />
              <Grid gutter={'5%'}>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <Divider
                    label='New Sets'
                    labelPosition="center"
                    classNames={{
                      label: styles.subDividerText,
                    }}
                  />
                  <Grid>
                    {day.newSets.map((set, setIndex) => {
                      return (
                        <Grid.Col span={span} key={setIndex}>
                          <Card padding="md" radius="md" shadow="md" className={styles.newSetCardBorder} onClick={() => gameModal.showModal(set.gameId)} style={{ cursor: 'pointer' }}>
                            <Stack gap="md">
                              <Group align="flex-start" gap="sm" >
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
                                <Badge color={consoleHelper.getConsoleColour(set.consoleType)} variant="filled" size="md" style={{ marginTop: -5 }}>
                                  {set.consoleName}
                                </Badge>
                              </Group>
                              <Group gap="lg" wrap="wrap" align='center' justify='center'>
                                <Group gap={4} align="center">
                                  <IconTrophy size={20} color="#FFD700" />
                                  <Text size="sm" fw={600}>
                                    {set.achievementCount} Achievements
                                  </Text>
                                </Group>
                                <Group gap={4} align="center">
                                  <IconStar size={20} color="#4EA8DE" />
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
                </Grid.Col>
                <Grid.Col span={6}>
                  <Divider
                    label='Updated Sets'
                    labelPosition="center"
                    classNames={{
                      label: styles.subDividerText,
                    }}
                  />
                  <Grid>
                    {day.updatedSets.map((set, setIndex) => {
                      return (
                        <Grid.Col span={span} key={setIndex}>
                          <Card padding="md" radius="md" shadow="md" className={styles.updatedSetCardBorder} onClick={() => gameModal.showModal(set.gameId)} style={{ cursor: 'pointer' }}>
                            <Stack gap="md">
                              <Group align="flex-start" gap="sm" >
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
                                <Badge color={consoleHelper.getConsoleColour(set.consoleType)} variant="filled" size="md" style={{ marginTop: -5 }}>
                                  {set.consoleName}
                                </Badge>
                              </Group>
                              <Group gap="lg" wrap="wrap" align='center' justify='center'>
                                <Group gap={4} align="center">
                                  <IconTrophy size={20} color="#FFD700" />
                                  <Text size="sm" fw={600}>
                                    {set.achievementCount} Achievements
                                  </Text>
                                </Group>
                                <Group gap={4} align="center">
                                  <IconStar size={20} color="#4EA8DE" />
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
                </Grid.Col>
              </Grid>
            </div>
          )
        })}
      </Container>
    </>
  )
}

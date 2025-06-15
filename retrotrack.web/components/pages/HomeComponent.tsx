'use client'

import ConsoleHelper from '@/helpers/ConsoleHelper'
import { GetRecentlyAddedAndUpdatedGamesResponse } from '@/interfaces/Api/Games/GetRecentlyAddedAndUpdatedGamesResponse'
import { Badge, Card, Container, Grid, Group, Stack, Text } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { IconStar, IconTrophy } from '@tabler/icons-react'
import Image from 'next/image'

export interface HomeComponentProps {
  pageData: GetRecentlyAddedAndUpdatedGamesResponse
}

export default function HomeComponent(props: HomeComponentProps) {
  const isLg = useMediaQuery('(min-width: 1600px)')
  const isXl = useMediaQuery('(min-width: 2440px)')
  const span = isXl ? 4 : isLg ? 6 : 12

  return (
    <>
      <Container size="95%">
        <h1>Welcome to RetroTrack</h1>
        {props.pageData.days.map((day, index) => {
          return (
            <div key={index}>
              <h1>{day.date}</h1>
              <Grid gutter={'5%'}>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <h2>New Sets</h2>
                  <Grid>
                    {day.newSets.map((set, setIndex) => {
                      return (
                        <Grid.Col span={span}key={setIndex}>
                          <Card padding="md" radius="md" shadow="md" withBorder>
                            <Stack gap="md">
                              <Group align="flex-start" gap="sm" >
                                <Image
                                  src={`https://media.retroachievements.org${set.gameIcon}`}
                                  alt={`${set.title} achievement icon`}
                                  width={64}
                                  height={64}
                                  style={{ flexShrink: 0 }}
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
                                <Badge color={ConsoleHelper.getConsoleColour(set.consoleType)} variant="filled" size="md">
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
                  <h2>Updated Sets</h2>
                  <Grid>
                    {day.updatedSets.map((set, setIndex) => {
                      return (
                        <Grid.Col span={span}key={setIndex}>
                          <Card padding="md" radius="md" shadow="md" withBorder>
                            <Stack gap="md">
                              <Group align="flex-start" gap="sm" >
                                <Image
                                  src={`https://media.retroachievements.org${set.gameIcon}`}
                                  alt={`${set.title} achievement icon`}
                                  width={64}
                                  height={64}
                                  style={{ flexShrink: 0 }}
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
                                <Badge color={ConsoleHelper.getConsoleColour(set.consoleType)} variant="filled" size="md">
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

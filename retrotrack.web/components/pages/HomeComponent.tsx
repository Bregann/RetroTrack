'use client'

import ConsoleHelper from '@/helpers/ConsoleHelper'
import { GetRecentlyAddedAndUpdatedGamesResponse } from '@/interfaces/api/gamess/GetRecentlyAddedAndUpdatedGamesResponse'
import { Badge, Button, Card, Container, Divider, Grid, Group, Stack, Text } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { IconStar, IconTrophy } from '@tabler/icons-react'
import Image from 'next/image'
import styles from '@/css/pages/home.module.scss'
import { useGameModal } from '@/context/gameModalContext'

export interface HomeComponentProps {
  pageData: GetRecentlyAddedAndUpdatedGamesResponse
}

export default function HomeComponent(props: HomeComponentProps) {
  const isLg = useMediaQuery('(min-width: 1600px)')
  const isXl = useMediaQuery('(min-width: 2440px)')
  const span = isXl ? 4 : isLg ? 6 : 12

  const gameModal = useGameModal()

  return (
    <>
      <Container size="95%">
        <Button onClick={() => {gameModal.showModal(1)}}>test</Button>
        <h1 style={{ textAlign: 'center' }}>Welcome to RetroTrack</h1>
        <p style={{ textAlign: 'center', marginTop: -10 }}>
          What will you play today? Here are the latest sets added or updated on RetroAchievements. Click on a set to view the set!
        </p>
        {props.pageData.days.map((day, index) => {
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
                        <Grid.Col span={span}key={setIndex}>
                          <Card padding="md" radius="md" shadow="md" className={styles.newSetCardBorder}>
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
                                <Badge color={ConsoleHelper.getConsoleColour(set.consoleType)} variant="filled" size="md" style={{ marginTop: -5 }}>
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
                        <Grid.Col span={span}key={setIndex}>
                          <Card padding="md" radius="md" shadow="md" className={styles.updatedSetCardBorder}>
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
                                <Badge color={ConsoleHelper.getConsoleColour(set.consoleType)} variant="filled" size="md" style={{ marginTop: -5 }}>
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

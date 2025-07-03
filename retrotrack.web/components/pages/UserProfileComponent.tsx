'use client'

import React from 'react'
import {
  Container,
  Group,
  Avatar,
  Text,
  Title,
  SimpleGrid,
  Card,
  Stack,
  Divider,
  Tooltip,
  Box,
  Grid,
  Progress,
  Accordion,
} from '@mantine/core'
import { IconLock } from '@tabler/icons-react'
import styles from '@/css/pages/profile.module.scss'
import { useMediaQuery } from '@mantine/hooks'
import { GetUserProfileResponse } from '@/interfaces/api/users/GetUserProfileResponse'
import { ConsoleType } from '@/enums/consoleType'
import { HighestAwardKind } from '@/enums/highestAwardKind'
import { useGameModal } from '@/context/gameModalContext'
import Image from 'next/image'

interface UserProfileProps {
  pageData: GetUserProfileResponse
}

export default function UserProfileComponent({ pageData }: UserProfileProps) {
  const isSm = useMediaQuery('(min-width: 900px)')
  const isMd = useMediaQuery('(min-width: 1200px)')
  const isLg = useMediaQuery('(min-width: 1700px)')
  const isXl = useMediaQuery('(min-width: 2440px)')

  const wallIconAmount = isXl ? 16 : isLg ? 14 : isMd ? 6 : isSm ? 5 : 4
  const statColsAmount = isLg ? 4 : isMd ? 2 : 1

  const consoleTypes = [ConsoleType.Nintendo, ConsoleType.Sony, ConsoleType.Atari, ConsoleType.Sega, ConsoleType.NEC, ConsoleType.SNK, ConsoleType.Other]

  const gameModal = useGameModal()

  return (
    <Container size={'95%'} mt={40}>
      <Group align="center" gap="lg" mb="lg">
        <Avatar src={`https://media.retroachievements.org/UserPic/${pageData.raUsername}.png`} size={100} radius="xl" />
        <Stack gap={4}>
          <Title order={2}>{pageData.raUsername}</Title>
          <Group gap="xl">
            <Stack gap={2}>
              {pageData.softcorePoints !== pageData.hardcorePoints && <Text>Softcore Points: <Text component="span" fw={700}>{pageData.softcorePoints}</Text></Text>}
              {pageData.hardcorePoints !== 0 && <Text>Hardcore Points: <Text component="span" fw={700}>{pageData.hardcorePoints}</Text></Text>}
              { pageData.lastUserUpdate &&
              <Text c="dimmed" size="sm" >
                Last Updated: {new Date(pageData.lastUserUpdate).toLocaleDateString()} {new Date(pageData.lastUserUpdate).toLocaleTimeString()}
              </Text>
              }
            </Stack>

          </Group>
        </Stack>
      </Group>

      <SimpleGrid cols={statColsAmount} mb="xl">
        <Card withBorder radius="md" p="lg" className={styles.statCard}>
          <Stack align="center" gap="xs">
            <Text fw={700}>Games Beaten</Text>
            <Stack gap={0} align="center">
              {pageData.gamesBeatenSoftcore !== 0 && <Text size="sm" c="dimmed">Softcore: <Text component="span" fw={600}>{pageData.gamesBeatenSoftcore}</Text></Text>}
              {pageData.gamesBeatenHardcore !== 0 && <Text size="sm" c="gold">Hardcore: <Text component="span" fw={600}>{pageData.gamesBeatenHardcore}</Text></Text>}
            </Stack>
          </Stack>
        </Card>
        <Card withBorder radius="md" p="lg" className={styles.statCard}>
          <Stack align="center" gap="xs">
            <Text fw={700}>Games Completed/Mastered</Text>
            <Stack gap={0} align="center">
              {pageData.gamesCompleted !== 0 && <Text size="sm" c="dimmed">Softcore: <Text component="span" fw={600}>{pageData.gamesCompleted}</Text></Text>}
              {pageData.gamesMastered !== 0 && <Text size="sm" c="gold">Hardcore: <Text component="span" fw={600}>{pageData.gamesMastered}</Text></Text>}
            </Stack>
          </Stack>
        </Card>
        <Card withBorder radius="md" p="lg" className={styles.statCard}>
          <Stack align="center" gap="xs">
            <Text fw={700}>Achievements Unlocked</Text>
            <Stack gap={0} align="center">
              {pageData.achievementsEarnedSoftcore !== pageData.achievementsEarnedHardcore && <Text size="sm" c="dimmed">Softcore: <Text component="span" fw={600}>{pageData.achievementsEarnedSoftcore}</Text></Text>}
              {pageData.achievementsEarnedHardcore !== 0 && <Text size="sm" c="gold">Hardcore: <Text component="span" fw={600}>{pageData.achievementsEarnedHardcore}</Text></Text>}
            </Stack>
          </Stack>
        </Card>
        <Card withBorder radius="md" p="lg" className={styles.statCard}>
          <Stack align="center" gap="xs">
            <Text fw={700}>In Progress Games</Text>
            <Text size="lg" fw={600}>{pageData.gamesInProgress}</Text>
          </Stack>
        </Card>
      </SimpleGrid>

      <Grid gutter="xl">
        <Grid.Col span={isMd ? 8 : 12}>
          <Divider label="Beaten Games Wall" labelPosition="center" mb="md" classNames={{ label: styles.dividerText }}/>
          <SimpleGrid cols={wallIconAmount} mb="sm">
            {pageData.gamesBeatenWall.map((game) => (
              <Tooltip
                key={game.gameId}
                label={<>
                  <Text ta='center'>{game.title}</Text>
                  <Text ta='center' size="sm">{game.consoleName}</Text>
                  <Text ta='center' size="sm">Earned: {new Date(game.dateAchieved).toLocaleDateString()} {new Date(game.dateAchieved).toLocaleTimeString()}</Text>
                </>}
                position="top"
                withArrow
              >
                <Box style={{ cursor: 'pointer', width: 64, height: 64 }} onClick={() => gameModal.showModal(game.gameId)}>
                  <Image
                    src={`https://media.retroachievements.org${game.imageUrl}`}
                    alt={game.title}
                    width={64}
                    height={64}
                    className={`${styles.wallIcon} ${game.isHardcore ? styles.hardcoreBorder : ''}`}
                  />
                </Box>
              </Tooltip>
            ))}
          </SimpleGrid>

          <Divider label="Completed/Mastered Games Wall" labelPosition="center" mb="md" classNames={{ label: styles.dividerText }}/>
          <SimpleGrid cols={wallIconAmount} mb="xl">
            {pageData.gamesMasteredWall.map((game) => (
              <Tooltip
                key={game.gameId}
                label={<>
                  <Text ta='center'>{game.title}</Text>
                  <Text ta='center' size="sm">{game.consoleName}</Text>
                  <Text ta='center' size="sm">Earned: {new Date(game.dateAchieved).toLocaleDateString()} {new Date(game.dateAchieved).toLocaleTimeString()}</Text>
                </>}
                position="top"
                withArrow
              >
                <Box style={{ cursor: 'pointer', width: 64, height: 64 }} onClick={() => gameModal.showModal(game.gameId)}>
                  <Image
                    src={`https://media.retroachievements.org${game.imageUrl}`}
                    alt={game.title}
                    width={64}
                    height={64}
                    className={`${styles.wallIcon} ${game.isHardcore ? styles.hardcoreBorder : ''}`}
                  />
                </Box>
              </Tooltip>
            ))}
          </SimpleGrid>

          <Divider label="Console Progress Breakdown" labelPosition="center" mb="md" classNames={{ label: styles.dividerText }}/>
          <Accordion>
            {consoleTypes.map((console) => {
              return(
                <Accordion.Item value={ConsoleType[console]} key={console}>
                  <Accordion.Control>
                    <Text fw={600}>{ConsoleType[console]}</Text>
                  </Accordion.Control>
                  <Accordion.Panel>
                    <SimpleGrid cols={3} spacing="lg" mb="xl">
                      {pageData.consoleProgressData.filter(x => x.consoleType === console).map((consoleData) => {
                        return(
                          <Card withBorder radius="md" p="lg" key={consoleData.consoleId}>
                            <Stack gap="md">
                              <Text fw={700} size="lg">{consoleData.consoleName}</Text>
                              {/* if all values are 0 then show no progress*/}
                              {consoleData.gamesBeatenSoftcore === 0 &&
                                consoleData.gamesBeatenHardcore === 0 &&
                                consoleData.gamesCompleted === 0 &&
                                consoleData.gamesMastered === 0 &&
                                  <Text c="dimmed" size="sm">No progress made on this console.</Text>
                              }
                              <Stack gap="xs">
                                {consoleData.gamesBeatenSoftcore !== 0 &&
                                <>
                                  <Divider />
                                  <Text size="sm" c="dimmed">Softcore Beaten: <Text component="span" c="blue" fw={600}>{consoleData.gamesBeatenSoftcore}/{consoleData.totalGamesInConsole} ({consoleData.percentageBeatenSoftcore}%)</Text></Text>
                                  <Progress value={consoleData.percentageBeatenSoftcore} size="xs" color="blue" />
                                </>
                                }

                                {consoleData.gamesBeatenHardcore !== 0 &&
                                <>
                                  <Divider />
                                  <Text size="sm" c="dimmed">Hardcore Beaten: <Text component="span" c="orange" fw={600}>{consoleData.gamesBeatenHardcore}/{consoleData.totalGamesInConsole} ({consoleData.percentageBeatenHardcore}%)</Text></Text>
                                  <Progress value={consoleData.percentageBeatenHardcore} size="xs" color="orange" />
                                </>
                                }

                                {consoleData.gamesCompleted !== 0 &&
                                <>
                                  <Text size="sm" c="dimmed">Softcore Completed: <Text component="span" c="teal" fw={600}>{consoleData.gamesCompleted}/{consoleData.totalGamesInConsole} ({consoleData.percentageCompleted}%)</Text></Text>
                                  <Progress value={consoleData.percentageCompleted} size="xs" color="teal" />
                                </>
                                }

                                {consoleData.gamesMastered !== 0 &&
                                <>
                                  <Text size="sm" c="dimmed">Hardcore Mastered: <Text component="span" c="yellow" fw={600}>{consoleData.gamesMastered}/{consoleData.totalGamesInConsole} ({consoleData.percentageMastered}%)</Text></Text>
                                  <Progress value={consoleData.percentageMastered} size="xs" color="yellow" />
                                </>
                                }
                              </Stack>
                            </Stack>
                          </Card>
                        )
                      })}
                    </SimpleGrid>
                  </Accordion.Panel>
                </Accordion.Item>
              )
            })}
          </Accordion>
        </Grid.Col>

        <Grid.Col span={isMd ? 4 : 12}>
          <Divider label="Last 5 Played" labelPosition="center" mb="md" classNames={{ label: styles.dividerText }}/>
          <Stack gap="sm">
            {pageData.last5GamesPlayed.map((game) => {
              return(
                <Card key={game.gameId} withBorder radius="md" p="sm" className={styles.lastPlayedCard} style={{ cursor: 'pointer' }} onClick={() => gameModal.showModal(game.gameId)}>
                  <Stack gap="xs">
                    <Group gap="xs">
                      <Image
                        src={`https://media.retroachievements.org${game.imageUrl}`}
                        alt={game.title}
                        width={48}
                        height={48}
                        className={styles.lastPlayedIcon}
                      />
                      <Text
                        fw={600}
                        size="md"
                        className={styles.lastPlayedText}
                      >
                        {game.title}
                      </Text>
                    </Group>

                    <Group gap="md" style={{ justifyContent: 'center', width: '100%' }}
                    >
                      <Group gap="xs" align="center" justify="center">
                        <IconLock size={16} color="yellow" />
                        <Text size="xs" c="dimmed">
                          {game.achievementsUnlockedSoftcore}/{game.totalGameAchievements}
                        </Text>
                      </Group>
                    </Group>
                  </Stack>
                </Card>
              )
            })}
          </Stack>

          <Divider label="Last 5 Beaten/Mastered" labelPosition="center" mb="md" mt="md" classNames={{ label: styles.dividerText }}/>
          <Stack gap="sm">
            {pageData.last5Awards.map((game) => {
              return(
                <Card key={game.gameId} withBorder radius="md" p="sm" className={styles.lastPlayedCard} style={{ cursor: 'pointer' }} onClick={() => gameModal.showModal(game.gameId)}>
                  <Stack gap="xs">
                    <Group gap="xs">
                      <Image
                        src={`https://media.retroachievements.org${game.imageUrl}`}
                        alt={game.title}
                        width={48}
                        height={48}
                        className={styles.lastPlayedIcon}
                      />
                      <Text
                        fw={600}
                        size="md"
                        className={styles.lastPlayedText}
                      >
                        {game.title}
                      </Text>
                    </Group>
                    <Text
                      ta="center"
                      c={
                        (() => {
                          switch (game.highestAward) {
                            case HighestAwardKind.BeatenSoftcore:
                              return 'blue'
                            case HighestAwardKind.BeatenHardcore:
                              return 'orange'
                            case HighestAwardKind.Completed:
                              return 'teal'
                            case HighestAwardKind.Mastered:
                              return 'yellow'
                            default:
                              return 'dimmed'
                          }
                        })()
                      }
                    >
                      Status: {
                        (() => {
                          switch (game.highestAward) {
                            case HighestAwardKind.BeatenSoftcore:
                              return 'Beaten (Softcore)'
                            case HighestAwardKind.BeatenHardcore:
                              return 'Beaten (Hardcore)'
                            case HighestAwardKind.Completed:
                              return 'Completed (Softcore)'
                            case HighestAwardKind.Mastered:
                              return 'Mastered (Hardcore)'
                            default:
                              return 'Unknown'
                          }
                        })()
                      }
                    </Text>
                    <Group gap="md" style={{ justifyContent: 'center', width: '100%' }}
                    >
                      <Group gap="xs" align="center" justify="center">
                        <IconLock size={16} color="yellow" />
                        <Text size="xs" c="dimmed">
                          {game.achievementsUnlockedSoftcore}/{game.totalGameAchievements}
                        </Text>
                      </Group>
                    </Group>
                  </Stack>
                </Card>
              )
            })}
          </Stack>
        </Grid.Col>
      </Grid>
    </Container>
  )
}

'use client'

import React, { useState } from 'react'
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
  Button,
} from '@mantine/core'
import { IconCheck, IconInfoCircle, IconLock } from '@tabler/icons-react'
import styles from '@/css/pages/profile.module.scss'
import { useMediaQuery } from '@mantine/hooks'
import { GetUserProfileResponse } from '@/interfaces/api/users/GetUserProfileResponse'
import { ConsoleType } from '@/enums/consoleType'
import { HighestAwardKind } from '@/enums/highestAwardKind'
import { useGameModal } from '@/context/gameModalContext'
import Image from 'next/image'
import { closestCenter, DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, rectSortingStrategy, SortableContext, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { doPost } from '@/helpers/apiClient'
import notificationHelper from '@/helpers/notificationHelper'
import { useAuth } from '@/context/authContext'

interface UserProfileProps {
  pageData: GetUserProfileResponse
}

export default function UserProfileComponent({ pageData }: UserProfileProps) {
  const [gamesBeatenWallData, setGamesBeatenWallData] = useState(pageData.gamesBeatenWall)
  const [gamesMasteredWallData, setGamesMasteredWallData] = useState(pageData.gamesMasteredWall)
  const [editingGamesBeatenWall, setEditingGamesBeatenWall] = useState(false)
  const [editingGamesMasteredWall, setEditingGamesMasteredWall] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const isSm = useMediaQuery('(min-width: 900px)')
  const isMd = useMediaQuery('(min-width: 1200px)')
  const isLg = useMediaQuery('(min-width: 1700px)')
  const isXl = useMediaQuery('(min-width: 2440px)')

  const wallIconAmount = isXl ? 16 : isLg ? 14 : isMd ? 6 : isSm ? 5 : 4
  const statColsAmount = isLg ? 4 : isMd ? 2 : 1
  const consoleBreakdownColsAmount = isXl ? 3 : isLg ? 3 : isMd ? 2 : 1

  const consoleTypes = [ConsoleType.Nintendo, ConsoleType.Sony, ConsoleType.Atari, ConsoleType.Sega, ConsoleType.NEC, ConsoleType.SNK, ConsoleType.Other]

  const gameModal = useGameModal()
  const user = useAuth()

  const sensors = useSensors(useSensor(PointerSensor))

  const handleDragEnd = (event: DragEndEvent, isBeatenWall: boolean) => {
    const { active, over } = event

    if (over !== null && active.id !== over.id) {
      if (isBeatenWall) {
        setGamesBeatenWallData((items) => {
          const oldIndex = items.findIndex((g) => g.gameId === active.id)
          const newIndex = items.findIndex((g) => g.gameId === over.id)
          const newItems = arrayMove(items, oldIndex, newIndex)
          // Update wallPosition based on new position
          return newItems.map((item, index) => ({
            ...item,
            wallPosition: index,
          }))
        })
      } else {
        setGamesMasteredWallData((items) => {
          const oldIndex = items.findIndex((g) => g.gameId === active.id)
          const newIndex = items.findIndex((g) => g.gameId === over.id)
          const newItems = arrayMove(items, oldIndex, newIndex)
          // Update wallPosition based on new position
          return newItems.map((item, index) => ({
            ...item,
            wallPosition: index,
          }))
        })
      }
    }
  }

  const handleSaveWallPositions = async (isBeatenWall: boolean) => {
    if (isSaving) {
      return
    }

    setIsSaving(true)
    const wallData = isBeatenWall ? gamesBeatenWallData : gamesMasteredWallData
    // get the progress ids and wall positions
    const positions = wallData.map((game) => ({
      progressId: game.progressId,
      wallPosition: game.wallPosition
    }))

    const response = await doPost('/api/users/SaveUserGameWallPositions', { body: { wallData: positions } })

    if (response.ok) {
      if (isBeatenWall) {
        notificationHelper.showSuccessNotification('Success', 'Beaten games wall positions saved successfully.', 3000, <IconCheck size={16} />)
        setEditingGamesBeatenWall(false)
      } else {
        notificationHelper.showSuccessNotification('Success', 'Mastered games wall positions saved successfully.', 3000, <IconCheck size={16} />)
        setEditingGamesMasteredWall(false)
      }
    } else {
      notificationHelper.showErrorNotification('Error', 'Failed to save wall positions.', 3000, <IconInfoCircle size={16} />)
    }

    setIsSaving(false)
  }

  interface SortableTileProps {
    id: number
    icon: string
    title: string
    isHardcore: boolean
  }

  function SortableGameWallIcon({ id, icon, title, isHardcore }: SortableTileProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
      useSortable({ id })
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      cursor: isDragging ? 'grabbing' : 'grab',
      opacity: isDragging ? 0.8 : 1,
      width: 64,
      height: 64
    }

    return (
      <Box ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners} >
        <Image
          src={`https://media.retroachievements.org${icon}`}
          alt={title}
          width={64}
          height={64}
          className={`${styles.wallIcon} ${isHardcore ? styles.hardcoreBorder : ''}`}
        />
      </Box>
    )
  }

  return (
    <Container size={'95%'} mt={40}>
      <Group align="center" gap="lg" mb="lg">
        <Avatar src={`https://media.retroachievements.org/UserPic/${pageData.raUsername}.png`} size={100} radius="lg" />
        <Stack gap={4}>
          <Title order={2}>{pageData.raUsername}</Title>
          <Group gap="xl">
            <Stack gap={2}>
              {pageData.softcorePoints !== pageData.hardcorePoints && pageData.softcorePoints !== 0 && <Text>Softcore Points: <Text component="span" fw={700}>{pageData.softcorePoints.toLocaleString()}</Text></Text>}
              {pageData.hardcorePoints !== 0 && <Text>Hardcore Points: <Text component="span" fw={700}>{pageData.hardcorePoints.toLocaleString()}</Text></Text>}
              {pageData.lastUserUpdate !== undefined &&
                <Group gap={4}>
                  <Text c="dimmed" size="sm">
                    Last Updated: {new Date(pageData.lastUserUpdate).toLocaleDateString()} {new Date(pageData.lastUserUpdate).toLocaleTimeString()}
                  </Text>
                  <Tooltip label="If you are not registered, data is cached for 30 minutes unless you are registered and logged in" withArrow>
                    <Box component="span" style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
                      <IconInfoCircle size={16} color="gray" />
                    </Box>
                  </Tooltip>
                </Group>
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
              {pageData.gamesBeatenSoftcore !== 0 && <Text size="sm" c="dimmed">Softcore: <Text component="span" fw={600}>{pageData.gamesBeatenSoftcore.toLocaleString()}</Text></Text>}
              {pageData.gamesBeatenHardcore !== 0 && <Text size="sm" c="gold">Hardcore: <Text component="span" fw={600}>{pageData.gamesBeatenHardcore.toLocaleString()}</Text></Text>}
            </Stack>
          </Stack>
        </Card>
        <Card withBorder radius="md" p="lg" className={styles.statCard}>
          <Stack align="center" gap="xs">
            <Text fw={700}>Games Completed/Mastered</Text>
            <Stack gap={0} align="center">
              {pageData.gamesCompleted !== 0 && <Text size="sm" c="dimmed">Softcore: <Text component="span" fw={600}>{pageData.gamesCompleted.toLocaleString()}</Text></Text>}
              {pageData.gamesMastered !== 0 && <Text size="sm" c="gold">Hardcore: <Text component="span" fw={600}>{pageData.gamesMastered.toLocaleString()}</Text></Text>}
            </Stack>
          </Stack>
        </Card>
        <Card withBorder radius="md" p="lg" className={styles.statCard}>
          <Stack align="center" gap="xs">
            <Text fw={700}>Achievements Unlocked</Text>
            <Stack gap={0} align="center">
              {pageData.achievementsEarnedSoftcore !== pageData.achievementsEarnedHardcore && <Text size="sm" c="dimmed">Softcore: <Text component="span" fw={600}>{pageData.achievementsEarnedSoftcore.toLocaleString()}</Text></Text>}
              {pageData.achievementsEarnedHardcore !== 0 && <Text size="sm" c="gold">Hardcore: <Text component="span" fw={600}>{pageData.achievementsEarnedHardcore.toLocaleString()}</Text></Text>}
            </Stack>
          </Stack>
        </Card>
        <Card withBorder radius="md" p="lg" className={styles.statCard}>
          <Stack align="center" gap="xs">
            <Text fw={700}>In Progress Games</Text>
            <Text size="lg" fw={600}>{pageData.gamesInProgress.toLocaleString()}</Text>
          </Stack>
        </Card>
      </SimpleGrid>

      <Grid gutter="xl">
        <Grid.Col span={isMd ? 8 : 12}>
          <Divider label="Beaten Games Wall" labelPosition="center" mb="md" classNames={{ label: styles.dividerText }} />
          {user.isAuthenticated &&
            <div style={{ marginBottom: 10 }}>
              <Button disabled={isSaving} color={editingGamesBeatenWall ? 'red' : 'blue'} onClick={() => { setEditingGamesBeatenWall(!editingGamesBeatenWall) }}>{editingGamesBeatenWall ? 'Cancel' : 'Edit'}</Button>
              {editingGamesBeatenWall && <Button disabled={isSaving} onClick={() => handleSaveWallPositions(true)} color="green" ml="md">Save Changes</Button>}
            </ div>
          }
          {editingGamesBeatenWall === true ?
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(e) => { handleDragEnd(e, true) }}
            >
              <SortableContext items={gamesBeatenWallData.map((g) => g.gameId)} strategy={rectSortingStrategy}>
                <SimpleGrid cols={wallIconAmount} spacing="sm">
                  {gamesBeatenWallData.map((game) => (
                    <SortableGameWallIcon key={game.gameId} id={game.gameId} icon={game.imageUrl} title={game.title} isHardcore={game.isHardcore} />
                  ))}
                </SimpleGrid>
              </SortableContext>
            </DndContext> :
            <SimpleGrid cols={wallIconAmount} mb="sm">
              {gamesBeatenWallData.map((game) => (
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
          }

          <Divider label="Completed/Mastered Games Wall" labelPosition="center" mb="md" classNames={{ label: styles.dividerText }} />
          {user.isAuthenticated &&
            <div style={{ marginBottom: 10 }}>
              <Button disabled={isSaving} color={editingGamesMasteredWall ? 'red' : 'blue'} onClick={() => { setEditingGamesMasteredWall(!editingGamesMasteredWall) }}>{editingGamesMasteredWall ? 'Cancel' : 'Edit'}</Button>
              {editingGamesMasteredWall && <Button disabled={isSaving} onClick={() => handleSaveWallPositions(false)} color="green" ml="md">Save Changes</Button>}
            </ div>
          }
          {editingGamesMasteredWall === true ?
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(e) => { handleDragEnd(e, false) }}
            >
              <SortableContext items={gamesMasteredWallData.map((g) => g.gameId)} strategy={rectSortingStrategy}>
                <SimpleGrid cols={wallIconAmount} spacing="sm">
                  {gamesMasteredWallData.map((game) => (
                    <SortableGameWallIcon key={game.gameId} id={game.gameId} icon={game.imageUrl} title={game.title} isHardcore={game.isHardcore} />
                  ))}
                </SimpleGrid>
              </SortableContext>
            </DndContext> :
            <SimpleGrid cols={wallIconAmount} mb="sm">
              {gamesMasteredWallData.map((game) => (
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
          }

          <Divider label="Console Progress Breakdown" labelPosition="center" mb="md" classNames={{ label: styles.dividerText }} />
          <Accordion>
            {consoleTypes.map((console) => {
              return (
                <Accordion.Item value={ConsoleType[console]} key={console}>
                  <Accordion.Control>
                    <Text fw={600}>{ConsoleType[console]}</Text>
                  </Accordion.Control>
                  <Accordion.Panel>
                    <SimpleGrid cols={consoleBreakdownColsAmount} spacing="lg" mb="xl">
                      {pageData.consoleProgressData.filter(x => x.consoleType === console).map((consoleData) => {
                        return (
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
                                    <Text size="sm" c="dimmed">Softcore Beaten: <Text component="span" c="blue" fw={600}>{consoleData.gamesBeatenSoftcore.toLocaleString()}/{consoleData.totalGamesInConsole.toLocaleString()} ({consoleData.percentageBeatenSoftcore}%)</Text></Text>
                                    <Progress value={consoleData.percentageBeatenSoftcore} size="xs" color="blue" />
                                  </>
                                }

                                {consoleData.gamesBeatenHardcore !== 0 &&
                                  <>
                                    <Divider />
                                    <Text size="sm" c="dimmed">Hardcore Beaten: <Text component="span" c="orange" fw={600}>{consoleData.gamesBeatenHardcore.toLocaleString()}/{consoleData.totalGamesInConsole.toLocaleString()} ({consoleData.percentageBeatenHardcore}%)</Text></Text>
                                    <Progress value={consoleData.percentageBeatenHardcore} size="xs" color="orange" />
                                  </>
                                }

                                {consoleData.gamesCompleted !== 0 &&
                                  <>
                                    <Text size="sm" c="dimmed">Softcore Completed: <Text component="span" c="teal" fw={600}>{consoleData.gamesCompleted.toLocaleString()}/{consoleData.totalGamesInConsole.toLocaleString()} ({consoleData.percentageCompleted}%)</Text></Text>
                                    <Progress value={consoleData.percentageCompleted} size="xs" color="teal" />
                                  </>
                                }

                                {consoleData.gamesMastered !== 0 &&
                                  <>
                                    <Text size="sm" c="dimmed">Hardcore Mastered: <Text component="span" c="yellow" fw={600}>{consoleData.gamesMastered.toLocaleString()}/{consoleData.totalGamesInConsole.toLocaleString()} ({consoleData.percentageMastered}%)</Text></Text>
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
          <Divider label="Last 5 Played" labelPosition="center" mb="md" classNames={{ label: styles.dividerText }} />
          <Stack gap="sm">
            {pageData.last5GamesPlayed.map((game) => {
              return (
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

          <Divider label="Last 5 Beaten/Mastered" labelPosition="center" mb="md" mt="md" classNames={{ label: styles.dividerText }} />
          <Stack gap="sm">
            {pageData.last5Awards.map((game) => {
              return (
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

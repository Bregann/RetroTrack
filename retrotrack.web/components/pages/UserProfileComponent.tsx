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
import { GamesWall, GetUserProfileResponse } from '@/interfaces/api/users/GetUserProfileResponse'
import { ConsoleType } from '@/enums/consoleType'
import { HighestAwardKind } from '@/enums/highestAwardKind'
import { useGameModal } from '@/context/gameModalContext'
import Image from 'next/image'
import { closestCenter, DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, rectSortingStrategy, SortableContext, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { doQueryGet } from '@/helpers/apiClient'
import notificationHelper from '@/helpers/notificationHelper'
import { useAuth } from '@/context/authContext'
import { useQuery } from '@tanstack/react-query'
import Loading from '@/app/loading'
import { useMutationApiData } from '@/helpers/mutations/useMutationApiData'

interface UserProfileComponentProps {
  username: string
}

export default function UserProfileComponent(props: UserProfileComponentProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['GetUserProfile', props.username],
    queryFn: async () => await doQueryGet<GetUserProfileResponse>(`/api/users/GetUserProfile/${props.username}`, { next: { revalidate: 60 } }),
    staleTime: 60000
  })

  const [draftBeatenWall, setDraftBeatenWall] = useState<GamesWall[] | null>(null)
  const [draftMasteredWall, setDraftMasteredWall] = useState<GamesWall[] | null>(null)
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

  const handleEditWallButtonClick = (isBeatenWall: boolean) => {
    if (isBeatenWall) {
      setDraftBeatenWall(data?.gamesBeatenWall ?? null)
    } else {
      setDraftMasteredWall(data?.gamesMasteredWall ?? null)
    }
  }

  const handleDragEnd = (event: DragEndEvent, isBeatenWall: boolean) => {
    const { active, over } = event

    if (over !== null && active.id !== over.id) {
      if (isBeatenWall) {
        setDraftBeatenWall((items) => {
          if (items === null) {
            return items
          }

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
        setDraftMasteredWall((items) => {
          if (items === null) {
            return items
          }

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

  const { mutateAsync: saveWallPositionsMutateAsync } = useMutationApiData({
    url: '/api/users/SaveUserGameWallPositions',
    queryKey: ['GetUserProfile', props.username],
    invalidateQuery: true,
    apiMethod: 'POST',
    onError: () => {
      notificationHelper.showErrorNotification('Error', 'Failed to save wall positions.', 3000, <IconInfoCircle size={16} />)
    },
    onSuccess: () => {
      const isBeatenWall = draftBeatenWall !== null
      if (isBeatenWall) {
        notificationHelper.showSuccessNotification('Success', 'Beaten games wall positions saved successfully.', 3000, <IconCheck size={16} />)
        setDraftBeatenWall(null)
      } else {
        notificationHelper.showSuccessNotification('Success', 'Mastered games wall positions saved successfully.', 3000, <IconCheck size={16} />)
        setDraftMasteredWall(null)
      }
    }
  })

  const handleSaveWallPositions = async (isBeatenWall: boolean) => {
    if (isSaving) {
      return
    }

    setIsSaving(true)

    const wallData = isBeatenWall ? draftBeatenWall : draftMasteredWall
    // get the progress ids and wall positions
    const positions = wallData !== null && wallData.map((game) => ({
      progressId: game.progressId,
      wallPosition: game.wallPosition
    }))

    await saveWallPositionsMutateAsync({ wallData: positions })

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
      {isLoading && <Loading />}
      {isError && <Text>Error loading profile data.</Text>}

      {data !== undefined &&
        <>
          <Group align="center" gap="lg" mb="lg">
            <Avatar src={`https://media.retroachievements.org/UserPic/${data.raUsername}.png`} size={100} radius="lg" />
            <Stack gap={4}>
              <Title order={2}>{data.raUsername}</Title>
              <Group gap="xl">
                <Stack gap={2}>
                  {data.softcorePoints !== data.hardcorePoints && data.softcorePoints !== 0 && <Text>Softcore Points: <Text component="span" fw={700}>{data.softcorePoints.toLocaleString()}</Text></Text>}
                  {data.hardcorePoints !== 0 && <Text>Hardcore Points: <Text component="span" fw={700}>{data.hardcorePoints.toLocaleString()}</Text></Text>}
                  {data.lastUserUpdate !== undefined &&
                    <Group gap={4}>
                      <Text c="dimmed" size="sm">
                        Last Updated: {new Date(data.lastUserUpdate).toLocaleDateString()} {new Date(data.lastUserUpdate).toLocaleTimeString()}
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
                  {data.gamesBeatenSoftcore !== 0 && <Text size="sm" c="dimmed">Softcore: <Text component="span" fw={600}>{data.gamesBeatenSoftcore.toLocaleString()}</Text></Text>}
                  {data.gamesBeatenHardcore !== 0 && <Text size="sm" c="gold">Hardcore: <Text component="span" fw={600}>{data.gamesBeatenHardcore.toLocaleString()}</Text></Text>}
                </Stack>
              </Stack>
            </Card>
            <Card withBorder radius="md" p="lg" className={styles.statCard}>
              <Stack align="center" gap="xs">
                <Text fw={700}>Games Completed/Mastered</Text>
                <Stack gap={0} align="center">
                  {data.gamesCompleted !== 0 && <Text size="sm" c="dimmed">Softcore: <Text component="span" fw={600}>{data.gamesCompleted.toLocaleString()}</Text></Text>}
                  {data.gamesMastered !== 0 && <Text size="sm" c="gold">Hardcore: <Text component="span" fw={600}>{data.gamesMastered.toLocaleString()}</Text></Text>}
                </Stack>
              </Stack>
            </Card>
            <Card withBorder radius="md" p="lg" className={styles.statCard}>
              <Stack align="center" gap="xs">
                <Text fw={700}>Achievements Unlocked</Text>
                <Stack gap={0} align="center">
                  {data.achievementsEarnedSoftcore !== data.achievementsEarnedHardcore && <Text size="sm" c="dimmed">Softcore: <Text component="span" fw={600}>{data.achievementsEarnedSoftcore.toLocaleString()}</Text></Text>}
                  {data.achievementsEarnedHardcore !== 0 && <Text size="sm" c="gold">Hardcore: <Text component="span" fw={600}>{data.achievementsEarnedHardcore.toLocaleString()}</Text></Text>}
                </Stack>
              </Stack>
            </Card>
            <Card withBorder radius="md" p="lg" className={styles.statCard}>
              <Stack align="center" gap="xs">
                <Text fw={700}>In Progress Games</Text>
                <Text size="lg" fw={600}>{data.gamesInProgress.toLocaleString()}</Text>
              </Stack>
            </Card>
          </SimpleGrid>

          <Grid gutter="xl">
            <Grid.Col span={isMd ? 8 : 12}>
              <Divider label="Beaten Games Wall" labelPosition="center" mb="md" classNames={{ label: styles.dividerText }} />
              {user.isAuthenticated &&
                <div style={{ marginBottom: 10 }}>
                  <Button
                    disabled={isSaving}
                    color={draftBeatenWall !== null ? 'red' : 'blue'}
                    onClick={() => {
                      if (draftBeatenWall !== null) {
                        setDraftBeatenWall(null)
                      } else {
                        handleEditWallButtonClick(true)
                      }
                    }}
                  >
                    {draftBeatenWall !== null ? 'Cancel' : 'Edit'}
                  </Button>
                  {draftBeatenWall !== null && <Button disabled={isSaving} onClick={() => handleSaveWallPositions(true)} color="green" ml="md">Save Changes</Button>}
                </div>
              }
              {draftBeatenWall !== null ?
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={(e) => { handleDragEnd(e, true) }}
                >
                  <SortableContext items={draftBeatenWall.map((g) => g.gameId)} strategy={rectSortingStrategy}>
                    <SimpleGrid cols={wallIconAmount} spacing="sm">
                      {draftBeatenWall.map((game) => (
                        <SortableGameWallIcon key={game.gameId} id={game.gameId} icon={game.imageUrl} title={game.title} isHardcore={game.isHardcore} />
                      ))}
                    </SimpleGrid>
                  </SortableContext>
                </DndContext> :
                <SimpleGrid cols={wallIconAmount} mb="sm">
                  {data.gamesBeatenWall.map((game) => (
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
                  <Button
                    disabled={isSaving}
                    color={draftMasteredWall !== null ? 'red' : 'blue'}
                    onClick={() => {
                      if (draftMasteredWall !== null) {
                        setDraftMasteredWall(null)
                      } else {
                        handleEditWallButtonClick(false)
                      }
                    }}
                  >
                    {draftMasteredWall !== null ? 'Cancel' : 'Edit'}
                  </Button>
                  {draftMasteredWall !== null && <Button disabled={isSaving} onClick={() => handleSaveWallPositions(false)} color="green" ml="md">Save Changes</Button>}
                </div>
              }
              {draftMasteredWall !== null ?
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={(e) => { handleDragEnd(e, false) }}
                >
                  <SortableContext items={draftMasteredWall.map((g) => g.gameId)} strategy={rectSortingStrategy}>
                    <SimpleGrid cols={wallIconAmount} spacing="sm">
                      {draftMasteredWall.map((game) => (
                        <SortableGameWallIcon key={game.gameId} id={game.gameId} icon={game.imageUrl} title={game.title} isHardcore={game.isHardcore} />
                      ))}
                    </SimpleGrid>
                  </SortableContext>
                </DndContext> :
                <SimpleGrid cols={wallIconAmount} mb="sm">
                  {data.gamesMasteredWall.map((game) => (
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
                          {data.consoleProgressData.filter(x => x.consoleType === console).map((consoleData) => {
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
                {data.last5GamesPlayed.map((game) => {
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
                {data.last5Awards.map((game) => {
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
        </>
      }
    </Container>
  )

}

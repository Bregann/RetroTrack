import { Button, Checkbox, Divider, Grid, Group, HoverCard, Modal, Paper, Text } from '@mantine/core'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { type GetGameInfoForUser } from '@/pages/api/games/GetGameInfoForUser'
import notificationHelper from '@/helpers/NotificationHelper'
import { IconCheck, IconCrossFilled } from '@tabler/icons-react'
import fetchHelper from '@/helpers/FetchHelper'
import classes from '@/styles/GameModal.module.css'

interface LoggedInModalProps {
  gameInfo: GetGameInfoForUser | undefined
  onCloseModal: () => void
  updateTableData?: () => Promise<void>
}

const LoggedInModal = (props: LoggedInModalProps): JSX.Element => {
  const [gameLayoutChecked, setGameLayoutChecked] = useState(true)
  const [autoUpdateChecked, setAutoUpdateChecked] = useState(false)
  const [currentDisplayedAchievements, setCurrentDisplayedAchievements] = useState(props.gameInfo?.achievements)
  const [achievementList, setAchievementList] = useState(props.gameInfo?.achievements)
  const [gameStats, setGameStats] = useState(props.gameInfo)
  const [gameTracked, setGameTracked] = useState(props.gameInfo?.gameTracked ?? false)
  const [trackedGameButtonLoading, setTrackedGameButtonLoading] = useState(false)
  const [achievementsFiltered, setAchievementsFiltered] = useState(false)
  const interval = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setCurrentDisplayedAchievements(props.gameInfo?.achievements)
    setAchievementList(props.gameInfo?.achievements)
    setGameStats(props.gameInfo)
    setGameTracked(props.gameInfo?.gameTracked ?? false)
  }, [props.gameInfo])

  console.log(props)
  console.log(currentDisplayedAchievements)

  const filterCurrentAchievements = (checked: boolean): void => {
    setAchievementsFiltered(checked)

    if (checked) {
      setCurrentDisplayedAchievements(achievementList?.filter(x => x.dateEarned === null))
    } else {
      setCurrentDisplayedAchievements(achievementList)
    }
  }

  const UpdateTrackedGame = async (): Promise<void> => {
    setTrackedGameButtonLoading(true)

    if (gameTracked) {
      const res = await fetchHelper.doDelete('/trackedgames/DeleteTrackedGame?gameId=' + props.gameInfo?.gameId)

      if (res.statusCode === 401) {
        notificationHelper.showErrorNotification('Authentication Error', 'There has been an error authenticating you. Please sign out and sign back in', 5000, <IconCrossFilled />)
      } else if (res.errored) {
        notificationHelper.showErrorNotification('Error', 'There has been an error updating the tracked game. Please try again', 5000, <IconCrossFilled />)
      } else {
        setGameTracked(false)
        notificationHelper.showSuccessNotification('Success', 'Tracked game has been removed successfully', 3000, <IconCheck />)
      }
    } else {
      const res = await fetchHelper.doPost('/trackedgames/AddTrackedGame?gameId=' + props.gameInfo?.gameId, {})

      if (res.statusCode === 401) {
        notificationHelper.showErrorNotification('Authentication Error', 'There has been an error authenticating you. Please sign out and sign back in', 5000, <IconCrossFilled />)
      } else if (res.errored) {
        notificationHelper.showErrorNotification('Error', 'There has been an error updating the tracked game. Please try again', 5000, <IconCrossFilled />)
      } else {
        setGameTracked(true)
        notificationHelper.showSuccessNotification('Success', 'Tracked game has been added successfully', 3000, <IconCheck />)
      }
    }

    setTrackedGameButtonLoading(false)
  }

  const UpdateUserProgress = async (): Promise<void> => {
    const res = await fetchHelper.doGet('/games/GetGameInfoForUser?gameId=' + props.gameInfo?.gameId)

    if (res.statusCode === 401) {
      notificationHelper.showErrorNotification('Authentication Error', 'There has been an error authenticating you. Please sign out and sign back in', 5000, <IconCrossFilled />)
    } else if (res.errored) {
      notificationHelper.showErrorNotification('Error updating user', 'There has been an error updating user progress. Please try again', 5000, <IconCrossFilled />)
    } else {
      setGameStats(res.data)
      setAchievementList(res.data.achievements)
      notificationHelper.showSuccessNotification('Success', 'Achievements have been updated successfully', 3000, <IconCheck />)

      filterCurrentAchievements(achievementsFiltered)
    }
  }

  const UpdateCloseModalStates = async (): Promise<void> => {
    props.onCloseModal()

    if (props.updateTableData !== undefined) {
      await props.updateTableData()
    }
  }

  useEffect(() => {
    filterCurrentAchievements(achievementsFiltered)
    // Ignoring the below warning as the filter is used in other places
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [achievementList])

  useEffect(() => {
    if (autoUpdateChecked) {
      notificationHelper.showSuccessNotification('Enabled', 'Achievement auto updates enabled', 3000, <IconCheck />)

      interval.current = setInterval(async () => {
        await UpdateUserProgress()
      }, 60000)
    }
    if (!autoUpdateChecked && interval.current !== null) {
      clearInterval(interval.current)
      interval.current = null
      notificationHelper.showSuccessNotification('Disabled', 'Achievement auto updates disabled', 3000, <IconCheck />)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoUpdateChecked])

  return (
    <>
      <Modal
        opened={props.gameInfo !== undefined}
        onClose={async () => { await UpdateCloseModalStates() }}
        size="75%"
      >
        <h1 style={{ fontSize: 35, marginTop: -10 }}>{props.gameInfo?.title}</h1>
        <Group justify='center'>
          <Image
            width={420}
            height={320}
            src={props.gameInfo?.imageTitle ?? ''}
            alt={`${props.gameInfo?.title} in game title screen`}
            style={{ marginLeft: 'auto', marginRight: 'auto', display: 'block' }}
          />

          <Image
            width={420}
            height={320}
            src={props.gameInfo?.imageInGame ?? ''}
            alt={`${props.gameInfo?.title} in game image`}
            style={{ marginLeft: 'auto', marginRight: 'auto', display: 'block' }}
          />
          <Image
            width={320}
            height={320}
            src={props.gameInfo?.imageBoxArt ?? ''}
            alt={`${props.gameInfo?.title} in game box art`}
            style={{ marginLeft: 'auto', marginRight: 'auto', display: 'block' }}
          />
        </Group>
        <Grid justify='center' style={{ textAlign: 'center' }}>
          <Grid.Col span={{ base: 12, lg: 2, md: 6 }}>
            <h3>Achievements</h3>
            <span>{gameStats?.numAwardedToUser}/{gameStats?.achievementCount} ({gameStats?.userCompletion})</span>
          </Grid.Col>

          <Grid.Col span={{ base: 12, lg: 2, md: 6 }}>
            <h3>Points</h3>
            <span>{gameStats?.pointsEarned}/{gameStats?.totalPoints}</span>
          </Grid.Col>

          <Grid.Col span={{ base: 12, lg: 2, md: 6 }}>
            <h3>Genre</h3>
            <span>{props.gameInfo?.genre}</span>
          </Grid.Col>

          <Grid.Col span={{ base: 12, lg: 2, md: 6 }}>
            <h3>Console</h3>
            <span>{props.gameInfo?.consoleName}</span>
          </Grid.Col>

          <Grid.Col span={{ base: 12, lg: 2, md: 6 }}>
            <h3>Players</h3>
            <span>{props.gameInfo?.players}</span>
          </Grid.Col>

          <Grid.Col>
            <Divider my="xs" />
          </Grid.Col>
        </Grid>

        {gameLayoutChecked &&
          <div style={{ marginLeft: 35 }}>
            <Group gap={5} justify='flex-start'>
              {currentDisplayedAchievements?.map((achievement) => {
                return (
                  <div key={achievement.id}>
                    <HoverCard position="bottom">
                      <HoverCard.Target>
                        <Image
                          style={{ marginRight: 5, marginBottom: 5 }}
                          width={64}
                          height={64}
                          src={achievement.badgeName}
                          alt={`${achievement.title} achievement badge`}
                        />
                      </HoverCard.Target>
                      <HoverCard.Dropdown>
                        <Text fw={500} mt={-5}>{achievement.title} ({achievement.points})</Text>
                        <Text fz="sm">{achievement.description}</Text>
                      </HoverCard.Dropdown>
                    </HoverCard>
                  </div>
                )
              })}
            </Group>

          </div>
        }

        {!gameLayoutChecked &&
          <>
            <Grid>
              {currentDisplayedAchievements?.map((achievement) => {
                return (
                  <>
                    <Grid.Col span={1} key={achievement.id}>
                      <Image
                        style={{ marginRight: 5, marginBottom: 5 }}
                        width={64}
                        height={64}
                        src={achievement.badgeName}
                        alt=""
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 11, lg: 3, md: 5 }}>
                      <Text className={classes.achievementText} style={achievement.type === 0 ? { color: 'orange' } : undefined} fw={500} mt={-5}>{achievement.title} ({achievement.points}) {achievement.type === 0 ? '[m]' : ''}</Text>
                      <Text className={classes.achievementText} fz="sm">{achievement.description}</Text>
                    </Grid.Col>
                  </>
                )
              })}
            </Grid>
          </>
        }
        <Divider my="xs" />
        <Paper className={classes.stickyFooter}>
          <Group align="left">
            <Button
              variant="gradient"
              loading={trackedGameButtonLoading}
              gradient={{ from: 'indigo', to: 'cyan' }}
              onClick={async () => { await UpdateUserProgress() }}>
              Update
            </Button>

            {gameTracked &&
              <Button
                variant="gradient"
                loading={trackedGameButtonLoading}
                gradient={{ from: 'orange', to: 'red' }}
                onClick={async () => { await UpdateTrackedGame() }}>
                Untrack Game
              </Button>}

            {!gameTracked &&
              <Button
                variant="gradient"
                loading={trackedGameButtonLoading}
                gradient={{ from: 'teal', to: 'lime', deg: 105 }}
                onClick={async () => { await UpdateTrackedGame() }}
              >
                Track Game
              </Button>}

            <Button
              component="a"
              variant="gradient"
              gradient={{ from: 'indigo', to: 'cyan' }}
              style={{ ':hover': { color: 'white' } }}
              href={'/game/' + props.gameInfo?.gameId}
            >
              Game Page
            </Button>

            <Button
              component="a"
              variant="gradient"
              gradient={{ from: 'indigo', to: 'cyan' }}
              target="_blank"
              style={{ ':hover': { color: 'white' } }}
              href={'https://retroachievements.org/game/' + props.gameInfo?.gameId}
            >
              RA Page
            </Button>

            <Checkbox defaultChecked={true} mt={3} label="Compact" size="lg" onChange={(event) => { setGameLayoutChecked(event.currentTarget.checked) }} />
            <Checkbox mt={3} label="Auto update" size="lg" onChange={(event) => { setAutoUpdateChecked(event.currentTarget.checked) }} />
            <Checkbox mt={3} label="Hide Complete" size="lg" onChange={(event) => { filterCurrentAchievements(event.currentTarget.checked) }} />
          </Group>
        </Paper>

      </Modal>
    </>
  )
}

export default LoggedInModal

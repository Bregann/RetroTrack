import { Button, Divider, Grid, Group, HoverCard, Modal, Switch, Text } from '@mantine/core'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { type GetGameInfoForUser } from '@/pages/api/games/GetGameInfoForUser'
import notificationHelper from '@/helpers/NotificationHelper'
import { IconCheck, IconCrossFilled } from '@tabler/icons-react'
import fetchHelper from '@/helpers/FetchHelper'

interface LoggedInModalProps {
  gameInfo: GetGameInfoForUser | undefined
  onCloseModal: () => void
  updateTableData?: () => Promise<void>
}

const LoggedInModal = (props: LoggedInModalProps): JSX.Element => {
  const [gameLayoutChecked, setGameLayoutChecked] = useState(false)
  const [autoUpdateChecked, setAutoUpdateChecked] = useState(false)
  const [currentDisplayedAchievements, setCurrentDisplayedAchievements] = useState(props.gameInfo?.achievements)
  const [achievementList, setAchievementList] = useState(props.gameInfo?.achievements)
  const [gameStats, setGameStats] = useState(props.gameInfo)
  const [gameTracked, setGameTracked] = useState(props.gameInfo?.gameTracked)
  const [trackedGameButtonLoading, setTrackedGameButtonLoading] = useState(false)
  const [achievementsFiltered, setAchievementsFiltered] = useState(false)
  const interval = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setCurrentDisplayedAchievements(props.gameInfo?.achievements)
    setAchievementList(props.gameInfo?.achievements)
    setGameStats(props.gameInfo)
    setGameTracked(props.gameInfo?.gameTracked)
  }, [props.gameInfo])

  console.log(props)
  console.log(currentDisplayedAchievements)

  const FilterCurrentAchievements = (checked: boolean): void => {
    setAchievementsFiltered(checked)

    if (checked) {
      setCurrentDisplayedAchievements(achievementList?.filter(x => x.dateEarned === null))
    } else {
      setCurrentDisplayedAchievements(achievementList)
    }
  }

  const UpdateTrackedGame = async (): Promise<void> => {
    setTrackedGameButtonLoading(true)

    if (gameTracked !== undefined) {
      const res = await fetchHelper.doDelete('/api/trackedgames/DeleteTrackedGame?gameId=' + props.gameInfo?.gameId)

      if (res.statusCode === 401) {
        notificationHelper.showErrorNotification('Authentication Error', 'There has been an error authenticating you. Please sign out and sign back in', 5000, <IconCrossFilled />)
      } else if (res.errored) {
        notificationHelper.showErrorNotification('Error', 'There has been an error updating the tracked game. Please try again', 5000, <IconCrossFilled />)
      } else {
        setGameTracked(true)
        notificationHelper.showSuccessNotification('Success', 'Tracked game has been removed successfully', 3000, <IconCheck />)
      }
    } else {
      const res = await fetchHelper.doPost('/api/trackedgames/AddTrackedGame/' + props.gameInfo?.gameId, {})

      if (res.statusCode === 401) {
        notificationHelper.showErrorNotification('Authentication Error', 'There has been an error authenticating you. Please sign out and sign back in', 5000, <IconCrossFilled />)
      } else if (res.errored) {
        notificationHelper.showErrorNotification('Error', 'There has been an error updating the tracked game. Please try again', 5000, <IconCrossFilled />)
      } else {
        setGameTracked(true)
        notificationHelper.showSuccessNotification('Success', 'Tracked game has been added successfully', 3000, <IconCheck />)
      }
      setTrackedGameButtonLoading(false)
    }
  }

  const UpdateUserProgress = async (): Promise<void> => {
    const res = await fetchHelper.doGet('/api/games/GetGameInfoForUser?gameId=' + props.gameInfo?.gameId)

    if (res.statusCode === 401) {
      notificationHelper.showErrorNotification('Authentication Error', 'There has been an error authenticating you. Please sign out and sign back in', 5000, <IconCrossFilled />)
    } else if (res.errored) {
      notificationHelper.showErrorNotification('Error updating user', 'There has been an error updating user progress. Please try again', 5000, <IconCrossFilled />)
    } else {
      setGameStats(res.data)
      setAchievementList(res.data.achievements)
      notificationHelper.showSuccessNotification('Success', 'Achievements have been updated successfully', 3000, <IconCheck />)

      FilterCurrentAchievements(achievementsFiltered)
    }
  }

  const UpdateCloseModalStates = async (): Promise<void> => {
    props.onCloseModal()

    if (props.updateTableData !== undefined) {
      await props.updateTableData()
    }
  }

  useEffect(() => {
    FilterCurrentAchievements(achievementsFiltered)
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
        size="xl"
      >
        <h2>{props.gameInfo?.title}</h2>
        <Grid>
          <Grid.Col span={6}>
            <Image
              width={256}
              height={256}
              src={props.gameInfo?.imageBoxArt ?? ''}
              alt=""
              style={{ marginLeft: 'auto', marginRight: 'auto', display: 'block' }}
            />
          </Grid.Col>

          <Grid.Col span={6}>
            <Image
              width={256}
              height={256}
              src={props.gameInfo?.imageInGame ?? ''}
              alt=""
              style={{ marginLeft: 'auto', marginRight: 'auto', display: 'block' }}
            />
          </Grid.Col>

          <Grid.Col span={3}>
            <h6>Achievements</h6>
            <span>{gameStats?.numAwardedToUser}/{gameStats?.achievementCount} ({gameStats?.userCompletion})</span>
          </Grid.Col>

          <Grid.Col span={3}>
            <h6>Points</h6>
            <span>{gameStats?.pointsEarned}/{gameStats?.totalPoints}</span>
          </Grid.Col>

          <Grid.Col span={3}>
            <h6>Genre</h6>
            <span>{props.gameInfo?.genre}</span>
          </Grid.Col>

          <Grid.Col span={3}>
            <h6>Console</h6>
            <span>{props.gameInfo?.consoleName}</span>
          </Grid.Col>

          <Grid.Col span={3}>
            <h6>Players</h6>
            <span>{props.gameInfo?.players}</span>
          </Grid.Col>

          <Grid.Col>
            <Divider my="xs" />
          </Grid.Col>

          {!gameLayoutChecked && currentDisplayedAchievements?.map((achievement) => {
            return (
              <div key={achievement.id}>
                <HoverCard position="bottom">
                  <HoverCard.Target>
                    <Image
                      style={{ marginRight: 5, marginBottom: 5 }}
                      width={48}
                      height={48}
                      src={achievement.badgeName}
                      alt=""
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

          {gameLayoutChecked && currentDisplayedAchievements?.map((achievement) => {
            return (
              <>
                <Grid.Col span={1} key={achievement.id}>
                  <Image
                    style={{ marginRight: 5, marginBottom: 5 }}
                    width={48}
                    height={48}
                    src={achievement.badgeName}
                    alt=""
                  />
                </Grid.Col>
                <Grid.Col span={10}>
                  <Text style={achievement.type === 0 ? { color: 'orange' } : undefined} fw={500} mt={-5}>{achievement.title} ({achievement.points}) {achievement.type === 0 ? '[m]' : ''}</Text>
                  <Text fz="sm">{achievement.description}</Text>
                </Grid.Col>
              </>
            )
          })}

          <Grid.Col>
            <Divider my="xs" />
          </Grid.Col>

          <Grid.Col>
            <Group align="left">
              <Button
                mr={5}
                mt={-5}
                variant="gradient"
                loading={trackedGameButtonLoading}
                gradient={{ from: 'indigo', to: 'cyan' }}
                onClick={async () => { await UpdateUserProgress() }}>
                Update
              </Button>

              {gameTracked === true &&
                <Button
                  mr={5}
                  mt={-5}
                  variant="gradient"
                  loading={trackedGameButtonLoading}
                  gradient={{ from: 'orange', to: 'red' }}
                  onClick={async () => { await UpdateTrackedGame() }}>
                  Untrack Game
                </Button>}

              {gameTracked === false &&
                <Button
                  mr={5}
                  mt={-5}
                  variant="gradient"
                  loading={trackedGameButtonLoading}
                  gradient={{ from: 'teal', to: 'lime', deg: 105 }}
                  onClick={async () => { await UpdateTrackedGame() }}
                >
                  Track Game
                </Button>}

              <Button
                component="a"
                mr={5}
                mt={-5}
                variant="gradient"
                gradient={{ from: 'indigo', to: 'cyan' }}
                style={{ ':hover': { color: 'white' } }}
                href={'game/' + props.gameInfo?.gameId}
              >
                Game Page
              </Button>

              <Button
                component="a"
                mr={5}
                mt={-5}
                variant="gradient"
                gradient={{ from: 'indigo', to: 'cyan' }}
                target="_blank"
                style={{ ':hover': { color: 'white' } }}
                href={'https://retroachievements.org/game/' + props.gameInfo?.gameId}
              >
                RA Page
              </Button>

              <Switch offLabel="Compact" onLabel="Full" size="lg" mt={-9} mr={5} ml={20} onChange={(event) => { setGameLayoutChecked(event.currentTarget.checked) }} />
              <Switch offLabel="Auto update" onLabel="Auto update" size="lg" mt={-9} mr={5} onChange={(event) => { setAutoUpdateChecked(event.currentTarget.checked) }} />
              <Switch offLabel="Show Complete" onLabel="Hide Complete" size="lg" mt={-9} mr={5} onChange={(event) => { FilterCurrentAchievements(event.currentTarget.checked) }} />
            </Group>
          </Grid.Col>
        </Grid>
      </Modal>
    </>
  )
}

export default LoggedInModal

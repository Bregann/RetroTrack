import fetchHelper from '@/helpers/FetchHelper'
import { type GetPublicNavigationDataDto } from '@/pages/api/navigation/GetPublicNavigationData'
import { AppShell, Burger, Button, Grid, Group, LoadingOverlay, NavLink, Paper, ScrollArea, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconCheck, IconCrossFilled, IconDeviceGamepad3, IconHome2, IconPin, IconProgress } from '@tabler/icons-react'
import { type AppProps } from 'next/app'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import LoginModal from './LoginModal'
import RegisterModal from './RegisterModal'
import SupportModal from './SupportModal'
import sessionHelper from '@/helpers/SessionHelper'
import notificationHelper from '@/helpers/NotificationHelper'
import { useRouter } from 'next/router'
import ChangelogModal from './ChangelogModal'
import { type GetLoggedInNavigationDataDto } from '@/pages/api/navigation/GetLoggedInNavigationData'
import classes from '@/styles/Navigation.module.css'
import { type UpdateUserGamesDto } from '@/pages/api/user/UpdateUserGames'

const Navigation = (props: AppProps): JSX.Element => {
  const { Component, pageProps } = props
  const [opened, { toggle }] = useDisclosure()
  const [loginModalOpened, setLoginModalOpened] = useState(false)
  const [registerModalOpened, setRegisterModalOpened] = useState(false)
  const [supportModalOpened, setSupportModalOpened] = useState(false)
  const [changelogModalOpened, setChangelogModalOpened] = useState(false)
  const [loggedIn, setLoggedIn] = useState<boolean | null>()
  const [publicNavData, setPublicNavData] = useState<GetPublicNavigationDataDto[] | null>(null)
  const [loggedInNavData, setLoggedInNavData] = useState<GetLoggedInNavigationDataDto | null>(null)
  const [activePage, setActivePage] = useState('')

  const [updateGamesButtonLoading, setUpdateGamesButtonLoading] = useState(false)
  const [userUpdateRequested, setUserUpdateRequested] = useState(false)
  const interval = useRef<NodeJS.Timeout | null>(null)

  const router = useRouter()

  const consoleTypes = [
    { consoleType: 0, consoleName: 'Nintendo' },
    { consoleType: 1, consoleName: 'Sony' },
    { consoleType: 2, consoleName: 'Atari' },
    { consoleType: 3, consoleName: 'Sega' },
    { consoleType: 4, consoleName: 'NEC' },
    { consoleType: 5, consoleName: 'SNK' },
    { consoleType: 6, consoleName: 'Other' }
  ]

  // Used for checking the status of a user update
  useEffect(() => {
    if (interval !== null) {
      if (userUpdateRequested && interval.current == null) {
        interval.current = setInterval(async () => {
          const res = await fetchHelper.doGet('/user/CheckUserUpdateProcessingState')

          if (!res.errored) {
            const processed: boolean = res.data

            if (processed) {
              setUserUpdateRequested(false)
              notificationHelper.showSuccessNotification('Success', 'User update successful', 4000, <IconCheck />)
            }
          }
        }, 3000)
      }

      if (!userUpdateRequested && interval.current !== null) {
        clearInterval(interval.current)
        interval.current = null
      }
    }
  }, [userUpdateRequested])

  useEffect(() => {
    setLoggedIn(sessionHelper.hasSession())
  }, [])

  useEffect(() => {
    const fetchLoggedOutData = async (): Promise<void> => {
      const fetchResult = await fetchHelper.doGet('/navigation/GetPublicNavigationData')

      if (fetchResult.errored) {
        console.error('Error loading navigation data')
      } else {
        setPublicNavData(fetchResult.data)
        setLoggedInNavData(null)
      }
    }

    const fetchLoggedInData = async (): Promise<void> => {
      const fetchResult = await fetchHelper.doGet('/navigation/GetLoggedInNavigationData')

      if (fetchResult.errored) {
        console.error('Error loading navigation data')
        void fetchLoggedOutData()
      } else if (fetchResult.statusCode === 401) {
        void logoutUser()
      } else {
        setPublicNavData(null)
        setLoggedInNavData(fetchResult.data)
      }
    }

    if (!userUpdateRequested && (loggedIn === true || sessionHelper.hasSession())) {
      void fetchLoggedInData()
      return
    }

    if (loggedIn === true || sessionHelper.hasSession()) {
      void fetchLoggedInData()
    } else {
      void fetchLoggedOutData()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedIn, userUpdateRequested])

  const logoutUser = async (): Promise<void> => {
    const result = await sessionHelper.LogoutUser()

    if (result) {
      setLoggedIn(false)
      setActivePage('/')
      await router.push('/') // Send them back to the homepage
      notificationHelper.showSuccessNotification('Success', 'You have successfully logged out!', 3000, <IconCheck />)
    } else {
      notificationHelper.showErrorNotification('Error', 'There has been an error logging you out', 5000, <IconCrossFilled />)
    }
  }

  const successfulLogin = async (): Promise<void> => {
    setLoggedIn(true)
    setActivePage('/home')
    await router.push('/home') // Send them back to the homepage
    await requestGamesUpdate()
  }

  const requestGamesUpdate = async (): Promise<void> => {
    setUpdateGamesButtonLoading(true)
    const updateRes = await fetchHelper.doPost('/user/UpdateUserGames', {})

    if (updateRes.errored) {
      notificationHelper.showErrorNotification('Error', 'There has been an error requesting to update your games. Please try again', 5000, <IconCrossFilled />)
      setUpdateGamesButtonLoading(false)
      return
    }

    const resData: UpdateUserGamesDto = updateRes.data

    if (!resData.success) {
      notificationHelper.showErrorNotification('Error', resData.reason, 5000, <IconCrossFilled />)
      setUpdateGamesButtonLoading(false)
      return
    }

    notificationHelper.showSuccessNotification('Success', 'A game update has been requested. A notification will appear when this has completed', 5000, <IconCheck />)
    setUserUpdateRequested(true)
    setUpdateGamesButtonLoading(false)
  }

  return (
    <>
      <LoadingOverlay visible={(loggedIn === true && loggedInNavData === null) || (loggedIn === false && publicNavData === null) || loggedIn === null} />
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: 260,
          breakpoint: 'sm',
          collapsed: { mobile: !opened }
        }}
        padding="md">
        <AppShell.Header>
          <Group h="100%" px="md" justify="flex-end">
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" style={{ marginRight: 'auto' }} />
            <Button
              variant="gradient"
              gradient={{ from: 'indigo', to: 'cyan' }}
              onClick={() => { setChangelogModalOpened(true) }}>
              Website Changelog (v2)
            </Button>
            <Button
              variant="gradient"
              gradient={{ from: 'indigo', to: 'cyan' }}
              onClick={() => { setSupportModalOpened(true) }}>
              Support
            </Button>
            {loggedIn === true
              ? <>
                <Button
                  variant="gradient"
                  gradient={{ from: 'indigo', to: 'cyan' }}
                  disabled={updateGamesButtonLoading}
                  onClick={async () => { await requestGamesUpdate() }}>
                  Update games
                </Button><Button
                  variant="gradient"
                  gradient={{ from: 'orange', to: 'red' }}
                  onClick={async () => { await logoutUser() }}>
                  Logout
                </Button>
              </>
              : <>
                <Button
                  variant="gradient"
                  gradient={{ from: 'indigo', to: 'cyan' }}
                  onClick={() => { setLoginModalOpened(true) }}>
                  Login
                </Button>
                <Button
                  variant="gradient"
                  gradient={{ from: 'teal', to: 'lime', deg: 105 }}
                  onClick={() => { setRegisterModalOpened(true) }}>
                  Register
                </Button>
              </>
            }
          </Group>
        </AppShell.Header>
        <AppShell.Navbar>
          <ScrollArea style={{ height: loggedIn === true ? '85%' : '100%' }}>
            <NavLink
              component={Link}
              href="/home"
              label="Home"
              leftSection={<IconHome2 size="1.2rem" stroke={1.5} />}
              onClick={() => { setActivePage('/home') }}
              active={activePage === '/home'}
            />
            <NavLink
              component={Link}
              href="/allgames"
              label="All Games"
              leftSection={<IconDeviceGamepad3 size="1.2rem" stroke={1.5} />}
              onClick={() => { setActivePage('/allgames') }}
              active={activePage === '/allgames'}
            />

            {loggedIn === true &&
              <>
                <NavLink
                  component={Link}
                  href="/trackedgames"
                  label="Tracked Games"
                  description={`${loggedInNavData?.trackedGamesCount} games`}
                  leftSection={<IconPin size="1.2rem" stroke={1.5} />}
                  onClick={() => { setActivePage('/trackedgames') }}
                  active={activePage === '/trackedgames'}
                />
                <NavLink
                  component={Link}
                  href="/inprogressgames"
                  label="In Progress Games"
                  description={`${loggedInNavData?.inProgressGamesCount} games`}
                  leftSection={<IconProgress size="1.2rem" stroke={1.5} />}
                  onClick={() => { setActivePage('/inprogressgames') }}
                  active={activePage === '/inprogressgames'}
                />
              </>
            }

            {consoleTypes.map(console => {
              return (
                <NavLink label={console.consoleName} key={console.consoleType}>
                  {publicNavData !== null
                    ? publicNavData.filter(x => x.consoleType === console.consoleType).sort((a, b) => a.consoleName.localeCompare(b.consoleName)).map(data => {
                      return (
                        <NavLink
                          component={Link}
                          description={`${data.gameCount} games`}
                          key={data.consoleId}
                          label={data.consoleName}
                          href={`/console/${data.consoleId}`}
                          onClick={() => { setActivePage(data.consoleId.toString()) }}
                        />
                      )
                    })
                    : loggedInNavData?.consoleProgressData.filter(x => x.consoleType === console.consoleType).sort((a, b) => a.consoleName.localeCompare(b.consoleName)).map(data => {
                      return (
                        <NavLink
                          component={Link}
                          description={
                            <>
                              <span className={classes.navGameConsoleCount}>{data.totalGamesInConsole} games</span>
                              <br />
                              <span className={classes.navGamesBeaten}>{data.gamesBeaten}/{data.totalGamesInConsole} beaten ({data.percentageBeaten}%)</span>
                              <br />
                              <span className={classes.navGamesMastered}>{data.gamesMastered}/{data.totalGamesInConsole} mastered ({data.percentageMastered}%)</span>
                            </>
                          }
                          key={data.consoleId}
                          label={data.consoleName}
                          href={`/console/${data.consoleId}`}
                          onClick={() => { setActivePage(data.consoleId.toString()) }}
                          active={activePage === data.consoleId.toString()}
                        />
                      )
                    })}
                </NavLink>
              )
            })}
          </ScrollArea>

          {loggedInNavData !== null && <div className={classes.footer}>
            <Paper mt={10} w={249}>
              <Grid pt={5} pl={5}>
                <Grid.Col span={4}>
                  <Image
                    src={loggedInNavData.raUserProfileUrl}
                    alt="Profile picture of user"
                    width={100}
                    height={100}
                    style={{ marginTop: 15 }}
                  />
                </Grid.Col>
                <Grid.Col span={8}>
                  <Text fz="md" fw={700} pl={20}>{loggedInNavData.raName}</Text>
                  <Text fz="md" pl={20}>Games beat: <b>{loggedInNavData.gamesBeaten}</b></Text>
                  <Text fz="md" pl={20}>Games 100%: <b>{loggedInNavData.gamesMastered}</b></Text>
                  <Text fz="md" pl={20}>Points: <b>{loggedInNavData.userPoints}</b></Text>
                  <Text fz="md" pl={20}>Rank: <b>{loggedInNavData.userRank}</b></Text>
                </Grid.Col>
              </Grid>
            </Paper>
          </div>}
        </AppShell.Navbar>
        <AppShell.Main>
          <LoginModal setOpened={setLoginModalOpened} openedState={loginModalOpened} onSuccessfulLogin={async () => { await successfulLogin() }} />
          <RegisterModal setOpened={setRegisterModalOpened} openedState={registerModalOpened} onSuccessfulRegister={async () => { await successfulLogin() }} />
          <SupportModal setOpened={setSupportModalOpened} openedState={supportModalOpened} />
          <ChangelogModal setOpened={setChangelogModalOpened} openedState={changelogModalOpened} />
          <Component {...pageProps} />
        </AppShell.Main>

      </AppShell>
    </>
  )
}

export default Navigation

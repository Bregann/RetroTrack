'use client'

import { useEffect, useRef, useState } from 'react'
import {
  AppShell,
  Burger,
  ScrollArea,
  NavLink,
  Button,
  ActionIcon,
  Group,
  Text,
  Divider,
  useMantineColorScheme,
  Badge,
  Stack,
  Box,
  Modal,
  Accordion,
  List,
} from '@mantine/core'
import { IconBrandGithub, IconCheck, IconChevronRight, IconCrossFilled, IconDeviceGamepad3, IconHome2, IconMoonStars, IconPin, IconProgress } from '@tabler/icons-react'
import { Press_Start_2P } from 'next/font/google'
import Link from 'next/link'
import styles from '@/css/components/navbar.module.scss'
import { GetPublicNavigationDataResponse } from '@/interfaces/api/navigation/GetPublicNavigationDataResponse'
import { ConsoleType } from '@/enums/consoleType'
import LoginModal from './LoginModal'
import RegisterModal from './RegisterModal'
import { useAuth } from '@/context/authContext'
import { GetLoggedInNavigationDataResponse } from '@/interfaces/api/navigation/GetLoggedInNavigationDataResponse'
import Image from 'next/image'
import notificationHelper from '@/helpers/notificationHelper'
import { doGet, doPost } from '@/helpers/apiClient'
import { RequestUserGameUpdateResponse } from '@/interfaces/api/users/RequestUserGameUpdateResponse'
import { useRouter } from 'next/navigation'

const pressStart2P = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

interface NavbarProps {
  children: React.ReactNode,
  publicNavigationData: GetPublicNavigationDataResponse[] | null
  loggedInNavigationData?: GetLoggedInNavigationDataResponse | null
}

export function Navbar(props: NavbarProps) {
  const [opened, setOpened] = useState(false)
  const { setColorScheme, colorScheme } = useMantineColorScheme()
  const [currentPage, setCurrentPage] = useState(typeof window !== 'undefined' ? window.location.pathname : '/')
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const [registerModalOpen, setRegisterModalOpen] = useState(false)
  const [showUpdateInfoModal, setShowUpdateInfoModal] = useState(false)

  const [updateGamesButtonLoading, setUpdateGamesButtonLoading] = useState(false)
  const [userUpdateRequested, setUserUpdateRequested] = useState(false)
  const gameUpdateInterval = useRef<NodeJS.Timeout | null>(null)

  const auth = useAuth()
  const router = useRouter()
  const consoleTypes = [ConsoleType.Nintendo, ConsoleType.Sony, ConsoleType.Atari, ConsoleType.Sega, ConsoleType.NEC, ConsoleType.SNK, ConsoleType.Other]

  // Used for checking the status of a user update
  useEffect(() => {
    if (gameUpdateInterval !== null) {
      if (userUpdateRequested && gameUpdateInterval.current == null) {
        gameUpdateInterval.current = setInterval(async () => {
          const res = await doGet<boolean>('/api/users/CheckUserUpdateProcessingState')

          if (res.ok) {
            const processed: boolean = res.data ?? false

            if (processed) {
              router.refresh()
              setUserUpdateRequested(false)
              notificationHelper.showSuccessNotification('Success', 'User update successful', 4000, <IconCheck />)
            }
          }
        }, 3000)
      }

      if (!userUpdateRequested && gameUpdateInterval.current !== null) {
        clearInterval(gameUpdateInterval.current)
        gameUpdateInterval.current = null
      }
    }
  }, [router, userUpdateRequested])

  const requestGamesUpdate = async (): Promise<void> => {
    setUpdateGamesButtonLoading(true)
    const updateRes = await doPost<RequestUserGameUpdateResponse>('/api/users/UpdateUserGames')

    if (!updateRes.ok || updateRes.data === undefined) {
      notificationHelper.showErrorNotification('Error', 'There has been an error requesting to update your games. Please try again', 5000, <IconCrossFilled />)
      setUpdateGamesButtonLoading(false)
      return
    }

    const resData: RequestUserGameUpdateResponse = updateRes.data

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
    <AppShell
      header={{ height: 64 }}
      navbar={{
        width: 270,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
    >
      <AppShell.Header className={styles.navbar}>
        <Group justify="space-between" align="center" style={{ height: '100%' }} px="md">
          <Burger
            opened={opened}
            onClick={() => setOpened((o) => !o)}
            hiddenFrom="sm"
            size="sm"
          />
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Text
              fw={700}
              size="lg"
              className={pressStart2P.className}
            >
              RetroTrack
            </Text>
          </Link>

          {/* <TextInput
            classNames={{
              input: styles.searchInput,
            }}
            placeholder="Search all games..."
            radius="xl"
            size="md"
            style={{ flex: 1, maxWidth: 400 }}
          /> */}
          <Group gap="xs">
            <Button onClick={() => { setShowUpdateInfoModal(true) }} visibleFrom='sm'>V5.1 Update + Support Info</Button>

            {auth.user === null &&
              <>
                <Button variant="filled" size="sm" onClick={() => setLoginModalOpen(true)} visibleFrom='sm'>
                  Login
                </Button>
                <Button variant="outline" size="sm" onClick={() => setRegisterModalOpen(true)} visibleFrom='sm'>
                  Register
                </Button>
              </>
            }

            {auth.user !== null &&
              <>
                <Button onClick={async () => { await requestGamesUpdate() }} disabled={updateGamesButtonLoading} visibleFrom='sm'>
                  Update Profile
                </Button>
                <Button onClick={() => { auth.logout(); router.refresh() }} variant="filled" size="sm" color="red" visibleFrom='sm'>
                  Logout
                </Button>
              </>
            }

            <ActionIcon
              variant="outline"
              size="lg"
              onClick={() => { setColorScheme(colorScheme === 'dark' ? 'light' : 'dark') }}
              visibleFrom='sm'
            >
              <IconMoonStars />
            </ActionIcon>

            <ActionIcon
              visibleFrom='sm'
              variant="outline"
              size="lg"
              component="a"
              href="https://github.com/Bregann/RetroTrack"
              target="_blank"
            >
              <IconBrandGithub />
            </ActionIcon>
          </Group>
        </Group>
      </AppShell.Header>

      {/* Navbar content */}
      <AppShell.Navbar className={styles.navbar}>
        <ScrollArea style={{ height: '100%' }}>
          {auth.user === null &&
            <Stack gap="xs">
              <Button variant="filled" size="sm" onClick={() => setLoginModalOpen(true)} hiddenFrom='sm'>
                Login
              </Button>
              <Button variant="outline" size="sm" onClick={() => setRegisterModalOpen(true)} hiddenFrom='sm'>
                Register
              </Button>
            </Stack>
          }

          {auth.user !== null &&
            <>
              <Button onClick={async () => { await requestGamesUpdate() }} disabled={updateGamesButtonLoading} hiddenFrom='sm'>
                Update Profile
              </Button>
              <Button onClick={() => { auth.logout(); router.refresh() }} variant="filled" size="sm" color="red" hiddenFrom='sm'>
                Logout
              </Button>
            </>
          }
          <NavLink
            label="Home"
            component={Link}
            href="/home"
            active={currentPage === '/home'}
            py="xs"
            leftSection={<IconHome2 size={20} stroke={1.5} />}
            onClick={() => setCurrentPage('/home')}
            style={{ borderRadius: '10px' }}
          />

          <NavLink
            label="All Games"
            component={Link}
            href="/console/allgames"
            active={currentPage === '/console/allgames'}
            py="xs"
            leftSection={<IconDeviceGamepad3 size={20} stroke={1.5} />}
            onClick={() => setCurrentPage('/console/allgames')}
            style={{ borderRadius: '10px' }}
          />

          {auth.user !== null &&
            <>
              <NavLink
                label="Tracked Games"
                component={Link}
                href="/trackedgames"
                active={currentPage === '/trackedgames'}
                py="xs"
                leftSection={<IconPin size={20} stroke={1.5} />}
                onClick={() => setCurrentPage('/trackedgames')}
                style={{ borderRadius: '10px' }}
              />
              <NavLink
                label="In Progress Games"
                component={Link}
                href="/inprogressgames"
                active={currentPage === '/inprogressgames'}
                py="xs"
                leftSection={<IconProgress size={20} stroke={1.5} />}
                onClick={() => setCurrentPage('/inprogressgames')}
                style={{ borderRadius: '10px' }}
              />
            </>

          }

          {consoleTypes.map((type) => {
            return (
              <NavLink label={ConsoleType[type]} key={type}>
                {props.publicNavigationData !== null && props.publicNavigationData.filter(x => x.consoleType === type).map((navItem) => {
                  return (
                    <div key={navItem.consoleId}>
                      <NavLink
                        label={navItem.consoleName}
                        py="xs"
                        description={
                          <Text size="sm" c="dimmed">{navItem.gameCount} games</Text>
                        }
                        component={Link}
                        href={`/console/${navItem.consoleId}`}
                        onClick={() => setCurrentPage(`/console/${navItem.consoleId}`)}
                        active={currentPage === `/console/${navItem.consoleId}`}
                        style={{ borderRadius: '10px' }}
                      />
                      <Divider mt={5} mb={5} />
                    </div>
                  )
                })}
                {props.loggedInNavigationData !== null && props.loggedInNavigationData?.consoleProgressData.filter(x => x.consoleType === type).map((navItem) => {
                  return (
                    <div key={navItem.consoleId}>
                      <NavLink
                        label={navItem.consoleName}
                        py="xs"
                        component={Link}
                        href={`/console/${navItem.consoleId}`}
                        onClick={() => setCurrentPage(`/console/${navItem.consoleId}`)}
                        active={currentPage === `/console/${navItem.consoleId}`}
                        style={{ borderRadius: '10px' }}
                        description={
                          <Stack gap="xs" >
                            <Text size="sm" c="dimmed">{navItem.totalGamesInConsole} games</Text>
                            {navItem.gamesBeatenHardcore !== 0 && <Group gap="xs">
                              <Badge color="teal" variant="light" size="sm">beaten</Badge>
                              <Text size="sm">{navItem.gamesBeatenHardcore}/{navItem.totalGamesInConsole} ({navItem.percentageBeatenHardcore}%)</Text>
                            </Group>}
                            {navItem.gamesBeatenSoftcore !== 0 && <Group gap="xs">
                              <Badge color="cyan" variant="light" size="sm">softcore</Badge>
                              <Text size="sm">{navItem.gamesBeatenSoftcore}/{navItem.totalGamesInConsole} ({navItem.percentageBeatenSoftcore}%)</Text>
                            </Group>}
                            {navItem.gamesCompleted !== 0 && <Group gap="xs">
                              <Badge color="orange" variant="light" size="sm">completed</Badge>
                              <Text size="sm">{navItem.gamesCompleted}/{navItem.totalGamesInConsole} ({navItem.percentageCompleted}%)</Text>
                            </Group>}
                            {navItem.gamesMastered !== 0 && <Group gap="xs">
                              <Badge color="yellow" variant="light" size="sm">mastered</Badge>
                              <Text size="sm">{navItem.gamesMastered}/{navItem.totalGamesInConsole} ({navItem.gamesMastered}%)</Text>
                            </Group>}
                          </Stack>
                        }
                      />
                      <Divider mt={5} mb={5} />
                    </div>

                  )
                })}
              </NavLink>
            )
          })}

        </ScrollArea>

        {props.loggedInNavigationData !== undefined && props.loggedInNavigationData !== null &&
          <Box p="xs" className={styles.profileBox}>
            <Group gap="sm" mb="xs" align="center">
              <Link href={`/profile/${props.loggedInNavigationData.raName}`} style={{ textDecoration: 'none', color: 'inherit' }} onClick={() => setCurrentPage('/profile')}>
                <Image
                  alt='User avatar'
                  src={`https://media.retroachievements.org${props.loggedInNavigationData.raUserProfileUrl}`}
                  width={55}
                  height={55}
                  style={{ borderRadius: '8px' }}
                />
              </Link>

              <Text fw={600} size="sm">{props.loggedInNavigationData.raName}</Text>
            </Group>

            <Stack gap={4} mb="xs">
              {props.loggedInNavigationData.gamesBeatenSoftcore !== 0 && <Text size="sm">Games Beaten (SC): {props.loggedInNavigationData.gamesBeatenSoftcore}</Text>}
              {props.loggedInNavigationData.gamesBeatenHardcore !== 0 && <Text size="sm">Games Beaten (HC): {props.loggedInNavigationData.gamesBeatenHardcore}</Text>}
              {props.loggedInNavigationData.totalAchievementsSoftcore !== props.loggedInNavigationData.totalAchievementsHardcore && <Text size="sm">Total Achievements (HC): {props.loggedInNavigationData.totalAchievementsHardcore - props.loggedInNavigationData.totalAchievementsSoftcore}</Text>}
              {props.loggedInNavigationData.totalAchievementsHardcore !== 0 && <Text size="sm">Total Achievements (HC): {props.loggedInNavigationData.totalAchievementsHardcore}</Text>}
              {props.loggedInNavigationData.gamesCompleted !== 0 && <Text size="sm">Completed: {props.loggedInNavigationData.gamesCompleted}</Text>}
              {props.loggedInNavigationData.gamesMastered !== 0 && <Text size="sm">Mastered: {props.loggedInNavigationData.gamesMastered}</Text>}
            </Stack>

            <Button
              component={Link}
              href={`/profile/${props.loggedInNavigationData.raName}`}
              variant="subtle"
              size="xs"
              fullWidth
              onClick={() => setCurrentPage('/profile')}
            >
              View Profile
            </Button>
          </Box>
        }

      </AppShell.Navbar>
      <AppShell.Main>
        {props.children}
        <LoginModal
          onClose={() => setLoginModalOpen(false)}
          openedState={loginModalOpen}
        />

        <RegisterModal
          onClose={() => setRegisterModalOpen(false)}
          openedState={registerModalOpen}
        />

        <Modal opened={showUpdateInfoModal} onClose={() => setShowUpdateInfoModal(false)} title="RetroTrack Updates">
          <Accordion
            multiple
            variant="contained"
            radius="md"
            defaultValue={['v5.1']}
            chevron={<IconChevronRight size={16} />}
          >
            <Accordion.Item value="v5.1">
              <Accordion.Control>RetroTrack v5.1 Released</Accordion.Control>
              <Accordion.Panel>
                <Text mb="sm">Here are some of the new features:</Text>
                <List withPadding>
                  <List.Item>Mobile layout fixes</List.Item>
                  <List.Item>Logged out user profiles</List.Item>
                </List>
                <Text mt="md">
                  You can now access the user profile of any registered user on RetroAchievements. You can access their profile by going to https://retroachievements.org/profile/{'<username>'} where <b>{'<username>'}</b> is the username of the user you want to view.
                  All logged out users data is cached for 30 minutes so there will be a slight delay in seeing the latest data.
                </Text>

                <Text mt="md">Plans for v5.2</Text>
                <List withPadding>
                  <List.Item>Customise the order of the beaten and mastery wall</List.Item>
                </List>
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value="v5">
              <Accordion.Control>RetroTrack v5.0 Released</Accordion.Control>
              <Accordion.Panel>
                <Text mb="sm">Here are some of the new features:</Text>
                <List withPadding>
                  <List.Item>Bug fixes and improvements</List.Item>
                  <List.Item>User Profiles!</List.Item>
                </List>
                <Text mt="md">
                  You can now access your user profile by clicking the profile button in the navigation. You can share your
                  profile link to show off your RetroAchievements progress to anyone!
                </Text>
                <Text mt="md">It currently only supports users registered to RetroTrack.</Text>

                <Text mt="md">Plans for v5.1</Text>
                <List withPadding>
                  <List.Item>Support profile page for logged-out users</List.Item>
                </List>
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value="v4">
              <Accordion.Control>RetroTrack v4.0 Released</Accordion.Control>
              <Accordion.Panel>
                <Text mb="sm">Here are some of the new features:</Text>
                <List withPadding>
                  <List.Item>New user interface with a fresh design</List.Item>
                  <List.Item>Bug fixes and performance improvements</List.Item>
                </List>
                <Text mt="md">Thank you for using RetroTrack!</Text>
                <Text mt="md">
                  If you are having issues with the new version, please try clearing your browser cache and cookies.
                </Text>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>

          <Text fw={'bold'} mt="md" size='xl'>Need help?</Text>
          <Text mt="xs">If you have any feedback or suggestions or bug reports, please let me know on either Discord (my username is <b>guinea.</b>), GitHub <a href='https://github.com/Bregann/RetroTrack' target='_blank'>here</a> or on RetroAchievements <a href='https://retroachievements.org/user/guinea' target='_blank'>here</a>!</Text>
        </Modal>
      </AppShell.Main>
    </AppShell>
  )
}

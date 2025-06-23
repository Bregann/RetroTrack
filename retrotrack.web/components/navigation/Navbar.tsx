'use client'

import { useState } from 'react'
import {
  AppShell,
  Burger,
  ScrollArea,
  NavLink,
  TextInput,
  Button,
  ActionIcon,
  Group,
  Text,
  Divider,
  useMantineColorScheme,
  Badge,
  Stack,
} from '@mantine/core'
import { IconDeviceGamepad3, IconHome2, IconMoonStars, IconPin, IconProgress } from '@tabler/icons-react'
import { Press_Start_2P } from 'next/font/google'
import Link from 'next/link'
import styles from '@/css/components/navbar.module.scss'
import { GetPublicNavigationDataResponse } from '@/interfaces/api/navigation/GetPublicNavigationDataResponse'
import { ConsoleType } from '@/enums/consoleType'
import LoginModal from './LoginModal'
import RegisterModal from './RegisterModal'
import { useAuth } from '@/context/authContext'
import { GetLoggedInNavigationDataResponse } from '@/interfaces/api/navigation/GetLoggedInNavigationDataResponse'

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

  const auth = useAuth()
  const consoleTypes = [ConsoleType.Nintendo, ConsoleType.Sony, ConsoleType.Atari, ConsoleType.Sega, ConsoleType.NEC, ConsoleType.SNK, ConsoleType.Other]

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

          <TextInput
            classNames={{
              input: styles.searchInput,
            }}
            placeholder="Search all games..."
            radius="xl"
            size="md"
            style={{ flex: 1, maxWidth: 400 }}
          />
          <Group gap="xs">
            {auth.user === null &&
            <>
              <Button variant="filled" size="sm" onClick={() => setLoginModalOpen(true)}>
              Login
              </Button>
              <Button variant="outline" size="sm" onClick={() => setRegisterModalOpen(true)}>
              Register
              </Button>
            </>
            }

            {auth.user !== null &&
            <>
              <Button onClick={() => { auth.logout() }} variant="filled" size="sm">
                Logout
              </Button>
            </>
            }

            <ActionIcon
              variant="outline"
              size="lg"
              onClick={() => { setColorScheme(colorScheme === 'dark' ? 'light' : 'dark') }}
            >
              <IconMoonStars />
            </ActionIcon>
          </Group>
        </Group>
      </AppShell.Header>

      {/* Navbar content */}
      <AppShell.Navbar className={styles.navbar}>
        <ScrollArea style={{ height: '100%' }}>
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
                      <Divider mt={5} mb={5}/>
                    </div>
                  )
                })}
                {props.loggedInNavigationData !== null && props.loggedInNavigationData?.consoleProgressData.filter(x => x.consoleType === type).map((navItem) => {
                  return(
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
                      <Divider mt={5} mb={5}/>
                    </div>

                  )
                })}
              </NavLink>
            )
          })}


        </ScrollArea>
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

      </AppShell.Main>
    </AppShell>
  )
}

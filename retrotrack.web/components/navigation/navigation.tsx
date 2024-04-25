import fetchHelper from '@/helpers/FetchHelper'
import { type GetPublicNavigationDataDto } from '@/pages/api/navigation/GetPublicNavigationData'
import { AppShell, Burger, Button, Group, NavLink, ScrollArea } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconCheck, IconCrossFilled, IconDeviceGamepad3, IconHome2, IconPin, IconProgress } from '@tabler/icons-react'
import { type AppProps } from 'next/app'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import LoginModal from './LoginModal'
import RegisterModal from './RegisterModal'
import SupportModal from './SupportModal'
import sessionHelper from '@/helpers/SessionHelper'
import notificationHelper from '@/helpers/NotificationHelper'
import { useRouter } from 'next/router'
import ChangelogModal from './ChangelogModal'

const Navigation = (props: AppProps): JSX.Element => {
  const { Component, pageProps } = props
  const [opened, { toggle }] = useDisclosure()
  const [loginModalOpened, setLoginModalOpened] = useState(false)
  const [registerModalOpened, setRegisterModalOpened] = useState(false)
  const [supportModalOpened, setSupportModalOpened] = useState(false)
  const [changelogModalOpened, setChangelogModalOpened] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const [navData, setNavData] = useState<GetPublicNavigationDataDto[] | null>(null)
  const [activePage, setActivePage] = useState('')
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

  useEffect(() => {
    setLoggedIn(sessionHelper.hasSession())
  }, [router.pathname])

  useEffect(() => {
    if (loggedIn) {
      // get logged in data
    } else {
      const fetchLoggedOutData = async (): Promise<void> => {
        const fetchResult = await fetchHelper.doGet('/navigation/GetPublicNavigationData')

        if (fetchResult.errored) {
          console.error('Error loading navigation data')
        } else {
          setNavData(fetchResult.data)
        }
      }

      void fetchLoggedOutData()
    }
  }, [loggedIn])

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
  }

  return (
    <>
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: 250,
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
              Website Changelog (v1)
            </Button>
            <Button
              variant="gradient"
              gradient={{ from: 'indigo', to: 'cyan' }}
              onClick={() => { setSupportModalOpened(true) }}>
              Support
            </Button>
            {loggedIn
              ? <>
                <Button
                  variant="gradient"
                  gradient={{ from: 'indigo', to: 'cyan' }}
                  onClick={() => { }}>
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
          <ScrollArea>
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

            {loggedIn &&
              <>
                <NavLink
                  component={Link}
                  href="/trackedgames"
                  label="Tracked Games"
                  leftSection={<IconPin size="1.2rem" stroke={1.5} />}
                  onClick={() => { setActivePage('/trackedgames') }}
                  active={activePage === '/trackedgames'}
                />
                <NavLink
                  component={Link}
                  href="/inprogressgames"
                  label="In Progress Games"
                  leftSection={<IconProgress size="1.2rem" stroke={1.5} />}
                  onClick={() => { setActivePage('/inprogressgames') }}
                  active={activePage === '/inprogressgames'}
                />
              </>
            }

            {consoleTypes.map(console => {
              return (
                <NavLink label={console.consoleName} key={console.consoleType}>
                  {navData?.filter(x => x.consoleType === console.consoleType).sort((a, b) => a.consoleName.localeCompare(b.consoleName)).map(data => {
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
                  })}
                </NavLink>
              )
            })}
          </ScrollArea>
        </AppShell.Navbar>
        <AppShell.Main>
          <LoginModal setOpened={setLoginModalOpened} openedState={loginModalOpened} onSuccessfulLogin={async () => { await successfulLogin() }} />
          <RegisterModal setOpened={setRegisterModalOpened} openedState={registerModalOpened} />
          <SupportModal setOpened={setSupportModalOpened} openedState={supportModalOpened} />
          <ChangelogModal setOpened={setChangelogModalOpened} openedState={changelogModalOpened} />
          <Component {...pageProps} />
        </AppShell.Main>

      </AppShell>
    </>
  )
}

export default Navigation

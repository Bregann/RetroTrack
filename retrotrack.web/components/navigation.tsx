import fetchHelper from '@/helpers/FetchHelper'
import sessionHelper from '@/helpers/sessionHelper'
import { type GetPublicNavigationDataDto } from '@/pages/api/navigation/GetPublicNavigationData'
import { AppShell, Burger, Button, Grid, Group, NavLink, ScrollArea } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconHome2 } from '@tabler/icons-react'
import { type AppProps } from 'next/app'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const Navigation = (props: AppProps): JSX.Element => {
  const { Component, pageProps } = props
  const [opened, { toggle }] = useDisclosure()
  const [loginModalOpened, setLoginModalOpened] = useState(false)
  const [registerModalOpened, setRegisterModalOpened] = useState(false)
  const [supportModalOpened, setSupportModalOpened] = useState(false)
  const [loggedIn, setLoggedIn] = useState(sessionHelper.hasSession())
  const [navData, setNavData] = useState<GetPublicNavigationDataDto[] | null>(null)
  const [activePage, setActivePage] = useState('')

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
    if (loggedIn) {
      // get logged in data
    } else {
      const fetchLoggedOutData = async (): Promise<void> => {
        const fetchResult = await fetchHelper.doGet('/navigation/GetPublicNavigationData')
        console.log(fetchResult)
        if (fetchResult.errored) {
          console.error('Error loading navigation data')
        } else {
          setNavData(fetchResult.data)
        }
      }

      void fetchLoggedOutData()
    }
  }, [loggedIn])

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
              onClick={() => { setSupportModalOpened(true) }}>
              Support
            </Button>
            {loggedIn
              ? <>
                <Button
                  variant="gradient"
                  gradient={{ from: 'indigo', to: 'cyan' }}
                  onClick={() => { /* TODO: Implement */ }}>
                  Update games
                </Button>

                <Button
                  variant="gradient"
                  gradient={{ from: 'orange', to: 'red' }}
                  onClick={() => { /* TODO: Implement - router.push them to homepage */ } }>
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
              href="/"
              label="Home"
              leftSection={<IconHome2 size="1rem" stroke={1.5} />}
              onClick={() => { setActivePage('/') }}
              active={activePage === '/'}
            />
            <NavLink
              component={Link}
              href="/allgames"
              label="All Games"
              leftSection={<IconHome2 size="1rem" stroke={1.5} />}
              onClick={() => { setActivePage('/allgames') }}
              active={activePage === '/allgames'}
            />

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
                      href={`console/${data.consoleId}`}
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
          <Component {...pageProps} />
        </AppShell.Main>

      </AppShell>
    </>
  )
}

export default Navigation

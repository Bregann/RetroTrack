import fetchHelper from '@/helpers/FetchHelper'
import sessionHelper from '@/helpers/sessionHelper'
import { type GetPublicNavigationDataDto } from '@/pages/api/navigation/GetPublicNavigationData'
import { AppShell, Burger, Group, NavLink, ScrollArea } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconHome2 } from '@tabler/icons-react'
import { type AppProps } from 'next/app'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const Navigation = (props: AppProps): JSX.Element => {
  const { Component, pageProps } = props
  const [opened, { toggle }] = useDisclosure()
  const [loggedIn, setLoggedIn] = useState(sessionHelper.hasSession())
  const [navData, setNavData] = useState<GetPublicNavigationDataDto[] | null>(null)
  const [activePage, setActivePage] = useState('')

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
          <Group h="100%" px="md">
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
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
            <NavLink label="Nintendo">
              {navData?.filter(x => x.consoleType === 0).sort((a, b) => a.consoleName.localeCompare(b.consoleName)).map(data => {
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
            <NavLink label="Sony">
              {navData?.filter(x => x.consoleType === 1).sort((a, b) => a.consoleName.localeCompare(b.consoleName)).map(data => {
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
            <NavLink label="Atari">
              {navData?.filter(x => x.consoleType === 2).sort((a, b) => a.consoleName.localeCompare(b.consoleName)).map(data => {
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
            <NavLink label="Sega">
              {navData?.filter(x => x.consoleType === 3).sort((a, b) => a.consoleName.localeCompare(b.consoleName)).map(data => {
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
            <NavLink label="NEC">
              {navData?.filter(x => x.consoleType === 4).sort((a, b) => a.consoleName.localeCompare(b.consoleName)).map(data => {
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
            <NavLink label="SNK">
              {navData?.filter(x => x.consoleType === 5).sort((a, b) => a.consoleName.localeCompare(b.consoleName)).map(data => {
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
            <NavLink label="Other">
              {navData?.filter(x => x.consoleType === 6).sort((a, b) => a.consoleName.localeCompare(b.consoleName)).map(data => {
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

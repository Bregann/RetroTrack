import sessionHelper from '@/helpers/sessionHelper'
import { AppShell, Burger, Group, NavLink } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconHome2 } from '@tabler/icons-react'
import { type AppProps } from 'next/app'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const Navigation = (props: AppProps): JSX.Element => {
  const { Component, pageProps } = props
  const [opened, { toggle }] = useDisclosure()
  const [loggedIn, setLoggedIn] = useState(sessionHelper.hasSession())
  useEffect(() => {
    if (loggedIn) {
      // get logged in data
    } else {
      // get logged out
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
          <NavLink
            component={Link}
            href="/"
            label="Home"
            leftSection={<IconHome2 size="1rem" stroke={1.5} />}
            active
          />
          <NavLink
            component={Link}
            href="/"
            label="All Games"
            leftSection={<IconHome2 size="1rem" stroke={1.5} />}
            active
          />
        </AppShell.Navbar>
        <AppShell.Main>
          <Component {...pageProps} />
        </AppShell.Main>

      </AppShell>
    </>
  )
}

export default Navigation

import sessionHelper from '@/helpers/sessionHelper'
import { AppShell, Burger, Group, NavLink } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconHome2 } from '@tabler/icons-react'
import { type AppProps } from 'next/app'
import Link from 'next/link'
import { useEffect } from 'react'

const Navigation = (props: AppProps): JSX.Element => {
  const { Component, pageProps } = props
  const [opened, { toggle }] = useDisclosure()

  useEffect(() => {
    const hasCookie = sessionHelper.hasSession()
  }, [])

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
        <AppShell.Navbar p="md">
          <NavLink
            component={Link}
            href="#required-for-focus"
            label="Home"
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

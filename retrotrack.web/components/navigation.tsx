import { AppShell, Burger, Group } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { type AppProps } from 'next/app'

const Navigation = (props: AppProps): JSX.Element => {
  const { Component, pageProps } = props
  const [opened, { toggle }] = useDisclosure()

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
        </AppShell.Navbar>
        <AppShell.Main>
          <Component {...pageProps} />
        </AppShell.Main>

      </AppShell>
    </>
  )
}

export default Navigation

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
  Stack,
  Text,
  Badge,
  Divider,
  useMantineColorScheme,
} from '@mantine/core'
import { IconDeviceGamepad3, IconHome2, IconMoonStars } from '@tabler/icons-react'
import { Press_Start_2P } from 'next/font/google'
import Link from 'next/link'
import styles from '@/css/components/navbar.module.scss'
import { GetPublicNavigationDataResponse } from '@/interfaces/api/navigation/GetPublicNavigationDataResponse'

const pressStart2P = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

interface NavbarProps {
  children: React.ReactNode,
  publicNavigationData: GetPublicNavigationDataResponse | null
}

export function Navbar(props: NavbarProps) {
  const [opened, setOpened] = useState(false)
  const { setColorScheme, colorScheme } = useMantineColorScheme()
  const [currentPage, setCurrentPage] = useState(typeof window !== 'undefined' ? window.location.pathname : '/')

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
            <Button variant="filled" size="sm">
              Login
            </Button>
            <Button variant="outline" size="sm">
              Register
            </Button>
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

          <NavLink
            label="Nintendo"
            py="xs"
          >
            <NavLink
              label="Game Boy"
              py="xs"
              description={
                <Stack gap="xs" mt="xs">
                  <Text size="sm" c="dimmed">
                    1104 games
                  </Text>
                  <Group gap="xs">
                    <Badge color="teal" variant="light" size="sm">
                      beaten
                    </Badge>
                    <Text size="sm">1444/1104 (0.36%)</Text>
                  </Group>
                  <Group gap="xs">
                    <Badge color="cyan" variant="light" size="sm">
                      softcore
                    </Badge>
                    <Text size="sm">1444/1104 (0.36%)</Text>
                  </Group>
                  <Group gap="xs">
                    <Badge color="orange" variant="light" size="sm">
                      completed
                    </Badge>
                    <Text size="sm">1344/1104 (0.27%)</Text>
                  </Group>
                  <Group gap="xs">
                    <Badge color="yellow" variant="light" size="sm">
                      mastered
                    </Badge>
                    <Text size="sm">1344/1104 (0.27%)</Text>
                  </Group>
                </Stack>
              }
            />
            <Divider mt="xs" />
          </NavLink>
        </ScrollArea>
      </AppShell.Navbar>

      {/* Main content */}
      <AppShell.Main>
        {props.children}
      </AppShell.Main>
    </AppShell>
  )
}

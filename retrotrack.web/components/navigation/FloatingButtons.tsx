'use client'

import { Button, Group, useMantineColorScheme } from '@mantine/core'

export default function FloatingButtons() {
  const { setColorScheme, colorScheme } = useMantineColorScheme()

  return (
    <Group
      style={{
        position: 'absolute',
        top: '1rem',
        right: '1rem',
        zIndex: 1000,
      }}
    >
      <Button variant="light" color="indigo">Login</Button>
      <Button variant="outline" color="indigo">Register</Button>
      <Button variant="outline" color="indigo" onClick={() => { setColorScheme(colorScheme === 'dark' ? 'light' : 'dark') }}>Theme</Button>
    </Group>
  )
}

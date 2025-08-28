'use client'

import { pressStart2P } from '@/font/pressStart2P'
import { Container, Text, Divider, List, ThemeIcon, rem, Title } from '@mantine/core'
import { IconCheck } from '@tabler/icons-react'
import Link from 'next/link'

export default function IndexComponent() {
  return (
    <Container size="90%">
      <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
        <Text
          size={'28px'}
          mt={'xl'}
          ta="center"
          className={pressStart2P.className}
        >
          RetroTrack
        </Text>
      </Link>
      <Text size='lg' ta="center">A feature full achievement tracker for RetroAchievements!</Text>

      <Divider my="lg" />

      <Title order={2} ta="left">Features</Title>
      <Text size="md" pb="xs" ta="left">As soon as you register, you get access to these features:</Text>
      <List
        mx={'xl'}
        spacing="xs"
        pb="xs"
        size="md"
        ta="left"
        icon={
          <ThemeIcon color="teal" size={24} radius="xl">
            <IconCheck style={{ width: rem(16), height: rem(16) }} />
          </ThemeIcon>
        }>
        <List.Item>All RetroAchievements supported consoles with new consoles added swiftly after release!</List.Item>
        <List.Item>Easy to use user interface!</List.Item>
        <List.Item>Registration system for simple logging in!</List.Item>
        <List.Item>Ability to track specific games and all your current in progress games!</List.Item>
        <List.Item>Filter games by players, achievement counts and even genres!</List.Item>
        <List.Item>Plus many more!</List.Item>
      </List>

      <Divider my="lg" />

      <Title order={3} ta="left">Registering is simple!</Title>
      <Text ta="left" size='md'>All you need is your RetroAchievements username, RetroAchievements API Key and a password you would like to use. It&apos;s really just that easy!</Text>

      <Divider my="lg" />

      <Text ta="left" size='md' mt="md">Please note the website is currently still under active development. If you notice anything please get in contact with me on RetroAchievements (guinea) or raise a <a href='https://github.com/Bregann/RetroTrack' target='_blank'>GitHub issue</a>.</Text>
      <Text ta="left" size='md'>If you have any suggestions on features you would like, let me know! I&apos;m more than happy to add in new features to improve the site!</Text>
    </Container>
  )
}

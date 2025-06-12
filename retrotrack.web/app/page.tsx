'use client'

import { Container, Text, Divider, List, ThemeIcon, rem } from '@mantine/core'
import { IconCircleCheck } from '@tabler/icons-react'

export default function Home() {
  return (
    <main>
      <Container size="90%">
        <Text ta="center" size='60px'>RetroTrack</Text>
        <Text ta="center" size='30px' mt={20} mb={20}>RetroTrack is an feature full achievement tracker for RetroAchievements!</Text>
        <Divider mt={10} mb={10} />
        <Text ta="center" size='25px' mb={20}>All the below features are available as soon as you are a registered user:</Text>

        <List
          style={{ marginLeft: '25%', marginRight: '25%' }}
          spacing="xs"
          size="md"
          center
          icon={
            <ThemeIcon color="teal" size={24} radius="xl">
              <IconCircleCheck style={{ width: rem(16), height: rem(16) }} />
            </ThemeIcon>
          }>
          <List.Item>All RetroAchievements supported consoles with new consoles added swiftly after release!</List.Item>
          <List.Item>Easy to use user interface!</List.Item>
          <List.Item>Registration system for simple logging in!</List.Item>
          <List.Item>Ability to track specific games and all your current in progress games!</List.Item>
          <List.Item>Filter games by players, achievement counts and even genres!</List.Item>
          <List.Item>Plus more!</List.Item>
        </List>

        <Divider mt={10} mb={10} />

        <Text ta="center" size='20px' mb={20}>Registering is simple! All you need is your RetroAchievements username, RetroAchievements API Key and a password you would like to use. It&apos;s really just that easy!</Text>
        <Text ta="center" size='20px' mb={20}>Please note the website is currently still under active development. If you notice anything please get in contact with me on RetroAchievements (guinea) or raise a Github issue here: <a href='https://github.com/Bregann/RetroTrack' target='_blank'>GitHub</a></Text>
        <Text ta="center" size='20px'>If you have any suggestions on features you would like, let me know! I&apos;m more than happy to add in new features to improve the site!</Text>
      </Container>
    </main>
  )
}

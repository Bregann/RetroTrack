import { Container, Divider, List, Text, ThemeIcon, rem } from '@mantine/core'
import { IconCircleCheck } from '@tabler/icons-react'

const Page = (): JSX.Element => {
  return (
    <>
      <Container size="90%">
        <Text ta="center" size='60px'>RetroTrack</Text>
        <Text ta="center" size='30px' mt={20}>RetroTrack is an feature full achievement tracker for RetroAchievements!</Text>
        <Divider mt={10} mb={10} />
        <Text ta="center" size='25px' mb={10}>All the below features are available as soon as you are a registered user:</Text>

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

        <Text ta="center" size='20px' mb={10}>Registering is simple! All you need is your RetroAchievements username, RetroAchievements API Key and a password you would like to use. It&apos;s really just that easy!</Text>
        <Text ta="center" size='20px' mb={10}>Please note the website is currently still under active development. If you notice anything please use the support button in the top right for assistance.</Text>
        <Text ta="center" size='20px'>If you have any suggestions on features you would like, let me know! I&apos;m more than happy to add in new features to improve the site!</Text>
      </Container>
    </>

  )
}

export default Page

import { List, Text } from "@mantine/core";

export default function Home() {
  return (
    <>
    <Text align="center" size={60}>RetroTrack</Text>
    <Text align="center">RetroTrack (formly known as RetroAchievementsTracker) is an feature full achievement tracker for RetroAchievements!</Text>
    <Text align="center">All the below features are available as soon as you are a registered user:</Text>
    <List>
      <List.Item>All RetroAchievements supported consoles with new consoles added swiftly after release!</List.Item>
      <List.Item>Easy to use user interface!</List.Item>
      <List.Item>Registration system for simple logging in!</List.Item>
      <List.Item>Ability to track specific games and all your current in progress games!</List.Item>
      <List.Item>Filter games by players, achievement counts and even genres!</List.Item>
      <List.Item>Plus more!</List.Item>
    </List>

    <Text align="center">Registering is simple! All you need is your RetroAchievements username, RetroAchievements API Key and a password you would like to use. It&apos;s really just that easy!</Text>

    <Text align="center">Please note the website is currently still under construction. If you notice anything please use the support button in the top right for assistance. If you were registered previously on RetroAchievementsTracker, you will be able to use those details to log in</Text>

    </>
    
  )
}
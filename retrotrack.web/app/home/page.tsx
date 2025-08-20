export const runtime = 'nodejs'

import HomeComponent from '@/components/pages/HomeComponent'
import { doGet } from '@/helpers/apiClient'
import { GetRecentlyAddedAndUpdatedGamesResponse } from '@/interfaces/api/games/GetRecentlyAddedAndUpdatedGamesResponse'
import { Button, Container, Title, Text } from '@mantine/core'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'RetroTrack - Home',
  description: 'RetroTrack is a feature-rich achievement tracker for RetroAchievements!',
  icons: {
    icon: '/favicon.ico'
  }
}

export default async function Home() {
  const homePageData = await doGet<GetRecentlyAddedAndUpdatedGamesResponse>('/api/games/GetRecentlyAddedAndUpdatedGames', { next: { revalidate: 60 } })
  return (
    <main>
      {homePageData.status !== 200 &&
        <Container ta="center">
          <Title order={2} pt="xl">Error {homePageData.status}</Title>
          <Text pb="lg">Sorry about that, we couldn't load the home page data. Try again later.</Text>
          <Link href="/home"><Button size="md" radius="md" variant="light">Head Home</Button></Link>
        </Container>
      }
      {homePageData.ok && homePageData.data !== undefined &&
        <HomeComponent pageData={homePageData.data} />
      }
    </main>
  )
}

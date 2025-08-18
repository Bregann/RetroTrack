export const runtime = 'nodejs'

import TrackedGames from '@/components/pages/TrackedGames'
import { doGet } from '@/helpers/apiClient'
import { GetUserTrackedGamesResponse } from '@/interfaces/api/trackedGames/GetUserTrackedGamesResponse'
import { Button, Container, Text, Title } from '@mantine/core'
import { Metadata } from 'next'
import { cookies } from 'next/headers'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'RetroTrack - Tracked Games',
  description: 'View and manage your tracked games on RetroTrack. Keep track of your progress and achievements.',
  icons: {
    icon: '/favicon.ico'
  }
}

export default async function Page() {
  const cookieStore = await cookies()

  let loggedInData: GetUserTrackedGamesResponse | null = null

  // Check if the user is logged in by checking for the accessToken cookie
  if (cookieStore.has('accessToken')) {
    // As it is a server-side request, we need to pass the cookies manually
    // because Next.js does not automatically forward cookies in server-side requests
    // server side to server side requests do not have access to the cookies directly
    const cookieHeader = cookieStore
      .getAll()
      .map(c => `${c.name}=${c.value}`)
      .join('; ')

    const result = await doGet<GetUserTrackedGamesResponse>('/api/trackedgames/GetTrackedGamesForUser?Skip=0&Take=100&SortByName=true', { cookieHeader })
    if (result.status !== 200 || result.data === undefined) {
      console.error('Failed to load logged in navigation data:', result.status)
      loggedInData = null
    } else {
      loggedInData = result.data
    }
  }

  return (
    <main>
      {loggedInData === null &&
        <Container ta="center">
          <Title order={2} pt="xl">Error</Title>
          <Text pb="lg">Sorry about that, we couldn't find your games, either you are not logged in or an error occurred.</Text>
          <Link href="/home"><Button size="md" radius="md" variant="light">Head Home</Button></Link>
        </Container>
      }

      {loggedInData !== null &&
        <TrackedGames
          totalGames={loggedInData.totalCount}
          pageData={loggedInData}
        />
      }
    </main>
  )
}

import LoggedInGamesTable from '@/components/pages/LoggedInGamesTable'
import PublicGamesTable from '@/components/pages/PublicGamesTable'
import { doGet } from '@/helpers/apiClient'
import { GetGamesForConsoleResponse } from '@/interfaces/api/games/GetGamesForConsoleResponse'
import { GetUserProgressForConsoleResponse } from '@/interfaces/api/games/GetUserProgressForConsoleResponse'
import { Container, Title, Button, Text } from '@mantine/core'
import { Metadata } from 'next'
import { cookies } from 'next/headers'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'RetroTrack - Console Games',
  description: 'View all games for a specific console on RetroTrack. Track your progress and achievements for each game.',
  icons: {
    icon: '/favicon.ico'
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ consoleId: string }>
}) {
  const { consoleId } = await params
  const cookieStore = await cookies()

  let publicData: GetGamesForConsoleResponse | null = null
  let loggedInData: GetUserProgressForConsoleResponse | null = null

  // Check if the user is logged in by checking for the accessToken cookie
  if (cookieStore.has('accessToken')) {
    // As it is a server-side request, we need to pass the cookies manually
    // because Next.js does not automatically forward cookies in server-side requests
    // server side to server side requests do not have access to the cookies directly
    const cookieHeader = cookieStore
      .getAll()
      .map(c => `${c.name}=${c.value}`)
      .join('; ')

    const result = await doGet<GetUserProgressForConsoleResponse>(`/api/games/GetUserProgressForConsole?ConsoleId=${consoleId}&Skip=0&Take=100&SortByName=true`, { next: { revalidate: 60 }, cookieHeader })
    if (result.status !== 200 || result.data === undefined) {
      console.error('Failed to load logged in navigation data:', result.status)
      loggedInData = null
    } else {
      loggedInData = result.data
    }
  }
  else {
    const result = await doGet<GetGamesForConsoleResponse>(`/api/games/GetGamesForConsole?ConsoleId=${consoleId}&Skip=0&Take=100&SortByName=true`, { next: { revalidate: 60 } })
    if (result.status !== 200 || result.data === undefined) {
      console.error('Failed to load public navigation data:', result.status)
      publicData = null
    } else {
      publicData = result.data
    }
  }

  return (
    <main>
      {publicData === null && loggedInData === null &&
        <Container ta="center">
          <Title order={2} pt="xl">Error</Title>
          <Text pb="lg">Sorry about that, we couldn&apos;t load the game data, try again later.</Text>
          <Link href="/home"><Button size="md" radius="md" variant="light">Head Home</Button></Link>
        </Container>
      }

      {publicData !== null && loggedInData === null &&
        <PublicGamesTable
          consoleId={parseInt(consoleId)}
          totalGames={publicData.totalCount}
          pageData={publicData}
          showConsoleColumn={false}
        />
      }

      {publicData === null && loggedInData !== null &&
        <LoggedInGamesTable
          consoleId={parseInt(consoleId)}
          totalGames={loggedInData.totalCount}
          pageData={loggedInData}
          showConsoleColumn={false}
        />
      }
    </main>
  )
}


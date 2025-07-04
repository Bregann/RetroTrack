export const runtime = 'nodejs'

import LoggedInGamesTable from '@/components/pages/LoggedInGamesTable'
import PublicGamesTable from '@/components/pages/PublicGamesTable'
import { doGet } from '@/helpers/apiClient'
import { GetGamesForConsoleResponse } from '@/interfaces/api/games/GetGamesForConsoleResponse'
import { GetUserProgressForConsoleResponse } from '@/interfaces/api/games/GetUserProgressForConsoleResponse'
import { Metadata } from 'next'
import { cookies } from 'next/headers'

export const metadata: Metadata = {
  title: 'RetroTrack - All Games',
  description: 'View all games across all consoles on RetroTrack. Track your progress and achievements for each game.',
  icons: {
    icon: '/favicon.ico'
  }
}

export default async function Page() {
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

    const result = await doGet<GetUserProgressForConsoleResponse>('/api/games/GetUserProgressForConsole?ConsoleId=-1&Skip=0&Take=100&SortByName=true', { next: { revalidate: 60 }, cookieHeader })
    if (result.status !== 200 || result.data === undefined) {
      console.error('Failed to load logged in navigation data:', result.status)
      loggedInData = null
    } else {
      loggedInData = result.data
    }
  }
  else{
    const result = await doGet<GetGamesForConsoleResponse>('/api/games/GetGamesForConsole?ConsoleId=-1&Skip=0&Take=100&SortByName=true', { next: { revalidate: 60 } })
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
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h1>Error</h1>
          <p>Failed to load all games page data. Please try again later.</p>
        </div>
      }

      {publicData !== null && loggedInData === null &&
        <PublicGamesTable
          consoleId={-1}
          consoleName={publicData.consoleName}
          totalGames={publicData.totalCount}
          pageData={publicData}
          showConsoleColumn={true}
        />
      }

      {publicData === null && loggedInData !== null &&
        <LoggedInGamesTable
          consoleId={-1}
          consoleName={loggedInData.consoleName}
          totalGames={loggedInData.totalCount}
          pageData={loggedInData}
          showConsoleColumn={true}
        />
      }
    </main>
  )
}

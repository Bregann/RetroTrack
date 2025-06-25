import InProgressGamesTable from '@/components/pages/InProgressGamesTable'
import { doGet } from '@/helpers/apiClient'
import { GetUserProgressForConsoleResponse } from '@/interfaces/api/games/GetUserProgressForConsoleResponse'
import { Metadata } from 'next'
import { cookies } from 'next/headers'

export const metadata: Metadata ={
  title: 'RetroTrack - In Progress Games',
  description: 'View all games you are currently playing on RetroTrack. Track your progress and achievements for each game.',
  icons: {
    icon: '/favicon.ico'
  }
}

export default async function Page() {
  const cookieStore = await cookies()

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

    const result = await doGet<GetUserProgressForConsoleResponse>('/api/games/GetUserProgressForConsole?ConsoleId=-1&Skip=0&Take=100&SortByName=true&HideUnstartedGames=true&HideCompletedGames=true', { next: { revalidate: 60 }, cookieHeader })
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
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h1>Error</h1>
          <p>Failed to load in progress game page data. Please try again later.</p>
        </div>
      }

      {loggedInData !== null &&
        <InProgressGamesTable
          totalGames={loggedInData.totalCount}
          pageData={loggedInData}
        />
      }
    </main>
  )
}

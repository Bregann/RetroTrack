import LoggedInGamesTable from '@/components/pages/LoggedInGamesTable'
import PublicGamesTable from '@/components/pages/PublicGamesTable'
import { doGet } from '@/helpers/apiClient'
import { GetGamesForConsoleResponse } from '@/interfaces/api/games/GetGamesForConsoleResponse'
import { GetUserProgressForConsoleResponse } from '@/interfaces/api/games/GetUserProgressForConsoleResponse'
import { cookies } from 'next/headers'

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
  else{
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
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h1>Error</h1>
          <p>Failed to load all games page data. Please try again later.</p>
        </div>
      }

      {publicData !== null && loggedInData === null &&
        <PublicGamesTable
          consoleId={parseInt(consoleId)}
          consoleName={publicData.consoleName}
          totalGames={publicData.totalCount}
          pageData={publicData}
        />
      }

      {publicData === null && loggedInData !== null &&
        <LoggedInGamesTable
          consoleId={parseInt(consoleId)}
          consoleName={loggedInData.consoleName}
          totalGames={loggedInData.totalCount}
          pageData={loggedInData}
        />
      }
    </main>
  )
}

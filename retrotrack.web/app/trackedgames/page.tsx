import TrackedGames from '@/components/pages/TrackedGames'
import { doGet } from '@/helpers/apiClient'
import { GetUserTrackedGamesResponse } from '@/interfaces/api/trackedGames/GetUserTrackedGamesResponse'
import { cookies } from 'next/headers'

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
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h1>Error</h1>
          <p>Failed to load tracked games page data. Please try again later.</p>
        </div>
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

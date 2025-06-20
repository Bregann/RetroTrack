import HomeComponent from '@/components/pages/HomeComponent'
import { doGet } from '@/helpers/apiClient'
import { GetRecentlyAddedAndUpdatedGamesResponse } from '@/interfaces/api/gamess/GetRecentlyAddedAndUpdatedGamesResponse'

export default async function Home() {
  const homePageData = await doGet<GetRecentlyAddedAndUpdatedGamesResponse>('/api/games/GetRecentlyAddedAndUpdatedGames', { next: { revalidate: 60 } })
  return (
    <main>
      {homePageData.status !== 200 &&
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h1>Error {homePageData.status}</h1>
          <p>Failed to load home page data. Please try again later.</p>
        </div>
      }
      {homePageData.ok && homePageData.data !== undefined &&
        <HomeComponent pageData={homePageData.data} />
      }
    </main>
  )
}

import PublicGamesTable from '@/components/pages/PublicGamesTable'
import { doGet } from '@/helpers/apiClient'
import { GetGamesForConsoleResponse } from '@/interfaces/apii/gamess/GetGamesForConsoleResponse'

export default async function Page({
  params,
}: {
  params: Promise<{ consoleId: string }>
}) {
  const { consoleId } = await params

  const pageData = await doGet<GetGamesForConsoleResponse>(`/api/games/GetGamesForConsole?ConsoleId=${consoleId}&Skip=0&Take=100&SortByName=true`)
  return (
    <main>
      {pageData.status !== 200 &&
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h1>Error {pageData.status}</h1>
          <p>Failed to load all games page data. Please try again later.</p>
        </div>
      }
      {pageData.ok && pageData.data !== undefined &&
        <PublicGamesTable
          pageData={pageData.data}
          consoleId={parseInt(consoleId)}
          consoleName={pageData.data.consoleName}
          totalGames={pageData.data.totalCount}
        />
      }
    </main>
  )
}

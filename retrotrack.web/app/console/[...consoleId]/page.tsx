import LoggedInGamesTable from '@/components/pages/LoggedInGamesTable'
import PublicGamesTable from '@/components/pages/PublicGamesTable'
import { doQueryGet } from '@/helpers/apiClient'
import { GetGamesForConsoleResponse } from '@/interfaces/api/games/GetGamesForConsoleResponse'
import { GetUserProgressForConsoleResponse } from '@/interfaces/api/games/GetUserProgressForConsoleResponse'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { Metadata } from 'next'
import { cookies } from 'next/headers'

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
  const queryClient = new QueryClient()

  // Check if the user is logged in by checking for the accessToken cookie
  if (cookieStore.has('accessToken')) {
    // As it is a server-side request, we need to pass the cookies manually
    // because Next.js does not automatically forward cookies in server-side requests
    // server side to server side requests do not have access to the cookies directly
    const cookieHeader = cookieStore
      .getAll()
      .map(c => `${c.name}=${c.value}`)
      .join('; ')

    await queryClient.prefetchQuery({
      queryKey: ['ConsoleId=-1&Skip=0&Take=100&SortByName=true'],
      queryFn: async () => await doQueryGet<GetUserProgressForConsoleResponse>(`/api/games/GetUserProgressForConsole?ConsoleId=${consoleId}&Skip=0&Take=100&SortByName=true`, { next: { revalidate: 60 }, cookieHeader }),
      staleTime: 60000
    })
    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
        <LoggedInGamesTable
          consoleId={Number(consoleId)}
          showConsoleColumn={false}
        />
      </HydrationBoundary>
    )
  }
  else {
    await queryClient.prefetchQuery({
      queryKey: ['ConsoleId=-1&Skip=0&Take=100&SortByName=true-lg'],
      queryFn: async () => await doQueryGet<GetGamesForConsoleResponse>(`/api/games/GetGamesForConsole?ConsoleId=${consoleId}&Skip=0&Take=100&SortByName=true`, { next: { revalidate: 60 } }),
      staleTime: 60000
    })

    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
        <PublicGamesTable
          consoleId={Number(consoleId)}
          showConsoleColumn={false}
        />
      </HydrationBoundary>
    )
  }
}


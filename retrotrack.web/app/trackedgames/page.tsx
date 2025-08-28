import TrackedGames from '@/components/pages/TrackedGames'
import { doQueryGet } from '@/helpers/apiClient'
import { GetUserTrackedGamesResponse } from '@/interfaces/api/trackedGames/GetUserTrackedGamesResponse'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { Metadata } from 'next'
import { cookies } from 'next/headers'

export const metadata: Metadata = {
  title: 'RetroTrack - Tracked Games',
  description: 'View and manage your tracked games on RetroTrack. Keep track of your progress and achievements.',
  icons: {
    icon: '/favicon.ico'
  }
}

export default async function Page() {
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
      queryKey: ['Skip=0&Take=25&SortByName=true'],
      queryFn: () => doQueryGet<GetUserTrackedGamesResponse>('/api/trackedgames/GetTrackedGamesForUser?Skip=0&Take=25&SortByName=true', { next: { revalidate: 60 }, cookieHeader }),
      staleTime: 60000
    })
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TrackedGames />
    </HydrationBoundary>
  )
}

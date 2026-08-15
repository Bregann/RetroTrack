import { cookies } from 'next/headers'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { doQueryGet } from '@/helpers/apiClient'
import { GetPublicNavigationDataResponse } from '@/interfaces/api/navigation/GetPublicNavigationDataResponse'
import { GetLoggedInNavigationDataResponse } from '@/interfaces/api/navigation/GetLoggedInNavigationDataResponse'

/**
 * Prefetches the navigation data on the server and pushes it into the client's
 * React Query cache as dehydrated state.
 *
 * This lives in its own component so the root layout can render it inside a
 * Suspense boundary. A layout cannot have a loading.tsx of its own, so awaiting
 * this fetch directly in the layout blocked the first byte on *every* route -
 * roughly 30,000 pages - even though the Navbar already handles its own loading
 * state via isLoading.
 *
 * It renders as a *sibling* of the Navbar rather than a parent, and deliberately
 * has no children: HydrationBoundary hydrates into the QueryClient it reads from
 * context and simply returns its children, so it does not need to wrap the
 * consumer. Keeping the nav and the page outside this boundary is the whole
 * point - they flush immediately while this streams in behind them.
 */
export async function NavigationDataBoundary() {
  const cookieStore = await cookies()
  const queryClient = new QueryClient()

  // get the navigation data depending on whether the user is logged in or not
  // if the user is logged in, we will get the navigation data for the logged in user
  if (cookieStore.has('accessToken')) {
    // As it is a server-side request, we need to pass the cookies manually
    // because Next.js does not automatically forward cookies in server-side requests
    // server side to server side requests do not have access to the cookies directly
    const cookieHeader = cookieStore
      .getAll()
      .map(c => `${c.name}=${c.value}`)
      .join('; ')

    await queryClient.prefetchQuery({
      queryKey: ['getLoggedInNavigationData'],
      queryFn: async () => await doQueryGet<GetLoggedInNavigationDataResponse>('/api/navigation/GetLoggedInNavigationData', { headers: { Cookie: cookieHeader } }),
    })
  } else {
    await queryClient.prefetchQuery({
      queryKey: ['getPublicNavigationData'],
      queryFn: async () => await doQueryGet<GetPublicNavigationDataResponse[]>('/api/navigation/GetPublicNavigationData'),
    })
  }

  return <HydrationBoundary state={dehydrate(queryClient)} />
}

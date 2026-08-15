import LoggedInGamesTable from '@/components/pages/games/logged-in/LoggedInGamesTable'
import PublicGamesTable from '@/components/pages/games/public/PublicGamesTable'
import { doQueryGet } from '@/helpers/apiClient'
import { GetGamesForConsoleResponse } from '@/interfaces/api/games/GetGamesForConsoleResponse'
import { GetUserProgressForConsoleResponse } from '@/interfaces/api/games/GetUserProgressForConsoleResponse'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { Metadata } from 'next'
import { cookies } from 'next/headers'

import { absoluteUrl, SITE_NAME } from '@/helpers/seo'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ consoleId: string[] }>
}): Promise<Metadata> {
  const { consoleId } = await params
  // A catch-all route hands back an array of path segments; the console id is the first
  const id = consoleId[0]
  const canonical = `/console/${id}`
  // Generated social card - defined at /og/console/[consoleId] because Next forbids
  // a static `opengraph-image` segment inside a catch-all route
  const ogImage = absoluteUrl(`/og/console/${id}`)

  try {
    // Fetch a single game so we can name the console - every console page previously
    // shared one identical title, which made them compete with each other in search
    const consoleData = await doQueryGet<GetGamesForConsoleResponse>(
      `/api/games/GetGamesForConsole?ConsoleId=${id}&Skip=0&Take=1&SortByName=true`,
      { next: { revalidate: 3600 } }
    )

    const title = `${consoleData.consoleName} Achievements - All ${consoleData.totalCount} Games`
    const description = `Browse all ${consoleData.totalCount} ${consoleData.consoleName} games with RetroAchievements`
      + `${consoleData.totalAchievements > 0 ? `, covering ${consoleData.totalAchievements} achievements` : ''}.`
      + ` Track your completion progress and compare with other players on ${SITE_NAME}.`

    return {
      title,
      description,
      alternates: {
        canonical
      },
      openGraph: {
        type: 'website',
        siteName: SITE_NAME,
        url: absoluteUrl(canonical),
        title,
        description,
        images: [{ url: ogImage, width: 1200, height: 630, alt: `${consoleData.consoleName} on ${SITE_NAME}` }]
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [ogImage]
      },
      icons: {
        icon: '/favicon.ico'
      }
    }
  } catch {
    return {
      title: 'Console Games',
      description: 'View all games for a specific console on RetroTrack. Track your progress and achievements for each game.',
      alternates: {
        canonical
      },
      openGraph: {
        images: [{ url: ogImage, width: 1200, height: 630 }]
      },
      twitter: {
        card: 'summary_large_image',
        images: [ogImage]
      },
      icons: {
        icon: '/favicon.ico'
      }
    }
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ consoleId: string[] }>
}) {
  const { consoleId: consoleIdSegments } = await params
  // Catch-all params arrive as an array of segments; only the first is the console id
  const consoleId = consoleIdSegments[0]
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
      queryKey: [`ConsoleId=${consoleId}&Skip=0&Take=25&SortByName=true`],
      queryFn: async () => await doQueryGet<GetUserProgressForConsoleResponse>(`/api/games/GetUserProgressForConsole?ConsoleId=${consoleId}&Skip=0&Take=25&SortByName=true`, { next: { revalidate: 60 }, cookieHeader }),
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
      queryKey: [`ConsoleId=${consoleId}&Skip=0&Take=25&SortByName=true-public`],
      queryFn: async () => await doQueryGet<GetGamesForConsoleResponse>(`/api/games/GetGamesForConsole?ConsoleId=${consoleId}&Skip=0&Take=25&SortByName=true`, { next: { revalidate: 60 } }),
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


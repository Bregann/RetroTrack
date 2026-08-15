import { PublicGamePage } from '@/components/pages/games/PublicGamePageComponent'
import { LoggedInGamePage } from '@/components/pages/games/LoggedInGamePageComponent'
import { doQueryGet } from '@/helpers/apiClient'
import { GetPublicSpecificGameInfoResponse } from '@/interfaces/api/games/GetPublicSpecificGameInfoResponse'
import { GetLoggedInSpecificGameInfoResponse } from '@/interfaces/api/games/GetLoggedInSpecificGameInfoResponse'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { Metadata } from 'next'
import { cookies } from 'next/headers'
import { GetLeaderboardsFromGameIdResponse } from '@/interfaces/api/games/GetLeaderboardsFromGameIdResponse'
import { absoluteUrl, jsonLdScript, raImageUrl, SITE_NAME } from '@/helpers/seo'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ gameId: string }>
}): Promise<Metadata> {
  const { gameId } = await params
  const canonical = `/game/${gameId}`

  try {
    // Try to fetch game data for metadata
    const gameData = await doQueryGet<GetPublicSpecificGameInfoResponse>(
      `/api/games/getPublicSpecificGameInfo/${gameId}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    )

    // Front-load the game name and console: these are the terms people actually search for
    const title = `${gameData.title} (${gameData.consoleName}) Achievements`
    const description = `All ${gameData.achievementCount} RetroAchievements for ${gameData.title} on ${gameData.consoleName}`
      + `${gameData.genre !== '' ? ` – ${gameData.genre}` : ''}`
      + `${gameData.developer !== '' ? `, developed by ${gameData.developer}` : ''}.`
      + ` Track your progress, view leaderboards and completion times on ${SITE_NAME}.`

    // `images` is deliberately omitted here: opengraph-image.tsx in this folder
    // generates the card and Next wires it into both og:image and twitter:image
    return {
      title,
      description,
      alternates: {
        canonical
      },
      openGraph: {
        type: 'article',
        siteName: SITE_NAME,
        url: absoluteUrl(canonical),
        title: `${gameData.title} (${gameData.consoleName})`,
        description
      },
      twitter: {
        card: 'summary_large_image',
        title: `${gameData.title} (${gameData.consoleName})`,
        description
      },
      icons: {
        icon: '/favicon.ico'
      }
    }
  } catch {
    // Fallback metadata if game data fetch fails
    return {
      title: 'Game Details',
      description: 'View detailed information about a specific game including achievements and leaderboard',
      alternates: {
        canonical
      },
      icons: {
        icon: '/favicon.ico'
      }
    }
  }
}

/**
 * Emits VideoGame structured data so game pages are eligible for rich results.
 * Failures are swallowed - structured data is an enhancement, never a blocker.
 */
async function GameJsonLd({ gameId }: { gameId: string }) {
  let gameData: GetPublicSpecificGameInfoResponse

  try {
    gameData = await doQueryGet<GetPublicSpecificGameInfoResponse>(
      `/api/games/getPublicSpecificGameInfo/${gameId}`,
      { next: { revalidate: 3600 } }
    )
  } catch {
    return null
  }

  const image = raImageUrl(gameData.imageBoxArt) ?? raImageUrl(gameData.gameImage)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: gameData.title,
    url: absoluteUrl(`/game/${gameId}`),
    image,
    gamePlatform: gameData.consoleName,
    genre: gameData.genre !== '' ? gameData.genre : undefined,
    publisher: gameData.publisher !== '' ? { '@type': 'Organization', name: gameData.publisher } : undefined,
    author: gameData.developer !== '' ? { '@type': 'Organization', name: gameData.developer } : undefined,
    numberOfPlayers: gameData.players > 0 ? gameData.players : undefined,
    // Each RetroAchievements achievement maps onto a schema.org Achievement
    hasPart: gameData.achievements.slice(0, 50).map((achievement) => ({
      '@type': 'Thing',
      name: achievement.title,
      description: achievement.description
    })),
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl('/') },
        { '@type': 'ListItem', position: 2, name: gameData.consoleName, item: absoluteUrl(`/console/${gameData.consoleId}`) },
        { '@type': 'ListItem', position: 3, name: gameData.title, item: absoluteUrl(`/game/${gameId}`) }
      ]
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }}
    />
  )
}

export default async function GamePage({
  params,
}: {
  params: Promise<{ gameId: string }>
}) {
  const { gameId } = await params
  const cookieStore = await cookies()
  const queryClient = new QueryClient()

  // prefetch achievement leaderboards - used for both logged out and in
  await queryClient.prefetchQuery({
    queryKey: ['getAchievementLeaderboards', parseInt(gameId, 10)],
    queryFn: async () => await doQueryGet<GetLeaderboardsFromGameIdResponse>(`/api/games/GetLeaderboardsFromGameId/${gameId}`, { next: { revalidate: 60 } }),
    staleTime: 60000
  })

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
      queryKey: ['getGameInfoForUser', parseInt(gameId, 10)],
      queryFn: async () => await doQueryGet<GetLoggedInSpecificGameInfoResponse>(`/api/games/GetGameInfoForUser/${gameId}`, { cookieHeader }),
      staleTime: 60000
    })

    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
        <main>
          <GameJsonLd gameId={gameId} />
          <LoggedInGamePage gameId={parseInt(gameId, 10)} />
        </main>
      </HydrationBoundary>
    )
  }
  else {
    await queryClient.prefetchQuery({
      queryKey: ['getPublicSpecificGameInfo', parseInt(gameId, 10)],
      queryFn: async () => await doQueryGet<GetPublicSpecificGameInfoResponse>(`/api/games/getPublicSpecificGameInfo/${gameId}`, { next: { revalidate: 60 } }),
      staleTime: 60000
    })

    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
        <main>
          <GameJsonLd gameId={gameId} />
          <PublicGamePage gameId={parseInt(gameId, 10)} />
        </main>
      </HydrationBoundary>
    )
  }
}

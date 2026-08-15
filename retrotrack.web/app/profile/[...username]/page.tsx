import UserProfileComponent from '@/components/pages/UserProfileComponent'
import { doQueryGet } from '@/helpers/apiClient'
import { GetUserProfileResponse } from '@/interfaces/api/users/GetUserProfileResponse'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { cookies } from 'next/headers'
import { Metadata } from 'next'
import { absoluteUrl, SITE_NAME } from '@/helpers/seo'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string[] }>
}): Promise<Metadata> {
  const { username: usernameSegments } = await params
  // Catch-all params arrive as an array of segments; the username is the first
  const username = usernameSegments[0]
  const canonical = `/profile/${username}`

  return {
    title: `${username}'s Profile`,
    description: `View ${username}'s RetroAchievements progress on ${SITE_NAME} - completed games, achievement totals and recent activity.`,
    alternates: {
      canonical
    },
    openGraph: {
      type: 'profile',
      siteName: SITE_NAME,
      url: absoluteUrl(canonical),
      title: `${username}'s RetroAchievements Profile`,
      description: `View ${username}'s achievement progress and completed games on ${SITE_NAME}.`
    },
    icons: {
      icon: '/favicon.ico'
    }
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params
  const queryClient = new QueryClient()
  const cookieStore = await cookies()

  await queryClient.prefetchQuery({
    queryKey: ['GetUserProfile', username],
    queryFn: async () => await doQueryGet<GetUserProfileResponse>(`/api/users/GetUserProfile/${username}`, cookieStore.has('accessToken') ? undefined : { next: { revalidate: 60 } }),
    staleTime: 60000
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserProfileComponent username={username} />
    </HydrationBoundary>
  )
}

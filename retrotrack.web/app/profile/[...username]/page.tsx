import UserProfileComponent from '@/components/pages/UserProfileComponent'
import { doQueryGet } from '@/helpers/apiClient'
import { GetUserProfileResponse } from '@/interfaces/api/users/GetUserProfileResponse'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'

export default async function Page({
  params,
}: {
  params: { username: string }
}) {
  const { username } = await params
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['GetUserProfile', username],
    queryFn: async () => await doQueryGet<GetUserProfileResponse>(`/api/users/GetUserProfile/${username}`, { next: { revalidate: 60 } }),
    staleTime: 60000
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserProfileComponent username={username} />
    </HydrationBoundary>
  )
}

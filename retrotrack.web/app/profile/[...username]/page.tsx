export const runtime = 'nodejs'

import UserProfileComponent from '@/components/pages/UserProfileComponent'
import { doGet } from '@/helpers/apiClient'
import { GetUserProfileResponse } from '@/interfaces/api/users/GetUserProfileResponse'
import { Text } from '@mantine/core'

export default async function Page({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params
  const request = await doGet<GetUserProfileResponse>(`/api/users/GetUserProfile/${username}`)

  if (request.ok && request.data !== undefined){
    return (
      <UserProfileComponent pageData={request.data} />
    )
  }
  else {
    return (
      <Text ta={'center'} size='xl'>Error loading user profile</Text>
    )
  }
}

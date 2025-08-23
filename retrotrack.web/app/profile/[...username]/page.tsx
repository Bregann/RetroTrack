import UserProfileComponent from '@/components/pages/UserProfileComponent'
import { doGet } from '@/helpers/apiClient'
import { GetUserProfileResponse } from '@/interfaces/api/users/GetUserProfileResponse'
import { Button, Container, Text, Title } from '@mantine/core'
import Link from 'next/link'

export default async function Page({ params }: { params: { username: string } }) {
  const { username } = await params
  const request = await doGet<GetUserProfileResponse>(`/api/users/GetUserProfile/${username}`)
  if (request.ok && request.data !== undefined) {
    return (
      <UserProfileComponent pageData={request.data} />
    )
  } else {
    return (
      <>
        <Container ta="center">
          <Title order={2} pt="xl">Error</Title>
          <Text pb="lg">{(request.data !== undefined && request.data.message !== undefined && request.data.message.trim() !== '') ? request.data.message : 'An error occurred'}</Text>
          <Link href="/home"><Button size="md" radius="md" variant="light">Head Home</Button></Link>
        </Container>
      </>
    )
  }
}

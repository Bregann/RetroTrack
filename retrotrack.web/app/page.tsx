import { doGet, doPost } from '@/helpers/apiClient'
import { Button } from '@mantine/core'
import { cookies } from 'next/headers'


export default async function Home() {
  const cookieStore = await cookies()
  const test = await doGet('/games/test', { accessToken: cookieStore.get('accessToken')?.value })


  return (
    <main>
      <h1>Welcome to my Mantine app!</h1>
      <p>This is the home page.</p>

    </main>
  )
}

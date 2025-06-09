'use client'

import { doGet, doPost } from '@/helpers/apiClient'
import { Button } from '@mantine/core'

export default function Home() {
  return (
    <main>
      <h1>Welcome to my Mantine app!</h1>
      <p>This is the home page.</p>
      <Button variant="outline" color="indigo" onClick={async () => { await doPost('/auth/LoginUser', { body: { username: '', password: '' } }) }}>
        Click Me
      </Button>
    </main>
  )
}

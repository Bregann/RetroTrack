// context/AuthContext.tsx
'use client'

import { doPost } from '@/helpers/apiClient'
import { useRouter } from 'next/navigation'
import { createContext, useContext, useState, useEffect } from 'react'

type User = {
  username: string
}

type AuthContextType = {
  isAuthenticated: boolean
  user: User | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const tokenRow = document.cookie
      .split('; ')
      .find(row => row.startsWith('accessToken='))
    const token = tokenRow ? tokenRow.split('=')[1] : undefined

    if (token !== undefined) {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const username = payload[
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'
      ]
      const user = {
        username,
      }
      setUser(user)
      console.log('User loaded from token:', user)
    }
    setLoading(false)
  }, [])

  const login = async (username: string, password: string) => {
    const res = await doPost('/api/auth/LoginUser', { body: { username, password } })
    if (res.status === 200) {
      router.refresh()
      setUser({ username })
      return true
    }
    return false
  }

  const logout = async () => {
    await doPost('/api/auth/DeleteUserSession', {})
    document.cookie = 'accessToken=; Max-Age=0; path=/'
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

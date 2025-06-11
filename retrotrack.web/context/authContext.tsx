// context/AuthContext.tsx
'use client'

import { doGet, doPost } from '@/helpers/apiClient'
import { createContext, useContext, useState, useEffect } from 'react'

type User = {
  username: string
  // add more user props like email, role, etc
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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await doGet<User>('auth/me') //TODO:: add the type for the response
        if (res.status === 200) {
          setUser(res.data ?? null)
        }
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  const login = async (username: string, password: string) => {
    const res = await doPost('auth/LoginUser', { body: { username, password } })
    if (res.status === 200) {
      // after login, fetch the user data
      const userRes = await doGet<User>('auth/me')
      if (userRes.status === 200) {
        setUser(userRes.data ?? null)
        return true
      }
    }
    return false
  }

  const logout = async () => {
    await doPost('/api/auth/LogoutUser', {})
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

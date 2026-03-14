import { createContext, useContext, useState, useEffect } from 'react'
import { doPost } from '../helpers/apiClient'

type User = {
  username: string
}

type AuthContextType = {
  isAuthenticated: boolean
  user: User | null
  login: (_username: string, _password: string) => Promise<boolean>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const STORAGE_KEY = 'retrotrack_user'

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === null) {
      setLoading(false)
      return
    }

    try {
      const parsed = JSON.parse(stored) as User
      // Optimistically restore the user, then validate the session is still alive
      setUser(parsed)
      doPost('/api/auth/RefreshToken', {}).then((res) => {
        if (!res.ok) {
          localStorage.removeItem(STORAGE_KEY)
          setUser(null)
        }
        setLoading(false)
      })
    } catch {
      localStorage.removeItem(STORAGE_KEY)
      setLoading(false)
    }
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    const res = await doPost('/api/auth/LoginUser', { body: { username, password } })
    if (res.status === 200) {
      const newUser: User = { username }
      setUser(newUser)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser))
      return true
    }
    return false
  }

  const logout = async (): Promise<void> => {
    await doPost('/api/auth/DeleteUserSession', {})
    localStorage.removeItem(STORAGE_KEY)
    await window.electron?.db?.clearUserData()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated: user !== null, user, login, logout }}>
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

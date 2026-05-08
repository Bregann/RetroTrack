import { noAuthApiClient } from '@/helpers/apiClient'
import { keychainHelper } from '@/helpers/keychainHelper'
import { LoginUserRequest } from '@/interfaces/api/login/LoginUserRequest'
import { LoginUserResponse } from '@/interfaces/api/login/LoginUserResponse'
import { RegisterUserRequest } from '@/interfaces/api/login/RegisterUserRequest'
import { useRouter, useSegments } from 'expo-router'
import { createContext, useContext, useEffect, useState } from 'react'

type ContextType = {
  isAuthenticated: boolean | null // null = loading
  logOut: () => Promise<void>
  checkAuthStatus: () => void
  attemptLogin: (username: string, password: string) => Promise<boolean>
  attemptRegister: (username: string, password: string, apiKey: string) => Promise<{ success: boolean; error?: string }>
}

const AuthContext = createContext<ContextType | undefined>(undefined)

export const useAuth = (): ContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider')
  }

  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null) // null = loading
  const router = useRouter()
  const segments = useSegments()

  const checkAuthStatus = async (): Promise<void> => {
    const accessToken = await keychainHelper.getAccessToken()
    const isLoggedIn = accessToken !== null && accessToken !== ''
    setIsAuthenticated(isLoggedIn)
  }

  const logOut = async (): Promise<void> => {
    await keychainHelper.deleteTokens()
    setIsAuthenticated(false)
    router.replace('/(auth)/login')
  }

  const attemptLogin = async (username: string, password: string): Promise<boolean> => {
    try {
      const request: LoginUserRequest = {
        username,
        password,
        isMobile: true,
      }

      const response = await noAuthApiClient.post<LoginUserResponse>('/api/Auth/LoginUser', request)

      if (response.status === 401) {
        return false
      }

      if (response.status === 200 && response.data?.accessToken) {
        await keychainHelper.setAccessToken(response.data.accessToken)
        await keychainHelper.setRefreshToken(response.data.refreshToken)
        setIsAuthenticated(true)
        router.replace('/(tabs)')
        return true
      }

      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const attemptRegister = async (username: string, password: string, apiKey: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const request: RegisterUserRequest = {
        username,
        password,
        apiKey,
      }

      const response = await noAuthApiClient.post('/api/Auth/RegisterNewUser', request)

      if (response.status === 200) {
        // Auto-login after successful registration
        return await attemptLogin(username, password).then((loginSuccess) => {
          if (loginSuccess) {
            return { success: true }
          }
          return { success: false, error: 'Registration succeeded but auto-login failed. Please try logging in.' }
        })
      }

      if (response.status === 400) {
        const errorMsg = typeof response.data === 'string' ? response.data : 'Registration failed';
        return { success: false, error: errorMsg };
      }

      return { success: false, error: 'Registration failed. Please try again.' }
    } catch (error: any) {
      console.error('Register error:', error)
      const message = error?.response?.data?.message || error?.message || 'Registration failed. Please try again.'
      return { success: false, error: message }
    }
  }

  // Auth guard: redirect based on auth state
  useEffect(() => {
    if (isAuthenticated === null) return // still loading

    const inAuthGroup = segments[0] === '(auth)'

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login')
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)')
    }
  }, [isAuthenticated, segments])

  useEffect(() => {
    checkAuthStatus()
  }, [])

  return (
    <AuthContext.Provider value={{ isAuthenticated, logOut, checkAuthStatus, attemptLogin, attemptRegister }}>
      {children}
    </AuthContext.Provider>
  )
}
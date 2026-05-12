import { RefreshTokenRequest } from '@/interfaces/api/login/RefreshTokenRequest'
import { RefreshTokenResponse } from '@/interfaces/api/login/RefreshTokenResponse'
import axios from 'axios'
import Constants from 'expo-constants'
import { router } from 'expo-router'
import { keychainHelper } from './keychainHelper'

const authApiClient = axios.create({
  baseURL: __DEV__ ? 'http://192.168.1.248:5053' : Constants.expoConfig?.extra?.ApiUrl || '',
  validateStatus: (status) => status < 500 && status !== 401,
})

let isRefreshing = false
let hasLoggedOut = false

const noAuthApiClient = axios.create({
  baseURL: __DEV__ ? 'http://192.168.1.248:5053' : Constants.expoConfig?.extra?.ApiUrl || '',
  validateStatus (status) {
    return status < 500
  },
})


authApiClient.interceptors.request.use(async (config) => {
  const accessToken = await keychainHelper.getAccessToken()

  console.log('📤 API Request:', {
    method: config.method?.toUpperCase(),
    url: config.url,
    baseURL: config.baseURL,
    hasAccessToken: !!accessToken,
  })

  if (accessToken !== null) {
    config.headers['Authorization'] = `Bearer ${accessToken}`
  }

  return config
})

authApiClient.interceptors.response.use(
  (response) => {
    console.log('📥 API Response:', {
      status: response.status,
      url: response.config.url,
      method: response.config.method?.toUpperCase(),
    })
    return response
  },
  async (error) => {
    console.log('❌ API Error:', {
      status: error.response?.status,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
    })

    // don't bother to try and retry with a 500 error
    if (error.response.status >= 500) {
      return Promise.reject(error)
    }

    // if it's errored with 401, we try to refresh the token
    if (error.response.status === 401) {
      // Already retried once — give up
      if (error.config._retry) {
        console.log('⛔ Already retried after refresh, rejecting')
        hasLoggedOut = true
        await keychainHelper.deleteTokens()
        setTimeout(() => router.replace('/(auth)/login'), 100)
        return Promise.reject(error)
      }

      // If we've already logged out, don't try to refresh
      if (hasLoggedOut) {
        console.log('⛔ Already logged out, rejecting request')
        return Promise.reject(error)
      }

      // If already refreshing, wait a bit and reject
      if (isRefreshing) {
        console.log('⏳ Already refreshing, rejecting duplicate request')
        return Promise.reject(error)
      }

      console.log('🔄 Token expired, attempting refresh...')
      const refreshToken = await keychainHelper.getRefreshToken()

      if (refreshToken === null) {
        console.log('❌ No refresh token available')
        hasLoggedOut = true
        await keychainHelper.deleteTokens()
        setTimeout(() => {
          router.replace('/(auth)/login')
        }, 100)
        return Promise.reject(error)
      }

      isRefreshing = true

      try {
        console.log('🔑 Refreshing token...')
        const request: RefreshTokenRequest = { refreshToken }
        const { data } = await noAuthApiClient.post<RefreshTokenResponse>('/api/Auth/RefreshAppToken', request)

        console.log('✅ Token refreshed successfully')
        await keychainHelper.setAccessToken(data.accessToken)
        await keychainHelper.setRefreshToken(data.refreshToken)

        isRefreshing = false
        hasLoggedOut = false
        error.config.headers['Authorization'] = `Bearer ${data.accessToken}`
        error.config._retry = true

        return authApiClient.request(error.config)
      } catch {
        console.error('❌ Token refresh failed, logging out user')
        isRefreshing = false
        hasLoggedOut = true
        
        // Clear tokens on refresh failure
        await keychainHelper.deleteTokens()
        
        // Force navigation to login screen
        setTimeout(() => {
          router.replace('/(auth)/login')
        }, 100)
        
        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  }
)

export { authApiClient, noAuthApiClient }


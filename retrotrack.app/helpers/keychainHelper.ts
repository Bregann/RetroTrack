import * as SecureStore from 'expo-secure-store'

const getAccessToken = async (): Promise<string | null> => {
  try {
    const accessToken = await SecureStore.getItemAsync('accessToken')
    return accessToken && accessToken.trim() !== '' ? accessToken : null
  } catch (error) {
    console.log('error', error)
    return null
  }
}

const getRefreshToken = async (): Promise<string | null> => {
  try {
    const refreshToken = await SecureStore.getItemAsync('refreshToken')
    return refreshToken && refreshToken.trim() !== '' ? refreshToken : null
  } catch (error) {
    console.log('error', error)
    return null
  }
}

const setAccessToken = async (accessToken: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync('accessToken', accessToken)
  } catch (error) {
    console.log('error', error)
  }
}

const setRefreshToken = async (refreshToken: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync('refreshToken', refreshToken)
  } catch (error) {
    console.log('error', error)
  }
}

const deleteTokens = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync('accessToken')
    await SecureStore.deleteItemAsync('refreshToken')
  } catch (error) {
    console.log('error', error)
  }
}

const isAuthenticated = async (): Promise<boolean> => {
  try {
    const accessToken = await getAccessToken()
    return accessToken !== null
  } catch (error) {
    console.log('error', error)
    return false
  }
}

export const keychainHelper = {
  getAccessToken,
  getRefreshToken,
  isAuthenticated,
  deleteTokens,
  setAccessToken,
  setRefreshToken,
}

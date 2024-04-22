import { deleteCookie, getCookie, setCookie } from 'cookies-next'
import fetchHelper from './FetchHelper'
import { type AttemptLoginDto } from '@/pages/api/auth/LoginUser'

export interface LoginResult {
  success: boolean
  reason: string
}

class sessionHelper {
  public static hasSession (): boolean {
    const cookie = getCookie('rtSession')

    if (cookie === undefined) {
      return false
    }

    console.log(cookie)
    return true
  }

  public static async attemptLogin (username: string, password: string): Promise<LoginResult> {
    const fetchResult = await fetchHelper.doPost('/auth/LoginUser', { username, password })
    if (fetchResult.errored) {
      return {
        success: false,
        reason: 'An unknown error has occurred. Please try again'
      }
    }

    const fetchData: AttemptLoginDto = fetchResult.data
    if (fetchResult.statusCode === 200) {
      setCookie('rtSession', fetchData.sessionId)
      setCookie('rtUsername', fetchData.username)

      return {
        success: true,
        reason: 'Login successful'
      }
    } else if (fetchResult.statusCode === 401) {
      return {
        success: false,
        reason: 'Incorrect username/password'
      }
    } else {
      return {
        success: false,
        reason: 'An unknown error has occurred. Status code '.concat(fetchResult.statusCode.toString())
      }
    }
  }

  public static async LogoutUser (): Promise<boolean> {
    const fetchResult = await fetchHelper.doDelete('/auth/LogoutUser')

    if (fetchResult.errored) {
      return false
    } else {
      deleteCookie('rtSession')
      deleteCookie('rtUsername')
      return true
    }
  }
}

export default sessionHelper

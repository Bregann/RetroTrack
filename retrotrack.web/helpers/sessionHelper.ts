import { getCookie } from 'cookies-next'

class sessionHelper {
  public static hasSession (): boolean {
    const cookie = getCookie('raSession')

    if (cookie === undefined) {
      return false
    }

    console.log(cookie)
    return true
  }
}

export default sessionHelper

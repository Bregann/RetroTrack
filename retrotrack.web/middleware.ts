import { NextRequest, NextResponse } from 'next/server'

// Configuration
// Use environment variables for configuration
let API_BASE_URL = process.env.API_BASE_URL

if (process.env.NODE_ENV === 'development') {
  API_BASE_URL = 'https://localhost:7248/api'
}

const ACCESS_TOKEN_COOKIE = 'accessToken'
const REFRESH_TOKEN_COOKIE = 'refreshToken'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const cookies = request.cookies
  const accessToken = cookies.get(ACCESS_TOKEN_COOKIE)?.value
  const refreshToken = cookies.get(REFRESH_TOKEN_COOKIE)?.value

  // If user is on login page and already authenticated, redirect to home
  if (pathname === '/login' && accessToken !== undefined) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Only when we have a refreshToken but no accessToken
  if (accessToken === undefined && refreshToken !== undefined) {
    try {
      const refreshRes = await fetch(`${API_BASE_URL}/auth/RefreshToken`, {
        method: 'POST',
        headers: {
          // forward only the refreshToken cookie
          'Cookie': `${REFRESH_TOKEN_COOKIE}=${refreshToken}`,
        },
      })

      if (refreshRes.ok) {
        // Pull out all Set-Cookie headers
        const setCookieHeaders: string[] =
          refreshRes.headers.getSetCookie?.() ??
          (refreshRes.headers.get('set-cookie') !== null
            ? refreshRes.headers.get('set-cookie')!.split(/,(?=[^ ;]+=)/)
            : [])

        // Extract the new accessToken value
        let newAccessTokenValue: string | undefined
        for (const header of setCookieHeaders) {
          if (header.startsWith(`${ACCESS_TOKEN_COOKIE}=`)) {
            const [pair] = header.split('; ')
            newAccessTokenValue = pair.split('=')[1]
            break
          }
        }

        if (newAccessTokenValue !== undefined) {
          const originalCookies = request.headers.get('cookie')
          const filtered = originalCookies !== null
            ? originalCookies.split('; ').filter((c) => !c.startsWith(`${ACCESS_TOKEN_COOKIE}=`))
            : []

          filtered.push(`${ACCESS_TOKEN_COOKIE}=${newAccessTokenValue}`)
          const newCookieHeader = filtered.join('; ')

          // Clone request headers and override the Cookie header
          const newHeaders = new Headers(request.headers)
          newHeaders.set('cookie', newCookieHeader)

          // Prepare the middleware response:
          const response = NextResponse.next({
            request: {
              headers: newHeaders,
            },
          })

          // Also re-apply all Set-Cookie headers so the browser stores them
          for (const header of setCookieHeaders) {
            response.headers.append('set-cookie', header)
          }

          return response
        }
      }
    } catch (error) {
      console.error('Error during token refresh:', error)
    }
  }

  return NextResponse.next()
}


export const config = {
  matcher: [
    '/((?!_next/static|_next/image|api|favicon.ico).*)',
  ],
}

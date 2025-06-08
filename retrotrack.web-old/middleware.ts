import { NextResponse, type NextRequest } from 'next/server'
import backendFetchHelper from './helpers/BackendFetchHelper'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  if (request.cookies.has('rtSession')) {
    console.log('cookie')
    const fetchResult = await backendFetchHelper.doGet('/Auth/ValidateSessionStatus', request.cookies.get('rtSession')?.value, request.cookies.get('rtUsername')?.value)

    if (fetchResult.errored) {
      return
    }

    if (fetchResult.data === false) {
      const response = NextResponse.redirect(new URL('/loggedOut', request.url))
      response.cookies.delete('rtSession')
      response.cookies.delete('rtUsername')
      return response
    }

    return
  }

  console.log('no cookie')
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|__nextjs_original-stack-frame).*)',
  ],
}
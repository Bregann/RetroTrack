'use server'

import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// Use environment variables for configuration
const API_BASE_URL = process.env.API_BASE_URL || 'https://localhost:7248/api'
const API_SECRET_KEY = process.env.API_SECRET_KEY || 'supersecret'
const ACCESS_TOKEN_COOKIE = 'accessToken'

// Headers that should not be forwarded from the client to the backend
const HOP_BY_HOP_HEADERS = [
  'host',
  'connection',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailers',
  'transfer-encoding',
  'upgrade',
  'content-length', // Let fetch calculate this
]

async function handler(
  req: NextRequest,
  { params }: { params: Promise<{ route: string[] }> }
) {
  // 1) pull out your path segments
  const { route } = await params
  const segments = route // e.g. ['foo','bar']

  // 2) build the query string
  const qs = req.nextUrl.searchParams.toString() // e.g. 'a=1&b=2'

  // 3) assemble the full URL
  //    only add '?' if there was any search
  const url = `${API_BASE_URL}/${segments.join('/')}${qs ? `?${qs}` : ''}`
  const cookieStore = await cookies()
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value

  // --- Request Headers ---
  const headers = new Headers()
  req.headers.forEach((value, key) => {
    // 3. Improved header filtering
    if (!HOP_BY_HOP_HEADERS.includes(key.toLowerCase())) {
      headers.append(key, value)
    }
  })

  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`)
  }

  headers.set('X-ApiSecretKey', API_SECRET_KEY)

  // --- Request Body (Prioritize Streaming) ---
  let body: BodyInit | null = null
  const contentType = headers.get('content-type')

  // 2. Stream the body for performance, except for specific cases
  if (req.body && !['GET', 'HEAD'].includes(req.method)) {
    // multipart/form-data cannot be streamed directly and must be reconstructed.
    // Other content types can be streamed.
    if (contentType?.includes('multipart/form-data')) {
      body = await req.formData()
      // Let fetch set the new Content-Type with the correct boundary
      headers.delete('content-type')
    } else if(url === `${API_BASE_URL}/auth/DeleteUserSession`){
      // set the body to be the refresh token for the logout request
      body = JSON.stringify({ refreshToken: cookieStore.get('refreshToken')?.value })
      cookieStore.delete('refreshToken') // Clear the refresh token cookie
    }
    else {
      // Stream the body directly for all other types
      body = req.body
    }
  }

  // --- Fetch from Backend ---
  const reqInit: RequestInit & { duplex: 'half' } = {
    method: req.method,
    headers,
    body,
    duplex: 'half', // The duplex field is now required for streaming bodies, but not yet reflected anywhere in docs or types. @see https://github.com/nodejs/node/issues/46221
  }

  const backendRes = await fetch(url, reqInit)

  // --- Response Handling ---
  const responseHeaders = new Headers(backendRes.headers)

  // Handle Set-Cookie header separately
  const setCookie = backendRes.headers.get('set-cookie')
  responseHeaders.delete('set-cookie')

  const response = new NextResponse(backendRes.body, {
    status: backendRes.status,
    statusText: backendRes.statusText,
    headers: responseHeaders,
  })

  // Re-apply Set-Cookie headers one by one
  if (setCookie) {
    // getSetCookie() is available in newer environments and is preferred
    const setCookieHeaders = backendRes.headers.getSetCookie?.() ?? [setCookie]
    for (const cookie of setCookieHeaders) {
      response.headers.append('set-cookie', cookie)
    }
  }

  return response
}

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as PATCH,
  handler as DELETE,
  handler as OPTIONS,
  handler as HEAD,
}

import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const API_BASE = 'https://localhost:7248/api'

export async function handler(
  req: NextRequest,
  context: { params: Promise<{ route: string[] }> }
) {
  const { route } = await context.params
  const url = `${API_BASE}/${route.join('/')}`

  // Extract access token from cookies
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('accessToken')?.value

  const contentType = req.headers.get('content-type') || ''
  const headers: Record<string, string> = {}

  // Copy headers from the request, excluding certain headers
  req.headers.forEach((value, key) => {
    const lowerKey = key.toLowerCase()
    if (!['host', 'connection', 'content-length'].includes(lowerKey)) {
      headers[key] = value
    }
  })

  // Add the access token to the Authorization header if it exists
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`
  }

  let body: BodyInit | undefined = undefined

  // Handle body parsing based on method and content type
  // Only parse body for non-GET/HEAD requests
  if (!['GET', 'HEAD'].includes(req.method)) {

    // Handle different content types
    if (contentType.includes('application/json')) {
      const json = await req.json()
      body = JSON.stringify(json)
      headers['content-type'] = 'application/json'
    }
    // Handle text/plain
    else if (contentType.includes('application/x-www-form-urlencoded')) {
      const text = await req.text()
      body = text
      headers['content-type'] = 'application/x-www-form-urlencoded'
    }
    // Handle multipart/form-data separately
    else if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData()
      const newFormData = new FormData()

      // Convert FormData to a new FormData instance with string values
      for (const [key, value] of formData.entries()) {
        if (typeof value === 'string') {
          newFormData.append(key, value)
        } else {
          // It's a File
          newFormData.append(key, value, value.name)
        }
      }

      body = newFormData

      // Remove the old content-type header so boundary gets auto-set
      delete headers['content-type']
    } else {
      // Fallback for raw blobs or streams
      body = await req.arrayBuffer()
    }
  }

  const backendRes = await fetch(url, {
    method: req.method,
    headers,
    body,
  })

  const setCookieHeader = backendRes.headers.getSetCookie?.()
  ?? backendRes.headers.get('set-cookie') // fallback just in case

  const response = new NextResponse(backendRes.body, {
    status: backendRes.status,
    headers: Object.fromEntries(backendRes.headers.entries()),
  })

  if (setCookieHeader) {
  // If there are multiple Set-Cookie headers, they need to be set one-by-one
    const cookies = Array.isArray(setCookieHeader)
      ? setCookieHeader
      : [setCookieHeader]

    for (const cookie of cookies) {
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

// import next from 'next' // Removed: not needed and causes conflict

if (process.env.NODE_ENV === 'development') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
//TODO: comment it properly
interface FetchResponse<T> {
  data?: T
  status: number
  ok: boolean
  raw: Response
}

interface RequestOptions {
  headers?: HeadersInit
  body?: unknown
  retry?: boolean,
  next?: { revalidate?: number; }
}

async function doRequest<T>(
  method: HttpMethod,
  endpoint: string,
  options: RequestOptions = {}
): Promise<FetchResponse<T>> {
  const {
    body,
    headers = {},
    retry = true,
    next: nextFetchOptions, // get 'next' from options
  } = options

  const res = await fetch(`http://localhost:3000${endpoint}`, {
    method,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    // only JSON-ify if you passed a body
    body: body ? JSON.stringify(body) : undefined,
    // sprinkle in Next.js fetch options
    ...(nextFetchOptions && { next: nextFetchOptions }),
  })

  // 🛑 Unauthorized? Time to refresh & retry ONCE
  if (res.status === 401 && retry) {
    console.warn('😬 401 detected. Attempting refresh...')

    const refreshRes = await fetch('http://localhost:3000/api/auth/RefreshToken', {
      method: 'POST',
      credentials: 'include',
    })

    if (refreshRes.ok) {
      console.log('✨ Refresh successful! Retrying request...')
      return doRequest<T>(method, endpoint, {
        body,
        headers,
        retry: false,
      })
    } else {
      console.error('❌ Refresh failed. You shall not pass.')
      return {
        data: undefined,
        status: res.status,
        ok: false,
        raw: res,
      }
    }
  }

  let data: T | undefined = undefined
  try {
    const text = await res.text()
    data = text ? JSON.parse(text) : undefined
  } catch {
    console.warn('⚠️ Failed to parse JSON response')
  }

  return {
    data,
    status: res.status,
    ok: res.ok,
    raw: res,
  }
}

export const doGet = <T>(endpoint: string, options?: RequestOptions) =>
  doRequest<T>('GET', endpoint, options)

export const doPost = <T>(endpoint: string, options?: RequestOptions) =>
  doRequest<T>('POST', endpoint, options)

export const doPut = <T>(endpoint: string, options?: RequestOptions) =>
  doRequest<T>('PUT', endpoint, options)

export const doPatch = <T>(endpoint: string, options?: RequestOptions) =>
  doRequest<T>('PATCH', endpoint, options)

export const doDelete = <T>(endpoint: string, options?: RequestOptions) =>
  doRequest<T>('DELETE', endpoint, options)

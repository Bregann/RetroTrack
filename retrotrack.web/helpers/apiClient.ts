let API_BASE_URL = 'https://fm.bregan.me'

if (process.env.NODE_ENV === 'development') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
  API_BASE_URL = 'http://localhost:3000'
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
//TODO: comment it properly
export interface FetchResponse<T> {
  data?: T
  status: number
  ok: boolean
  statusMessage?: string
}

interface RequestOptions {
  headers?: HeadersInit
  body?: unknown
  retry?: boolean,
  next?: { revalidate?: number; }
  cookieHeader?: string
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
    cookieHeader, // for passing cookies manually - needed for server-side requests
  } = options

  const MAX_RETRIES = 3
  let attempt = 0

  while (attempt < MAX_RETRIES) {
    try {
      console.log(`🔗 ${method} ${API_BASE_URL}${endpoint} (attempt ${attempt + 1})`)

      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(cookieHeader !== undefined ? { Cookie: cookieHeader } : {}),
          ...headers,
        },
        body: body !== undefined ? JSON.stringify(body) : undefined,
        ...(nextFetchOptions !== undefined && { next: nextFetchOptions }),
      })

      // 🛑 Unauthorized? Time to refresh & retry ONCE
      if (res.status === 401 && retry) {
        console.warn('401 detected. Attempting refresh...')

        const refreshRes = await fetch(`${API_BASE_URL}/api/auth/RefreshToken`, {
          method: 'POST',
          credentials: 'include',
        })

        if (refreshRes.ok) {
          console.log('Refresh successful! Retrying request...')
          return doRequest<T>(method, endpoint, {
            body,
            headers,
            retry: false,
          })
        } else {
          console.error('Refresh failed. You shall not pass.')
          return {
            data: undefined,
            status: res.status,
            ok: false,
          }
        }
      }

      let data: T | undefined = undefined
      let statusMessage: string | undefined = undefined

      // if response is not 200, get the status message
      if (res.status !== 200) {
        const text = await res.text()
        statusMessage = text
      } else {
        try {
          const text = await res.text()
          if (text !== '') {
            const parsed = JSON.parse(text)
            data = parsed
          }
        } catch {
          console.warn('⚠️ Failed to parse JSON response')
        }
      }

      return {
        data,
        status: res.status,
        ok: res.ok,
        statusMessage: statusMessage
      }
    } catch (error) {
      console.error(`Error in doRequest (attempt ${attempt + 1}):`, error)
      attempt++
      if (attempt >= MAX_RETRIES) {
        return {
          data: undefined,
          status: 500,
          ok: false,
        }
      }
    }
  }
  // Should not reach here, but just in case
  return {
    data: undefined,
    status: 500,
    ok: false,
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

// react query fetching
export async function doQueryGet<T>(endpoint: string, options?: RequestOptions): Promise<T> {
  const res: FetchResponse<T> = await doGet<T>(endpoint, options)

  if (!res.ok) {
    throw new Error(res.statusMessage ?? `Failed to fetch: ${endpoint}`)
  }

  return res.data as T
}

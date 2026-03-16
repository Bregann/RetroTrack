export const API_BASE_URL =
  process.env.NODE_ENV === 'development'
    ? 'https://localhost:7248'
    : 'https://rtapi.bregan.me'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

// In-memory access token — read from the accessToken cookie after login/refresh.
// Sent as Authorization: Bearer on every request (the server reads JWT from this header).
let accessToken: string | null = null

export function getAccessToken(): string | null {
  return accessToken
}

export async function loadAccessTokenFromCookie(): Promise<void> {
  // Prefer reading via Electron's main-process session API — the accessToken
  // cookie is scoped to the API domain (rtapi.bregan.me) and is not visible
  // to document.cookie on a different origin (localhost or app://).
  const token =
    (await (window as Window & {
      electron?: { auth?: { getAccessToken?: (apiBaseUrl: string) => Promise<string | null> } }
    }).electron?.auth?.getAccessToken?.(API_BASE_URL)) ?? null
  if (token !== null) {
    accessToken = token
    return
  }
  // Fallback for same-origin contexts
  const match = document.cookie
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith('accessToken='))
  accessToken = match ? decodeURIComponent(match.slice('accessToken='.length)) : null
}

// Singleton promise to prevent concurrent refresh token calls.
// All 401 retries wait for the same in-flight refresh instead of each firing their own.
let refreshTokenPromise: Promise<boolean> | null = null

function refreshAccessToken(): Promise<boolean> {
  if (refreshTokenPromise !== null) return refreshTokenPromise
  refreshTokenPromise = fetch(`${API_BASE_URL}/api/auth/RefreshToken`, {
    method: 'POST',
    credentials: 'include',
  })
    .then(async (res) => {
      if (res.ok) {
        await loadAccessTokenFromCookie()
        return true
      }
      return false
    })
    .catch(() => false)
    .finally(() => {
      refreshTokenPromise = null
    })
  return refreshTokenPromise
}

export interface FetchResponse<T> {
  data?: T
  status: number
  ok: boolean
  statusMessage?: string
}

interface RequestOptions {
  headers?: HeadersInit
  body?: unknown
  retry?: boolean
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
  } = options

  const MAX_RETRIES = 3
  let attempt = 0

  while (attempt < MAX_RETRIES) {
    try {
      const authHeaders: HeadersInit = accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : {}

      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
          ...headers,
        },
        body: body !== undefined ? JSON.stringify(body) : undefined,
      })

      if (res.status === 401 && retry) {
        const refreshed = await refreshAccessToken()
        if (refreshed) {
          return doRequest<T>(method, endpoint, { body, headers, retry: false })
        } else {
          return { data: undefined, status: res.status, ok: false }
        }
      }

      let data: T | undefined = undefined
      let statusMessage: string | undefined = undefined

      if (res.status !== 200) {
        const text = await res.text()
        statusMessage = text
      } else {
        try {
          const text = await res.text()
          if (text !== '') {
            data = JSON.parse(text)
          }
        } catch {
          console.warn('Failed to parse JSON response')
        }
      }

      return { data, status: res.status, ok: res.ok, statusMessage }
    } catch (error) {
      console.error(`Error in doRequest (attempt ${attempt + 1}):`, error)
      attempt++
      if (attempt >= MAX_RETRIES) {
        return { data: undefined, status: 500, ok: false }
      }
    }
  }

  return { data: undefined, status: 500, ok: false }
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

export async function doQueryGet<T>(endpoint: string, options?: RequestOptions): Promise<T> {
  const res: FetchResponse<T> = await doGet<T>(endpoint, options)

  if (!res.ok) {
    throw new Error(res.statusMessage ?? `Failed to fetch: ${endpoint}`)
  }

  return res.data as T
}

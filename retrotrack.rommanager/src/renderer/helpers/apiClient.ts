const API_BASE_URL =
  process.env.NODE_ENV === 'development'
    ? 'https://localhost:7248'
    : 'https://rtapi.bregan.me'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

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
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: body !== undefined ? JSON.stringify(body) : undefined,
      })

      if (res.status === 401 && retry) {
        const refreshRes = await fetch(`${API_BASE_URL}/api/auth/RefreshToken`, {
          method: 'POST',
          credentials: 'include',
        })

        if (refreshRes.ok) {
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

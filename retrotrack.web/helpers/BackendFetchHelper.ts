import { type FetchResponse } from '@/helpers/FetchHelper'

class backendFetchHelper {
  private static async doRequest (url: string, requestOptions: RequestInit): Promise<FetchResponse> {
    const baseUrl: string = (process.env.API_URL ?? '').concat('/api')

    const fetchResponse: FetchResponse = {
      data: undefined,
      errored: false,
      statusCode: 0
    }

    return await fetch(baseUrl + url, requestOptions)
      .then(async response => {
        console.log(response)
        fetchResponse.statusCode = response.status
        return await response.json()
      })
      .then(data => {
        fetchResponse.data = data
        fetchResponse.errored = false
        return fetchResponse
      })
      .catch(err => {
        console.log(err)
        fetchResponse.data = err.message ?? 'Error Thrown'
        fetchResponse.errored = true
        fetchResponse.statusCode = 500
        return fetchResponse
      }
      )
  }

  public static async doGet (url: string, auth?: string | undefined, rtUsername?: string | undefined): Promise<FetchResponse> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ApiSecret: process.env.API_SECRET ?? ''
    }

    if (auth !== undefined) {
      headers.Authorization = auth
      headers.RtUsername = rtUsername ?? '' // This should always not be undefined
    }

    const requestOptions = {
      method: 'GET',
      headers
    }

    return await this.doRequest(url, requestOptions)
  }

  public static async doPost (url: string, body: any, auth?: string | undefined, rtUsername?: string | undefined): Promise<FetchResponse> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ApiSecret: process.env.API_SECRET ?? ''
    }

    if (auth !== undefined) {
      headers.Authorization = auth
      headers.RtUsername = rtUsername ?? '' // This should always not be undefined
    }

    const requestOptions = {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    }

    return await this.doRequest(url, requestOptions)
  }

  public static async doPut (url: string, body: any): Promise<FetchResponse> {
    const requestOptions = {
      method: 'PUT',
      headers:
      {
        'Content-Type': 'application/json',
        ApiSecret: process.env.API_SECRET ?? ''
      },
      body: JSON.stringify(body)
    }

    return await this.doRequest(url, requestOptions)
  }

  public static async doDelete (url: string, auth?: string | undefined, rtUsername?: string | undefined): Promise<FetchResponse> {
    const headers: Record<string, string> =
    {
      ApiSecret: process.env.API_SECRET ?? ''
    }

    if (auth !== undefined) {
      headers.Authorization = auth
      headers.RtUsername = rtUsername ?? '' // This should always not be undefined
    }

    const requestOptions = {
      method: 'DELETE',
      headers
    }

    return await this.doRequest(url, requestOptions)
  }
}

export default backendFetchHelper

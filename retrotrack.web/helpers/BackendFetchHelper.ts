import { type FetchResponse } from '@/helpers/FetchHelper'

class backendFetchHelper {
  private static async doRequest (url: string, requestOptions: RequestInit): Promise<FetchResponse> {
    const baseUrl: string = (process.env.DataServiceUrl ?? '').concat('/api')

    const response: FetchResponse = {
      data: undefined,
      errored: false
    }

    return await fetch(baseUrl + url, requestOptions)
      .then(async response => await response.json())
      .then(data => {
        response.data = data
        response.errored = false
        return response
      })
      .catch(err => {
        response.data = err.message ?? 'Error Thrown'
        response.errored = true
        return response
      }
      )
  }

  public static async doGet (url: string): Promise<FetchResponse> {
    const requestOptions = {
      method: 'GET'
    }

    return await this.doRequest(url, requestOptions)
  }

  public static async doPost (url: string, body: any): Promise<FetchResponse> {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }

    return await this.doRequest(url, requestOptions)
  }

  public static async doPut (url: string, body: any): Promise<FetchResponse> {
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }

    return await this.doRequest(url, requestOptions)
  }

  public static async doDelete (url: string): Promise<FetchResponse> {
    const requestOptions = {
      method: 'DELETE'
    }

    return await this.doRequest(url, requestOptions)
  }
}

export default backendFetchHelper

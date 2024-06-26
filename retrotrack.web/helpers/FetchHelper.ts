export interface FetchResponse {
  data: any
  errored: boolean
  statusCode: number
}

class fetchHelper {
  private static async doRequest (url: string, requestOptions: RequestInit): Promise<FetchResponse> {
    const baseUrl = document.location.origin + '/api'

    const fetchResponse: FetchResponse = {
      data: undefined,
      errored: false,
      statusCode: 0
    }

    return await fetch(baseUrl + url, requestOptions)
      .then(async response => {
        fetchResponse.statusCode = response.status
        return await response.json()
      })
      .then(data => {
        fetchResponse.data = data
        fetchResponse.errored = false
        return fetchResponse
      })
      .catch(err => {
        fetchResponse.data = err.message ?? 'Unknown error thrown'
        fetchResponse.errored = true
        fetchResponse.statusCode = 500
        return fetchResponse
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

  public static async doPostCsvFile (url: string, body: File): Promise<FetchResponse> {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'text/csv' },
      body
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

export default fetchHelper

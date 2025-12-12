import { useMutation, useQueryClient } from '@tanstack/react-query'
import { doDelete, doPatch, doPost, doPut, FetchResponse } from '../apiClient'

interface MutationPostOptions<TOutput> {
  url: string
  queryKey: (string | number)[]
  invalidateQuery: boolean
  apiMethod: 'POST' | 'PATCH' | 'PUT' | 'DELETE'
  onError?: (_error: Error) => void
  onSuccess?: (_data: TOutput | undefined) => void
}

export function useMutationApiData<TInput, TOutput>(options: MutationPostOptions<TOutput>) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: TInput) => {
      let res: FetchResponse<TOutput>

      if (options.apiMethod === 'POST') {
        res = await doPost<TOutput>(options.url, { body: input })
      } else if (options.apiMethod === 'PUT') {
        res = await doPut<TOutput>(options.url, { body: input })
      } else if (options.apiMethod === 'PATCH') {
        res = await doPatch<TOutput>(options.url, { body: input })
      } else if (options.apiMethod === 'DELETE') {
        res = await doDelete<TOutput>(options.url, { body: input })
      } else {
        throw new Error('Invalid API method')
      }

      if (!res.ok) {
        throw new Error(res.statusMessage ?? 'Failed to save')
      }

      return res.data
    },
    onSuccess: (data) => {
      if (options.onSuccess !== undefined) {
        options.onSuccess(data)
      }

      if (options.invalidateQuery) {
        queryClient.invalidateQueries({ queryKey: options.queryKey })
        return
      }

      if (data !== undefined) {
        queryClient.setQueryData(options.queryKey, data)
      }
    },
    onError(error) {
      if (options.onError !== undefined) {
        options.onError(error)
      }
    }
  })
}

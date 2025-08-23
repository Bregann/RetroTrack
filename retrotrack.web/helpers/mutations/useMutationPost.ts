import { useMutation, useQueryClient } from '@tanstack/react-query'
import { doPost, FetchResponse } from '../apiClient'

interface MutationPostOptions<TOutput> {
  url: string
  queryKey: string[]
  invalidateQuery: boolean
  onError?: (error: Error) => void
  onSuccess?: (data: TOutput | undefined) => void
}

export function useMutationPost<TInput, TOutput>(options: MutationPostOptions<TOutput>) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: TInput) => {
      const res: FetchResponse<TOutput> = await doPost<TOutput>(options.url, { body: input })

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

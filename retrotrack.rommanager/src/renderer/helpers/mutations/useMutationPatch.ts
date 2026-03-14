import { useMutation, useQueryClient } from '@tanstack/react-query'
import { doPatch, FetchResponse } from '../apiClient'

interface MutationPatchOptions<TInput, TOutput> {
  url: string | ((_input: TInput) => string)
  queryKey: string[]
  invalidateQuery: boolean
  onError?: (_error: Error) => void
  onSuccess?: (_data: TOutput | undefined) => void
}

export function useMutationPatch<TInput, TOutput>(options: MutationPatchOptions<TInput, TOutput>) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: TInput) => {
      const url = typeof options.url === 'function' ? options.url(input) : options.url
      const res: FetchResponse<TOutput> = await doPatch<TOutput>(url, { body: input })

      if (!res.ok) {
        throw new Error(res.statusMessage ?? 'Failed to update')
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

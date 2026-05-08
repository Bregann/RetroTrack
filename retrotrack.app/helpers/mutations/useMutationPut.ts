import { authApiClient } from '@/helpers/apiClient'
import { useMutation, useQueryClient } from '@tanstack/react-query'

interface MutationPutOptions<TOutput> {
  url: string | ((_input: any) => string)
  queryKey: string[]
  invalidateQuery: boolean
  onError?: (_error: Error) => void
  onSuccess?: (_data: TOutput | undefined) => void
}

export function useMutationPut<TInput, TOutput>(options: MutationPutOptions<TOutput>) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: TInput) => {
      const url = typeof options.url === 'function' ? options.url(input) : options.url
      const res = await authApiClient.put<TOutput>(url, input)

      if (res.status >= 400) {
        throw new Error('Failed to update'.concat(res.statusText))
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

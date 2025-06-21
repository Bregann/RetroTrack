import { doGet } from '@/helpers/apiClient'
import { GetPublicSpecificGameInfoResponse } from '@/interfaces/api/games/GetPublicSpecificGameInfoResponse'
import { useQuery, UseQueryResult } from '@tanstack/react-query'

export const usePublicGetGameInfoQuery = (gameId: number): UseQueryResult<GetPublicSpecificGameInfoResponse, Error> => {
  return useQuery({
    queryKey: ['getPublicSpecificGameInfo', gameId],
    refetchOnMount: true,
    queryFn: async () => {
      const response = await doGet<GetPublicSpecificGameInfoResponse>(`/api/games/getPublicSpecificGameInfo/${gameId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch game info')
      }

      if (response.data === null || response.data === undefined) {
        throw new Error('No data returned from API')
      }

      return response.data
    }
  })
}

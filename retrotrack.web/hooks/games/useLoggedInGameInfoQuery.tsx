import { doGet } from '@/helpers/apiClient'
import { GetLoggedInSpecificGameInfoResponse } from '@/interfaces/api/games/GetLoggedInSpecificGameInfoResponse'
import { useQuery, UseQueryResult } from '@tanstack/react-query'

export const useLoggedInGameInfoQuery = (gameId: number): UseQueryResult<GetLoggedInSpecificGameInfoResponse, Error> => {
  return useQuery({
    queryKey: ['getGameInfoForUser', gameId],
    refetchOnMount: true,
    queryFn: async () => {
      const response = await doGet<GetLoggedInSpecificGameInfoResponse>(`/api/games/GetGameInfoForUser/${gameId}`)
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

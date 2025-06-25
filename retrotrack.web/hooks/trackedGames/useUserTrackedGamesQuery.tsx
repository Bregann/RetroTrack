import { doGet } from '@/helpers/apiClient'
import { GetUserTrackedGamesResponse } from '@/interfaces/api/trackedGames/GetUserTrackedGamesResponse'
import { useQuery, UseQueryResult } from '@tanstack/react-query'

export const useUserTrackedGamesQuery = (query: string, initialData?: GetUserTrackedGamesResponse): UseQueryResult<GetUserTrackedGamesResponse, Error> => {
  return useQuery({
    queryKey: [query],
    initialData,
    refetchOnMount: true,
    queryFn: async () => {
      const response = await doGet<GetUserTrackedGamesResponse>('/api/trackedgames/GetTrackedGamesForUser?'.concat(query))
      if (!response.ok) {
        throw new Error('Failed to fetch games')
      }

      if (response.data === null || response.data === undefined) {
        throw new Error('No data returned from API')
      }

      return response.data
    }
  })
}

import { doGet } from '@/helpers/apiClient'
import { GetGamesForConsoleResponse } from '@/interfaces/apii/gamess/GetGamesForConsoleResponse'
import { useQuery, UseQueryResult } from '@tanstack/react-query'

export const usePublicPaginatedTableQuery = (query: string, initialData?: GetGamesForConsoleResponse): UseQueryResult<GetGamesForConsoleResponse, Error> => {
  return useQuery({
    queryKey: [query],
    initialData,
    refetchOnMount: true,
    queryFn: async () => {
      const response = await doGet<GetGamesForConsoleResponse>('/api/games/getGamesForConsole?'.concat(query))
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

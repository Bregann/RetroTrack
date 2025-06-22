import { doGet } from '@/helpers/apiClient'
import { GetUserProgressForConsoleResponse } from '@/interfaces/api/games/GetUserProgressForConsoleResponse'
import { useQuery, UseQueryResult } from '@tanstack/react-query'

export const useLoggedInPaginatedTableQuery = (query: string, initialData?: GetUserProgressForConsoleResponse): UseQueryResult<GetUserProgressForConsoleResponse, Error> => {
  return useQuery({
    queryKey: [query],
    initialData,
    refetchOnMount: true,
    queryFn: async () => {
      const response = await doGet<GetUserProgressForConsoleResponse>('/api/games/GetUserProgressForConsole?'.concat(query))
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

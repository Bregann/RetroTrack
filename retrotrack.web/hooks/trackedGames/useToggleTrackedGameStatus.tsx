import { doDelete, doPost } from '@/helpers/apiClient'
import notificationHelper from '@/helpers/notificationHelper'
import { GetLoggedInSpecificGameInfoResponse } from '@/interfaces/api/games/GetLoggedInSpecificGameInfoResponse'
import { IconExclamationCircle } from '@tabler/icons-react'
import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'

export type ToggleTrackedGameStatus = {
  gameId: number
  newStatus: boolean
}

export const useToggleTrackedGameStatus = ():
  UseMutationResult<void, Error, ToggleTrackedGameStatus> => {
  const queryClient = useQueryClient()

  return useMutation<void, Error, ToggleTrackedGameStatus>({
    mutationFn: async ({ gameId, newStatus }) => {
      if (newStatus) {
        const res = await doPost(`/api/trackedgames/AddTrackedGame/${gameId}`)
        if (!res.ok) throw new Error('Failed to track game')
      } else {
        const res = await doDelete(`/api/trackedgames/DeleteTrackedGame/${gameId}`)
        if (!res.ok) throw new Error('Failed to untrack game')
      }
    },
    onMutate: async (vars) => {
      const { gameId, newStatus } = vars
      await queryClient.cancelQueries({ queryKey: ['getGameInfoForUser', gameId] })
      const previous = queryClient.getQueryData<GetLoggedInSpecificGameInfoResponse>(['getGameInfoForUser', gameId])
      if (previous === undefined) {
        // Provide a minimal object with required fields for optimistic update
        queryClient.setQueryData<GetLoggedInSpecificGameInfoResponse>(
          ['getGameInfoForUser', gameId],
          {
            gameId,
            title: '',
            consoleId: 0,
            consoleName: '',
            // Add all other required fields with default values
            gameTracked: newStatus,
            // If there are more required fields, add them here
          } as GetLoggedInSpecificGameInfoResponse
        )
      }
      return { previous, gameId }
    },
    onSuccess: (_voidData, { gameId, newStatus }) => {
      // NO refetch—just ensure cache is in sync
      const previous = queryClient.getQueryData<GetLoggedInSpecificGameInfoResponse>(['getGameInfoForUser', gameId])
      if (previous != null) {
        queryClient.setQueryData<GetLoggedInSpecificGameInfoResponse>(
          ['getGameInfoForUser', gameId],
          { ...previous, gameTracked: newStatus }
        )
      }
    },
    onError: (
      _err,
      { gameId },
      context: unknown
    ) => {
      const safeContext = context as { previous?: GetLoggedInSpecificGameInfoResponse; gameId: number } | undefined
      if (safeContext !== undefined && safeContext.previous != null) {
        queryClient.setQueryData(['getGameInfoForUser', gameId], safeContext.previous)
      }
      notificationHelper.showErrorNotification(
        'Error',
        'Failed to toggle game tracking status',
        3000,
        <IconExclamationCircle size={16} />
      )
    },
  })
}

import { doDelete, doPost } from "@/helpers/apiClient"
import notificationHelper from "@/helpers/notificationHelper"
import { GetLoggedInSpecificGameInfoResponse } from "@/interfaces/api/games/GetLoggedInSpecificGameInfoResponse"
import { IconExclamationCircle } from "@tabler/icons-react"
import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query"

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
      if (previous) {
        queryClient.setQueryData<GetLoggedInSpecificGameInfoResponse>(
          ['getGameInfoForUser', gameId],
          { ...previous, gameTracked: newStatus }
        )
      }
      return { previous, gameId }
    },
    onSuccess: (_voidData, { gameId, newStatus }) => {
      // NO refetch—just ensure cache is in sync
      const previous = queryClient.getQueryData<GetLoggedInSpecificGameInfoResponse>(['getGameInfoForUser', gameId])
      if (previous) {
        queryClient.setQueryData<GetLoggedInSpecificGameInfoResponse>(
          ['getGameInfoForUser', gameId],
          { ...previous, gameTracked: newStatus }
        )
      }
    },
    onError: (_err, { gameId }, context: any) => {
      if (context?.previous) {
        queryClient.setQueryData(['getGameInfoForUser', gameId], context.previous)
      }
      notificationHelper.showErrorNotification(
        "Error",
        "Failed to toggle game tracking status",
        3000,
        <IconExclamationCircle size={16} />
      )
    },
  })
}

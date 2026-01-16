import { Stack, Text, Textarea, Group, Button } from '@mantine/core'
import { IconCheck, IconInfoCircle } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import { doQueryGet } from '@/helpers/apiClient'
import { GetLoggedInSpecificGameInfoResponse } from '@/interfaces/api/games/GetLoggedInSpecificGameInfoResponse'
import { useMutationApiData } from '@/helpers/mutations/useMutationApiData'
import notificationHelper from '@/helpers/notificationHelper'
import { useEffect, useState } from 'react'

interface UserNotesSectionProps {
  gameId: number
}

export function UserNotesSection({ gameId }: UserNotesSectionProps) {
  const [userNotes, setUserNotes] = useState<string | null>(null)

  const { data } = useQuery({
    queryKey: ['getGameInfoForUser', gameId],
    refetchOnMount: true,
    queryFn: async () => await doQueryGet<GetLoggedInSpecificGameInfoResponse>(`/api/games/GetGameInfoForUser/${gameId}`)
  })

  const { mutateAsync: handleSaveNotes } = useMutationApiData<string, null>({
    url: `/api/games/UpdateUserGameNotes/${gameId}`,
    invalidateQuery: true,
    queryKey: ['getGameInfoForUser', gameId],
    apiMethod: 'POST',
    onSuccess: async () => {
      notificationHelper.showSuccessNotification('Success', 'User notes updated.', 3000, <IconCheck size={16} />)
    },
    onError: () => {
      notificationHelper.showErrorNotification('Error', 'Failed to update user notes.', 3000, <IconInfoCircle size={16} />)
    }
  })

  useEffect(() => {
    if (data !== undefined) {
      setUserNotes(data.userNotes ?? null)
    }
  }, [data])

  return (
    <Stack gap="xs">
      <Text fw={500}>Your Notes</Text>
      <Textarea
        placeholder="Write your notes here..."
        minRows={3}
        autosize
        value={userNotes ?? ''}
        onChange={(e) => setUserNotes(e.currentTarget.value)}
      />
      <Group justify="right">
        <Button onClick={async () => { await handleSaveNotes(userNotes ?? '') }}>
          Save Notes
        </Button>
      </Group>
    </Stack>
  )
}

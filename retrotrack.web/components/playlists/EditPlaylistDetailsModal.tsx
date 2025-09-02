import { Modal, TextInput, Textarea, Group, Button, Alert, Text, Checkbox } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useState } from 'react'
import { IconAlertCircle, IconCheck, IconEdit } from '@tabler/icons-react'
import { useMutationApiData } from '@/helpers/mutations/useMutationApiData'
import notificationHelper from '@/helpers/notificationHelper'
import { useQueryClient } from '@tanstack/react-query'

interface EditPlaylistDetailsModalProps {
  opened: boolean
  onClose: () => void
  playlistId: string
  initialName: string
  initialDescription: string
  initialIsPublic: boolean
  queryKey: string
}

interface EditPlaylistFormData {
  playlistId: string
  playlistName: string
  description: string
  isPublic: boolean
}

export default function EditPlaylistDetailsModal({
  opened,
  onClose,
  playlistId,
  initialName,
  initialDescription,
  initialIsPublic,
  queryKey
}: EditPlaylistDetailsModalProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const form = useForm<EditPlaylistFormData>({
    initialValues: {
      playlistId: playlistId,
      playlistName: initialName,
      description: initialDescription,
      isPublic: initialIsPublic
    },
    validate: {
      playlistName: (value) => {
        if (value === null || value === undefined || value.trim().length === 0) {
          return 'Playlist name is required'
        }
        if (value.trim().length < 3) {
          return 'Playlist name must be at least 3 characters long'
        }

        return null
      },
      description: (value) => {
        if (value !== null && value !== undefined && value.trim().length > 500) {
          return 'Description must be less than 500 characters'
        }
        return null
      }
    }
  })

  const editPlaylistMutation = useMutationApiData<EditPlaylistFormData, null>({
    url: '/api/playlists/UpdatePlaylistDetails',
    queryKey: [queryKey],
    invalidateQuery: true,
    apiMethod: 'PUT',
    onSuccess: () => {
      notificationHelper.showSuccessNotification(
        'Success',
        `Playlist "${form.values.playlistName}" updated successfully!`,
        3000,
        <IconCheck />
      )

      queryClient.invalidateQueries({ queryKey: ['getUserPlaylists'] })
      queryClient.invalidateQueries({ queryKey: ['getPublicPlaylists'] })
      // Also invalidate the specific playlist query using the passed queryKey
      queryClient.invalidateQueries({ queryKey: [queryKey] })

      setErrorMessage(null)
      onClose()
    },
    onError: (error) => {
      const errorMsg = error.message !== null && error.message !== undefined && error.message.trim() !== ''
        ? error.message
        : 'Failed to update playlist. Please try again.'
      setErrorMessage(errorMsg)
    }
  })

  const handleSubmit = async (values: EditPlaylistFormData) => {
    setErrorMessage(null)

    const trimmedValues = {
      playlistId: values.playlistId,
      playlistName: values.playlistName.trim(),
      description: values.description.trim(),
      isPublic: values.isPublic
    }

    await editPlaylistMutation.mutateAsync(trimmedValues)
  }

  const handleClose = () => {
    form.setValues({
      playlistId: playlistId,
      playlistName: initialName,
      description: initialDescription,
      isPublic: initialIsPublic
    })
    setErrorMessage(null)
    onClose()
  }

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={
        <Group gap="xs">
          <IconEdit size={20} />
          <Text size="lg" fw={600}>Edit Playlist</Text>
        </Group>
      }
      size="md"
    >
      {errorMessage !== null && errorMessage.trim() !== '' && (
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Error updating playlist"
          color="red"
          mb="md"
        >
          {errorMessage}
        </Alert>
      )}

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Playlist Name"
          placeholder="Enter a name for your playlist"
          withAsterisk
          required
          mb="md"
          {...form.getInputProps('playlistName')}
        />

        <Textarea
          label="Description (Optional)"
          placeholder="Enter a description for your playlist..."
          minRows={3}
          maxRows={6}
          mb="md"
          {...form.getInputProps('description')}
        />

        <Checkbox
          label="Make playlist public"
          description="Public playlists can be viewed and liked by other users"
          mb="lg"
          {...form.getInputProps('isPublic', { type: 'checkbox' })}
        />

        <Group justify="flex-end" gap="sm">
          <Button
            variant="light"
            color="gray"
            onClick={handleClose}
            disabled={editPlaylistMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            leftSection={<IconCheck size={16} />}
            loading={editPlaylistMutation.isPending}
            variant="filled"
            color="blue"
          >
            Save Changes
          </Button>
        </Group>
      </form>
    </Modal>
  )
}

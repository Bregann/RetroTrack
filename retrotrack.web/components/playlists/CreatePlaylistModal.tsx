import { Modal, TextInput, Textarea, Group, Button, Alert, Text, Checkbox } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useState } from 'react'
import { IconAlertCircle, IconCheck, IconPlus } from '@tabler/icons-react'
import { useMutationApiData } from '@/helpers/mutations/useMutationApiData'
import notificationHelper from '@/helpers/notificationHelper'
import { useQueryClient } from '@tanstack/react-query'

interface CreatePlaylistModalProps {
  opened: boolean
  onClose: () => void
}

interface CreatePlaylistFormData {
  playlistName: string
  description: string
  isPublic: boolean
}

export default function CreatePlaylistModal({ opened, onClose }: CreatePlaylistModalProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const form = useForm<CreatePlaylistFormData>({
    initialValues: {
      playlistName: '',
      description: '',
      isPublic: false
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

  const createPlaylistMutation = useMutationApiData<CreatePlaylistFormData, null>({
    url: '/api/playlists/AddNewPlaylist',
    queryKey: ['getUserPlaylists'],
    invalidateQuery: true,
    apiMethod: 'POST',
    onSuccess: () => {
      notificationHelper.showSuccessNotification(
        'Success',
        `Playlist "${form.values.playlistName}" created successfully!`,
        3000,
        <IconCheck />
      )

      queryClient.invalidateQueries({ queryKey: ['getUserPlaylists'] })
      queryClient.invalidateQueries({ queryKey: ['getPublicPlaylists'] })

      form.reset()
      setErrorMessage(null)
      onClose()
    },
    onError: (error) => {
      const errorMsg = error.message !== null && error.message !== undefined && error.message.trim() !== ''
        ? error.message
        : 'Failed to create playlist. Please try again.'
      setErrorMessage(errorMsg)
    }
  })

  const handleSubmit = async (values: CreatePlaylistFormData) => {
    setErrorMessage(null)

    // Trim the values before submitting
    const trimmedValues = {
      playlistName: values.playlistName.trim(),
      description: values.description.trim(),
      isPublic: values.isPublic
    }

    await createPlaylistMutation.mutateAsync(trimmedValues)
  }

  const handleClose = () => {
    form.reset()
    setErrorMessage(null)
    onClose()
  }

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={
        <Group gap="xs">
          <IconPlus size={20} />
          <Text size="lg" fw={600}>Create New Playlist</Text>
        </Group>
      }
      size="md"
    >
      {errorMessage !== null && errorMessage.trim() !== '' && (
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Error creating playlist"
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
            disabled={createPlaylistMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            leftSection={<IconPlus size={16} />}
            loading={createPlaylistMutation.isPending}
            variant="filled"
            color="blue"
          >
            Create Playlist
          </Button>
        </Group>
      </form>
    </Modal>
  )
}

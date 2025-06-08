import { Alert, Button, Group, Modal, PasswordInput, TextInput, Text } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useState } from 'react'
import { IconAlertCircle, IconCheck, IconLock } from '@tabler/icons-react'
import fetchHelper from '@/helpers/FetchHelper'
import { type ResetUserPasswordDto } from '@/pages/api/auth/ResetUserPassword'
import notificationHelper from '@/helpers/NotificationHelper'

interface FormValues {
  username: string
  password: string
  apiKey: string
}

export interface ForgotPasswordModalProps {
  setOpened: (value: boolean) => void
  openedState: boolean
}

const ForgotPasswordModal = (props: ForgotPasswordModalProps): JSX.Element => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false)

  const form = useForm<FormValues>({
    initialValues: {
      username: '',
      password: '',
      apiKey: ''
    }
  })

  const ResetPassword = async (values: FormValues): Promise<void> => {
    setErrorMessage(null)

    const spChars = /[!@#$%^&*()_+\-=\\[\]{};':"\\|,.<>\\/?]+/

    if (values.password.length < 6 || !spChars.test(values.password)) {
      setErrorMessage('Password must be at least 6 characters and a special character!')
      return
    }

    setForgotPasswordLoading(true)
    const res = await fetchHelper.doPost('/auth/ResetUserPassword', values)

    if (res.errored) {
      setErrorMessage('There has been an unexpected error. Please try again shortly')
      setForgotPasswordLoading(false)
      return
    }

    const data: ResetUserPasswordDto = res.data

    // Check if there's any error
    if (!data.success) {
      setErrorMessage(data.reason)
      setForgotPasswordLoading(false)
      return
    }

    notificationHelper.showSuccessNotification('Success', 'Password reset! You may login now', 5000, <IconCheck />)

    setForgotPasswordLoading(false)
    props.setOpened(false)
  }

  return (
    <Modal
      opened={props.openedState}
      onClose={() => { props.setOpened(false) }}
      title="Forgot Password">
      {errorMessage !== null &&
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Error resetting user password"
          color="red"
          style={{ marginTop: 20 }}>
          {errorMessage}
        </Alert>}

      <form onSubmit={form.onSubmit(async (values) => { await ResetPassword(values) })}>
        <TextInput
          label="RetroAchievements Username"
          placeholder="RetroAchievements Username"
          withAsterisk
          required
          {...form.getInputProps('username')}
        />

        <TextInput
          label="RetroAchievements API Key"
          placeholder="RetroAchievements API Key"
          withAsterisk
          required
          style={{ marginTop: 15, marginBottom: 10 }}
          {...form.getInputProps('apiKey')}
        />
        <Text fz="sm">You can find your API at <a href='https://retroachievements.org/controlpanel.php' target='_blank' rel="noreferrer">https://retroachievements.org/controlpanel.php</a>. <br />The key is only used for verifying that username and API key match. <b>Your key is not stored.</b></Text>

        <PasswordInput
          leftSection={<IconLock size={16} />}
          placeholder="Password"
          label="Password"
          description="Password must contain at least 6 characters and 1 special character"
          required
          withAsterisk
          error="Error"
          style={{ marginTop: 15, marginBottom: 10 }}
          {...form.getInputProps('password')}
        />
        <Text fz="sm">This is the password to log in to RetroTrack, <b>not your RetroAchievements password!</b></Text>

        <Group style={{ marginTop: 20 }}>
          <Button
            type="submit"
            variant="gradient"
            gradient={{ from: 'teal', to: 'lime', deg: 105 }}
            loading={forgotPasswordLoading}>
            Reset Password
          </Button>
        </Group>
      </form>
    </Modal>
  )
}

export default ForgotPasswordModal

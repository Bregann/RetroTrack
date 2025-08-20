'use client'

import { Alert, Button, Group, Modal, PasswordInput, TextInput, Text } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useState } from 'react'
import { IconAlertCircle, IconCheck, IconLock } from '@tabler/icons-react'
import { doPost } from '@/helpers/apiClient'
import notificationHelper from '@/helpers/notificationHelper'

interface FormValues {
  username: string
  password: string
  apiKey: string
}

export interface ForgotPasswordModalProps {
  onClose: (value: boolean) => void
  openedState: boolean
}

export default function ForgotPasswordModal(props: ForgotPasswordModalProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false)

  const form = useForm<FormValues>({
    initialValues: {
      username: '',
      password: '',
      apiKey: ''
    }
  })

  const resetPassword = async (values: FormValues): Promise<void> => {
    setErrorMessage(null)

    const spChars = /[!@#$%^&*()_+\-=\\[\]{};':"\\|,.<>\\/?]+/

    if (values.password.length < 6 || !spChars.test(values.password)) {
      setErrorMessage('Password must be at least 6 characters and a special character!')
      return
    }

    setForgotPasswordLoading(true)
    const res = await doPost('/api/auth/ResetUserPassword', { body: values })

    if (res.status === 400) {
      setErrorMessage(res.raw.statusText)
      setForgotPasswordLoading(false)
      return
    }

    notificationHelper.showSuccessNotification('Success', 'Password reset! You may login now', 5000, <IconCheck />)

    setForgotPasswordLoading(false)
    props.onClose(false)
  }

  return (
    <Modal
      opened={props.openedState}
      onClose={() => { props.onClose(false) }}
      title="Forgot Password">
      {errorMessage !== null &&
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Error resetting user password"
          color="red"
          mt="sm">
          {errorMessage}
        </Alert>}

      <form onSubmit={form.onSubmit(async (values) => { await resetPassword(values) })}>
        <TextInput
          label="RetroAchievements Username"
          placeholder="RetroAchievements Username"
          withAsterisk
          required
          mt="xs"
          {...form.getInputProps('username')}
        />

        <TextInput
          label="RetroAchievements API Key"
          placeholder="RetroAchievements API Key"
          withAsterisk
          required
          my="xs"
          {...form.getInputProps('apiKey')}
        />
        <Text fz="sm">You can find your RetroAchievements API key <a href='https://retroachievements.org/controlpanel.php' target='_blank' rel="noreferrer">here</a>. <br /><b>Your key is not stored.</b> It is only used for verifying that username and API key match, so it's actually you.</Text>

        <PasswordInput
          leftSection={<IconLock size={16} />}
          placeholder="Password"
          label="Password"
          description="Password must contain at least 6 characters and 1 special character"
          required
          withAsterisk
          error="Error"
          my="xs"
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

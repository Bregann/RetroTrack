'use client'

import { Modal, PasswordInput, TextInput, Text, Group, Button, Alert } from '@mantine/core'
import { useState } from 'react'
import { useForm } from '@mantine/form'
import { IconAlertCircle, IconCheck, IconLock } from '@tabler/icons-react'
import { doPost } from '@/helpers/apiClient'
import { useAuth } from '@/context/authContext'
import notificationHelper from '@/helpers/notificationHelper'

interface FormValues {
  username: string
  password: string
  apiKey: string
}

export interface RegisterModalProps {
  onClose: (value: boolean) => void
  openedState: boolean
}

const RegisterModal = (props: RegisterModalProps) => {
  const form = useForm<FormValues>({
    initialValues: {
      username: '',
      password: '',
      apiKey: ''
    }
  })

  const auth = useAuth()

  const RegisterUser = async (values: FormValues): Promise<void> => {
    setErrorMessage(null)

    const spChars = /[!@#$%^&*()_+\-=\\[\]{};':"\\|,.<>\\/?]+/

    if (values.password.length < 6 || !spChars.test(values.password)) {
      setErrorMessage('Password must be at least 6 characters and contain a special character!')
      return
    }

    setRegisterButtonLoading(true)
    const res = await doPost('/auth/RegisterUser', { body: values })

    // Check if there's any error
    if (res.status === 400) {
      setErrorMessage(res.raw.statusText || 'An error occurred while registering. Please try again later.')
      setRegisterButtonLoading(false)
    }
    else if (res.status !== 200){
      setErrorMessage('An error occurred while registering. Please try again later.')
      setRegisterButtonLoading(false)
      return
    }
    else {
      // Send the sign in request
      const res = await auth.login(values.username, values.password)

      if (res) {
        // Close the menu
        setRegisterButtonLoading(false)
        props.onClose(false)
        notificationHelper.showSuccessNotification('Success', 'Account created and successfully logged in!', 5000, <IconCheck />)
      } else {
        setRegisterButtonLoading(false)
        props.onClose(false)

        notificationHelper.showSuccessNotification('Success', 'Account created! You can now login', 5000, <IconCheck />)
      }
    }
  }

  const [registerButtonLoading, setRegisterButtonLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  return (
    <Modal
      opened={props.openedState}
      onClose={() => { props.onClose(false) }}
      title="Register">
      {errorMessage !== null &&
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Error registering user"
          color="red"
          style={{ marginTop: 20 }}>
          {errorMessage}
        </Alert>}

      <form onSubmit={form.onSubmit(async (values) => { await RegisterUser(values) })}>
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
          placeholder="Password"
          label="Password"
          description="Password must contain at least 6 characters and 1 special character"
          required
          withAsterisk
          error="Error"
          leftSection={<IconLock size={16} />}
          style={{ marginTop: 15, marginBottom: 10 }}
          {...form.getInputProps('password')}
        />
        <Text fz="sm">This is the password to log in to RetroTrack, <b>not your RetroAchievements password!</b></Text>

        <Group style={{ marginTop: 20 }}>
          <Button
            type="submit"
            variant="gradient"
            gradient={{ from: 'teal', to: 'lime', deg: 105 }}
            loading={registerButtonLoading}>
            Register
          </Button>
        </Group>
      </form>
    </Modal>
  )
}

export default RegisterModal

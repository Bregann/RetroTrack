import { Modal, Anchor, TextInput, PasswordInput, Group, Button, Alert } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useState } from 'react'
import { IconAlertCircle, IconCheck } from '@tabler/icons-react'
import { useAuth } from '@/context/authContext'
import ForgotPasswordModal from './ForgotPassword'
import notificationHelper from '@/helpers/notificationHelper'

interface LoginModalProps {
  onClose: (value: boolean) => void
  openedState: boolean
}

interface FormValues {
  username: string
  password: string
}

export default function LoginModal(props: LoginModalProps) {
  const [forgotPasswordOpened, setForgotPasswordOpened] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [loginButtonLoading, setLoginButtonLoading] = useState(false)
  const form = useForm<FormValues>({
    initialValues: {
      username: '',
      password: ''
    }
  })

  const auth = useAuth()

  const SendLoginRequest = async (values: FormValues): Promise<void> => {
    setLoginButtonLoading(true)

    // Send the sign in request
    const res = await auth.login(values.username, values.password)

    if (res) {
      // Close the menu
      props.onClose(false)
      setLoginButtonLoading(false)

      notificationHelper.showSuccessNotification('Success', 'Successfully logged in!', 3000, <IconCheck />)
    } else {
      setErrorMessage('Invalid username or password. Please try again.')
      setLoginButtonLoading(false)
    }
  }

  return (
    <>
      <Modal
        opened={props.openedState}
        onClose={() => { props.onClose(false) }}
        title="Login">
        {errorMessage !== null &&
          <Alert
            icon={<IconAlertCircle size={16} />}
            title="Error logging in"
            color="red"
            style={{ marginTop: 20 }}>
            {errorMessage}
          </Alert>}

        <form onSubmit={form.onSubmit(async (values) => { await SendLoginRequest(values) })}>
          <TextInput
            label="Username"
            placeholder="Username"
            withAsterisk
            required
            {...form.getInputProps('username')}
          />

          <PasswordInput
            placeholder="Password"
            label="Password"
            required
            withAsterisk
            style={{ marginTop: 15 }}
            {...form.getInputProps('password')}
          />

          <Anchor onClick={() => { setForgotPasswordOpened(true) }}>Forgot password?</Anchor>
          <Group style={{ marginTop: 20 }}>
            <Button
              type="submit"
              variant="gradient"
              gradient={{ from: 'indigo', to: 'cyan' }}
              loading={loginButtonLoading}>
              Login
            </Button>
          </Group>

        </form>
      </Modal>

      <ForgotPasswordModal openedState={forgotPasswordOpened} onClose={setForgotPasswordOpened} />
    </>
  )
}

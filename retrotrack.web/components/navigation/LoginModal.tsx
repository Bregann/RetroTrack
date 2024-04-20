import { Modal, Anchor, TextInput, PasswordInput, Group, Button, Alert } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useState } from 'react'
import notificationHelper from '@/helpers/NotificationHelper'
import { IconAlertCircle, IconCheck } from '@tabler/icons-react'
import sessionHelper from '@/helpers/SessionHelper'
import ForgotPasswordModal from './ForgotPassword'

interface LoginModalProps {
  setOpened: (value: boolean) => void
  openedState: boolean
  onSuccessfulLogin: () => void
}

interface FormValues {
  username: string
  password: string
}

const LoginModal = (props: LoginModalProps): JSX.Element => {
  const [forgotPasswordOpened, setForgotPasswordOpened] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [loginButtonLoading, setLoginButtonLoading] = useState(false)
  const form = useForm<FormValues>({
    initialValues: {
      username: '',
      password: ''
    }
  })

  const SendLoginRequest = async (values: FormValues): Promise<void> => {
    setLoginButtonLoading(true)

    // Send the sign in request
    const res = await sessionHelper.attemptLogin(values.username, values.password)

    if (res.success) {
      // Close the menu
      props.setOpened(false)
      setLoginButtonLoading(false)

      notificationHelper.showSuccessNotification('Success', 'Successfully logged in!', 5000, <IconCheck />)
    } else {
      setErrorMessage(res.reason)
      setLoginButtonLoading(false)
    }
  }

  return (
    <>
      <Modal
        opened={props.openedState}
        onClose={() => { props.setOpened(false) }}
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

      <ForgotPasswordModal openedState={forgotPasswordOpened} setOpened={setForgotPasswordOpened} />
    </>
  )
}

export default LoginModal

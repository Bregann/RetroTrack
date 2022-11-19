import { Modal, Anchor , TextInput, PasswordInput, Group, Button, Alert } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { ModalProps } from "../../types/App/modal";
import ForgotPasswordModal from "../ForgotPasswordModal";
import { IconAlertCircle } from '@tabler/icons';

interface FormValues {
    username: string;
    password: string;
}

const LoginModal = (props: ModalProps) => {
    const [forgotPasswordOpened, setforgotPasswordOpened] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const form = useForm<FormValues>({
        initialValues: {
            username: '',
            password: ''
        }
    });

    const SendLoginRequest = (values: FormValues) => {
        console.log('logged in');
        setErrorMessage('Invalid username/password');
    }

    return (
        <>
        <Modal
            opened={props.openedState}
            onClose={() => props.setOpened(false)}
            title="Login">
                {errorMessage && 
                <Alert 
                    icon={<IconAlertCircle size={16} />} 
                    title="Error logging in" 
                    color="red" 
                    sx={{marginTop: 20}}>
                        { errorMessage }
                </Alert>}

                <form onSubmit={form.onSubmit((values) => SendLoginRequest(values))}>
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
                        sx={{marginTop: 15}}
                        {...form.getInputProps('password')}
                    />

                    <Anchor onClick={() => setforgotPasswordOpened(true)}>Forgot password?</Anchor>
                    <Group position="right" sx={{marginTop: 20}}>
                        <Button 
                            type="submit"
                            variant="gradient" 
                            gradient={{ from: 'indigo', to: 'cyan' }}>
                                Login
                        </Button>
                    </Group>

                    
                </form>
        </Modal>

        <ForgotPasswordModal openedState={forgotPasswordOpened} setOpened={setforgotPasswordOpened}/> 
        </>
     );
}
 
export default LoginModal;
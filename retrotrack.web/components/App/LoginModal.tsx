import { Modal, Anchor , TextInput, PasswordInput, Group, Button, Alert } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { ModalProps } from "../../types/App/modal";
import ForgotPasswordModal from "../ForgotPasswordModal";
import { IconAlertCircle } from '@tabler/icons';
import { DoPost } from "../../Helpers/webFetchHelper";
import { signIn } from "next-auth/react";
import { toast } from "react-toastify";

interface FormValues {
    username: string;
    password: string;
}

const LoginModal = (props: ModalProps) => {
    const [forgotPasswordOpened, setforgotPasswordOpened] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [loginButtonLoading, setLoginButtonLoading] = useState(false);
    const form = useForm<FormValues>({
        initialValues: {
            username: '',
            password: ''
        }
    });

    const SendLoginRequest = async (values: FormValues) => {
        setLoginButtonLoading(true);
        
        //Send the signin request
        const res = await signIn('credentials', {
            username: values.username,
            password: values.password,
            redirect: false
        });

        if(res?.ok){
            //Close the menu
            setLoginButtonLoading(false);
            toast.success('Successfully logged in!', {
                position: 'bottom-right',
                closeOnClick: true,
                theme: 'colored'
            });
            
        }
        else if(res?.status === 401){
            setErrorMessage('Invalid username/password');
            setLoginButtonLoading(false);
        }
        else{
            setErrorMessage('An unknown error has occurred. Please try again');
            setLoginButtonLoading(false);
        }
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

                <form onSubmit={form.onSubmit(async (values) => await SendLoginRequest(values))}>
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
                            gradient={{ from: 'indigo', to: 'cyan' }}
                            loading={loginButtonLoading}>
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
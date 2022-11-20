import { Modal, PasswordInput, TextInput, Text, Group, Button, Alert } from "@mantine/core";
import { useState } from "react";
import { useForm } from "@mantine/form";
import { ModalProps } from "../../types/App/modal";
import { DoPost } from "../../Helpers/webFetchHelper";
import { IconAlertCircle } from '@tabler/icons';
import { RegiserUserData } from "../../types/Api/Auth/RegisterUser";
import { signIn } from "next-auth/react";
import { toast } from "react-toastify";

interface FormValues {
    username: string;
    password: string;
    apiKey: string;
}

const RegisterModal = (props: ModalProps) => {
    const form = useForm<FormValues>({
        initialValues: {
            username: '',
            password: '',
            apiKey: ''
        }
    });

    const RegisterUser = async (values: FormValues) => {
        setRegisterButtonLoading(true);
        const res = await DoPost('/api/auth/RegisterUser', values);

        if(!res.ok){
            setErrorMessage('There has been an unexpected error. Please try again shortly');
            setRegisterButtonLoading(false);
            return;
        }

        const data: RegiserUserData = await res.json();

        console.log(data);

        //Check if there's any error
        if(data.reason){
            setErrorMessage(data.reason);
            setRegisterButtonLoading(false);
            return;
        }

        //If the registration was successful then login the user
        if(data.success && !data.reason){
            //Send the signin request
            const res = await signIn('credentials', {
                username: values.username,
                password: values.password,
                redirect: false
            });

            if(res?.ok){
                //Close the menu
                setRegisterButtonLoading(false);
                props.setOpened(false);

                toast.success('Account created and successfully logged in!', {
                    position: 'bottom-right',
                    closeOnClick: true,
                    theme: 'colored'
                });
            }
            else{
                setRegisterButtonLoading(false);
                props.setOpened(false);

                toast.success('Account created! You can now login', {
                    position: 'bottom-right',
                    closeOnClick: true,
                    theme: 'colored'
                });
            }
        }

        setRegisterButtonLoading(false);
    }

    const [registerButtonLoading, setRegisterButtonLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    return ( 
        <Modal
        opened={props.openedState}
        onClose={() => props.setOpened(false)}
        title="Register">
            {errorMessage && 
            <Alert 
                icon={<IconAlertCircle size={16} />} 
                title="Error registering user" 
                color="red" 
                sx={{marginTop: 20}}>
                    { errorMessage }
            </Alert>}

            <form onSubmit={form.onSubmit((values) => RegisterUser(values))}>
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
                    sx={{marginTop: 15, marginBottom: 10}}
                    {...form.getInputProps('apiKey')}
                />
                <Text fz="sm">You can find your API at <a href='https://retroachievements.org/controlpanel.php' target='_blank' rel="noreferrer">https://retroachievements.org/controlpanel.php</a>. <br />The key is only used for verifying that username and API key match. <b>Your key is not stored.</b></Text>

                <PasswordInput
                    placeholder="Password"
                    label="Password"
                    required
                    withAsterisk
                    sx={{marginTop: 15, marginBottom: 10}}
                    {...form.getInputProps('password')}
                />
                <Text fz="sm">This is the password to log in to RetroTrack, <b>not your RetroAchievements password!</b></Text>

                <Group position="right" sx={{marginTop: 20}}>
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
     );
}
 
export default RegisterModal;
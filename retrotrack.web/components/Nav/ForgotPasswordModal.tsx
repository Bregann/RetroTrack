import { Alert, Button, Group, Modal, PasswordInput, TextInput, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconAlertCircle, IconLock } from "@tabler/icons";
import { useState } from "react";
import { toast } from "react-toastify";
import { DoPost } from "../../Helpers/webFetchHelper";
import RegisterUser from "../../pages/api/auth/RegisterUser";
import { ForgotPasswordData } from "../../types/Api/Auth/ForgotPassword";
import { ModalProps } from "../../types/App/modal";

interface FormValues {
    username: string;
    password: string;
    apiKey: string;
}

const ForgotPasswordModal = (props: ModalProps) => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);

    const form = useForm<FormValues>({
        initialValues: {
            username: '',
            password: '',
            apiKey: ''
        }
    });

    const ResetPassword = async (values: FormValues) => {
        setErrorMessage(null);

        let spChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

        if (values.password.length < 6 || !spChars.test(values.password)) {
            setErrorMessage("Password must be at least 6 characters and a special character!");
            return;
        }

        setForgotPasswordLoading(true);
        const res = await DoPost('/api/auth/ResetUserPassword', values);

        if (!res.ok) {
            setErrorMessage('There has been an unexpected error. Please try again shortly');
            setForgotPasswordLoading(false);
            return;
        }

        const data: ForgotPasswordData = await res.json();

        console.log(data);

        //Check if there's any error
        if (!data.success) {
            setErrorMessage(data.reason);
            setForgotPasswordLoading(false);
            return;
        }

        toast.success('Password reset! You may login now', {
            position: 'bottom-right',
            closeOnClick: true,
            theme: 'colored'
        });
        
        setForgotPasswordLoading(false);
        props.setOpened(false);
    }
    
    return (
        <Modal
            opened={props.openedState}
            onClose={() => props.setOpened(false)}
            title="Forgot Password">
            {errorMessage &&
                <Alert
                    icon={<IconAlertCircle size={16} />}
                    title="Error resetting user password"
                    color="red"
                    sx={{ marginTop: 20 }}>
                    {errorMessage}
                </Alert>}

            <form onSubmit={form.onSubmit((values) => ResetPassword(values))}>
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
                    sx={{ marginTop: 15, marginBottom: 10 }}
                    {...form.getInputProps('apiKey')}
                />
                <Text fz="sm">You can find your API at <a href='https://retroachievements.org/controlpanel.php' target='_blank' rel="noreferrer">https://retroachievements.org/controlpanel.php</a>. <br />The key is only used for verifying that username and API key match. <b>Your key is not stored.</b></Text>

                <PasswordInput
                    placeholder="Password"
                    label="Password"
                    description="Password must contain at least 6 characters and 1 special character"
                    required
                    withAsterisk
                    error="ggggggg"
                    icon={<IconLock size={16} />}
                    sx={{ marginTop: 15, marginBottom: 10 }}
                    {...form.getInputProps('password')}
                />
                <Text fz="sm">This is the password to log in to RetroTrack, <b>not your RetroAchievements password!</b></Text>

                <Group position="right" sx={{ marginTop: 20 }}>
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
    );
}

export default ForgotPasswordModal;
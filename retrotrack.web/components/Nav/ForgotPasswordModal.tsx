import { Modal } from "@mantine/core";
import { ModalProps } from "../../types/App/modal";

const ForgotPasswordModal = (props: ModalProps) => {
    return ( 
        <Modal
        opened={props.openedState}
        onClose={() => props.setOpened(false)}
        title="Forgot Password">
            Under construction - please check support for help on password resets
        </Modal>
     );
}
 
export default ForgotPasswordModal;
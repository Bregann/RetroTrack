import { Modal } from "@mantine/core";
import { ModalProps } from "../types/App/modal";

const ForgotPasswordModal = (props: ModalProps) => {
    return ( 
        <Modal
        opened={props.openedState}
        onClose={() => props.setOpened(false)}
        title="Forgot Password">

        </Modal>
     );
}
 
export default ForgotPasswordModal;
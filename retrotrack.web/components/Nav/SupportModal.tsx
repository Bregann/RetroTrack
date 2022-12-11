import { Modal, Text } from "@mantine/core";
import { ModalProps } from "../../types/App/modal";

const SupportModal = (props: ModalProps) => {
    return ( 
        <Modal
        opened={props.openedState}
        onClose={() => props.setOpened(false)}
        title="Support">
            <Text>If you need any support or have noticed any issues you can raise an issue with the below contact details:</Text>
            <br />
            <Text>Discord: Guinea#1337</Text>
            <Text component="a" href="https://github.com/Bregann/RetroTrack" target="_blank">GitHub</Text>
        </Modal>
     );
}
 
export default SupportModal;
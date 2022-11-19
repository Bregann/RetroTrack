import { Modal } from "@mantine/core";
import { useState } from "react";

const RegisterModal = () => {
    const [opened, setOpened] = useState(false);

    return ( 
        <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Register">
        </Modal>
     );
}
 
export default RegisterModal;
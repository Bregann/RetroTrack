import { Modal, Text } from '@mantine/core'

interface RegisterModalProps {
  setOpened: (value: boolean) => void
  openedState: boolean
}

const SupportModal = (props: RegisterModalProps): JSX.Element => {
  return (
        <Modal
        opened={props.openedState}
        onClose={() => { props.setOpened(false) }}
        title="Support">
            <Text>If you need any support or have noticed any issues you can raise an issue with the below contact details:</Text>
            <br />
            <Text>Discord: guinea.</Text>
            <Text component="a" href="https://github.com/Bregann/RetroTrack" target="_blank">GitHub</Text>
        </Modal>
  )
}

export default SupportModal

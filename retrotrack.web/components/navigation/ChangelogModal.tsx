import { List, Modal, Text } from '@mantine/core'

interface ChangelogModalProps {
  setOpened: (value: boolean) => void
  openedState: boolean
}

const ChangelogModal = (props: ChangelogModalProps): JSX.Element => {
  return (
    <Modal
      opened={props.openedState}
      onClose={() => { props.setOpened(false) }}
      title="Changelog">
      <Text>Release 1.0 (27th April 2024)</Text>
      <List>
        <List.Item>Complete rewrite & upgrade of the website frontend</List.Item>
        <List.Item>Added this changelog modal :D</List.Item>
        <List.Item>Various bug fixes/polish</List.Item>
      </List>
    </Modal>
  )
}

export default ChangelogModal

import { Button, Modal } from '@mantine/core'
import classes from '../../styles/Shared/YesNoModal.module.css'
interface YesNoModalProps {
  displayModal: boolean
  text: string
  onHideModal: (value: boolean) => void
  onYesClicked: () => void
}

const YesNoModal = (props: YesNoModalProps): JSX.Element => {
  return (
    <>
      <Modal opened={props.displayModal} onClose={() => { props.onHideModal(false) }} closeOnClickOutside={false}>
        <Modal.Header>
          <h3 className={classes.modalHeader}>Are You Sure?</h3>
        </Modal.Header>
          <p className={classes.p}>{props.text}</p>
          <div className={classes.modalButtons}>
          <Button onClick={() => { props.onYesClicked() }} className={classes.yesButton}>Yes</Button>
          <Button onClick={() => { props.onHideModal(false) }} className={classes.noButton}>No</Button>
          </div>

      </Modal>
    </>
  )
}

export default YesNoModal

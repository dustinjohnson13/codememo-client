//@flow
import * as React from 'react'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'

type Props = {
  +open: boolean,
  +confirmAction: () => void,
  +closedCallback: () => void,
  +children?: React.Node,
  +closeOnConfirmation: boolean,
  +title: string,
  +confirmText: string,
  +className?: string
}

class ModalWrapper extends React.Component<Props, void> {
  confirmed = () => {
    this.props.confirmAction()
    if (this.props.closeOnConfirmation) {
      this.toggle()
    }
  }
  toggle = () => {
    this.props.closedCallback()
  }

  render () {
    return (
      <div>
        <Modal isOpen={this.props.open} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>{this.props.title}</ModalHeader>
          <ModalBody>
            {this.props.children}
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.confirmed}>{this.props.confirmText}</Button>{' '}
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    )
  }
}

export default ModalWrapper
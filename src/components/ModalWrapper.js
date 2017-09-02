//@flow
import * as React from 'react'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'

type Props = {
  +confirmAction: () => void,
  +closedCallback: () => void,
  +children?: React.Node,
  +closeOnConfirmation: boolean,
  +toggleText: string,
  +toggleColor: string,
  +title: string,
  +confirmText: string,
  +className?: string
}

type State = {
  modal: boolean
}

class ModalWrapper extends React.Component<Props, State> {
  confirmed = () => {
    this.props.confirmAction()
    if (this.props.closeOnConfirmation) {
      this.toggle()
    }
  }
  toggle = () => {
    const open = !this.state.modal

    this.setState({
      modal: open
    })

    if (!open) {
      this.props.closedCallback()
    }
  }

  constructor (props: Props) {
    super(props)
    this.state = {
      modal: false
    }
  }

  render () {
    return (
      <div>
        <Button color={this.props.toggleColor} onClick={this.toggle}>{this.props.toggleText}</Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
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
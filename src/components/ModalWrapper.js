//@flow
import * as React from 'react'
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap'

type Props = {
    +confirmAction: () => void,
    +closedCallback: () => void,
    +children?: React.Node,
    +closeOnConfirmation: boolean,
    +toggleText: string,
    +title: string,
    +className?: string
}

type State = {
    modal: boolean
}

class ModalWrapper extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            modal: false
        };

        (this: any).confirmed = this.confirmed.bind(this);
        (this: any).toggle = this.toggle.bind(this);
    }

    confirmed() {
        this.props.confirmAction()
        if (this.props.closeOnConfirmation) {
            this.toggle()
        }
    }

    toggle() {
        const open = !this.state.modal

        this.setState({
            modal: open
        })

        if (!open) {
            this.props.closedCallback()
        }
    }

    render() {
        return (
            <div>
                <Button color="primary" onClick={this.toggle}>{this.props.toggleText}</Button>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>{this.props.title}</ModalHeader>
                    <ModalBody>
                        {this.props.children}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.confirmed}>Create</Button>{' '}
                        <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

export default ModalWrapper
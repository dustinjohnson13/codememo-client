import React from 'react';
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';

class ModalWrapper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false
        };

        this.confirmed = this.confirmed.bind(this);
        this.toggle = this.toggle.bind(this);
    }

    confirmed() {
        this.props.confirmAction();
        this.toggle();
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        });
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
                        <Button color="primary" onClick={this.confirmed}>Do Something</Button>{' '}
                        <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default ModalWrapper;
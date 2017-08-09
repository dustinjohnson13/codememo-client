import React from 'react';
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import '../styles/CollectionPage.css';

class AddDeckModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false
        };

        this.deckConfirmed = this.deckConfirmed.bind(this);
        this.toggle = this.toggle.bind(this);
    }

    deckConfirmed() {
        const name = `Deck${new Date().getTime()}`;

        this.props.addDeck(name);

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
                <Button color="primary" onClick={this.toggle}>Create Deck</Button>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>Modal title</ModalHeader>
                    <ModalBody>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                        laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
                        voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
                        non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.deckConfirmed}>Do Something</Button>{' '}
                        <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default AddDeckModal;
import React from 'react'
import {Input, InputGroup} from 'reactstrap'
import ModalWrapper from "./ModalWrapper"

class AddDeckModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {name: ''}

        this.handleChange = this.handleChange.bind(this)
        this.deckConfirmed = this.deckConfirmed.bind(this)
    }

    handleChange(event) {
        this.setState({name: event.target.value})
    }

    deckConfirmed() {
        const name = this.state.name

        this.props.addDeck(name)
    }

    render() {
        return (
            <div>
                <ModalWrapper title="Create Deck" toggleText="Create Deck"
                              closeOnConfirmation={true} confirmAction={this.deckConfirmed}>
                    <InputGroup>
                        <Input placeholder="deck name" value={this.state.name} onChange={this.handleChange}/>
                    </InputGroup>
                </ModalWrapper>
            </div>
        )
    }
}

export default AddDeckModal
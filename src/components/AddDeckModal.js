//@flow
import React from 'react'
import {Input, InputGroup} from 'reactstrap'
import ModalWrapper from "./ModalWrapper"

type Props = {
    +addDeck: (name: string) => void
}

type State = {
    name: string;
}

class AddDeckModal extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {name: ''};

        (this: any).handleChange = this.handleChange.bind(this);
        (this: any).deckConfirmed = this.deckConfirmed.bind(this);
    }

    handleChange(event: SyntheticInputEvent<Input>) {
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
                              closeOnConfirmation={true} confirmAction={this.deckConfirmed}
                              closedCallback={() => {
                              }}>
                    <InputGroup>
                        <Input placeholder="deck name" value={this.state.name} onChange={this.handleChange}/>
                    </InputGroup>
                </ModalWrapper>
            </div>
        )
    }
}

export default AddDeckModal
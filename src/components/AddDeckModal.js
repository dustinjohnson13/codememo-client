//@flow
import React from 'react'
import { Input, InputGroup } from 'reactstrap'
import ModalWrapper from './ModalWrapper'

type Props = {
  +addDeck: (name: string) => void
}

type State = {
  name: string;
}

class AddDeckModal extends React.Component<Props, State> {
  handleChange = (event: SyntheticInputEvent<Input>) => {
    this.setState({name: event.target.value})
  }
  deckConfirmed = () => {
    const name = this.state.name

    this.props.addDeck(name)
  }

  constructor (props: Props) {
    super(props)
    this.state = {name: ''}
  }

  render () {
    return (
      <div>
        <ModalWrapper title="Create Deck" toggleText="Create Deck" confirmText="Create"
                      closeOnConfirmation={true} confirmAction={this.deckConfirmed}
                      toggleColor="primary" closedCallback={() => {
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
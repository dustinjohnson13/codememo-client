//@flow
import React from 'react'
import { Input, InputGroup } from 'reactstrap'
import ModalWrapper from './ModalWrapper'

type Props = {|
  +open: boolean,
  +addDeck: (name: string) => void,
  +toggleModal: () => void
|}

type State = {|
  name: string
|}

class AddDeckModal extends React.Component<Props, State> {
  handleChange = (event: SyntheticInputEvent<Input>) => {
    this.setState({...this.state, name: event.target.value})
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
        <ModalWrapper title="Create Deck" confirmText="Create" open={this.props.open}
                      closeOnConfirmation={true} confirmAction={this.deckConfirmed}
                      closedCallback={this.props.toggleModal}>
          <InputGroup>
            <Input placeholder="deck name" value={this.state.name} onChange={this.handleChange}/>
          </InputGroup>
        </ModalWrapper>
      </div>
    )
  }
}

export default AddDeckModal
//@flow
import React from 'react'
import { Input, InputGroup } from 'reactstrap'
import ModalWrapper from './ModalWrapper'

type Props = {|
  +open: boolean,
  +updateDeck: (name: string) => void,
  +toggleModal: () => void
|}

type State = {|
  name: string
|}

class EditDeckModal extends React.Component<Props, State> {
  handleChange = (event: SyntheticInputEvent<Input>) => {
    this.setState({...this.state, name: event.target.value})
  }
  deckConfirmed = () => {
    const name = this.state.name

    this.props.updateDeck(name)
  }

  constructor (props: Props) {
    super(props)
    this.state = {name: ''}
  }

  render () {
    return (
      <div>
        <ModalWrapper title="Rename Deck" confirmText="Rename" open={this.props.open}
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

export default EditDeckModal
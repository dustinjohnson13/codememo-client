//@flow
import React, { Component } from 'react'
import { Button, Container } from 'reactstrap'
import '../styles/CollectionPage.css'
import AddDeckModal from './AddDeckModal'
import Collection from './Collection'
import { Deck } from '../services/APIDomain'

type Props = {
  +decks: Array<Deck>,
  +deleteDeck: (id: string) => void,
  +reviewDeck: (id: string) => void,
  +addDeck: (name: string) => void,
  +updateDeck: (id: string, name: string) => void
}

type State = {
  modalOpen: boolean
}

class CollectionPage extends Component<Props, State> {

  toggleModal = () => {
    const open = !this.state.modalOpen
    this.setState({modalOpen: open})
  }

  constructor (props: Props) {
    super(props)
    this.state = {modalOpen: false}
  }

  render () {
    return (
      <div>
        <Container>
          <Collection decks={this.props.decks} reviewDeck={this.props.reviewDeck}
                      deleteDeck={this.props.deleteDeck} updateDeck={this.props.updateDeck}/>
        </Container>

        <AddDeckModal open={this.state.modalOpen} addDeck={this.props.addDeck} toggleModal={this.toggleModal}/>
        <Button color="primary" onClick={this.toggleModal}>Create Deck</Button>
      </div>
    )
  }
}

export default CollectionPage

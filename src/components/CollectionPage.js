//@flow
import React, {Component} from 'react'
import {Container} from 'reactstrap'
import '../styles/CollectionPage.css'
import AddDeckModal from "./AddDeckModal"
import Collection from './Collection'
import {Deck} from "../services/APIDomain"

type Props = {
    +decks: Array<Deck>,
    +deleteDeck: (id: string) => void,
    +reviewDeck: (id: string) => void,
    +addDeck: (name: string) => void
}

class CollectionPage extends Component<Props, void> {

    render() {
        return (
            <div>
                <Container>
                    <Collection decks={this.props.decks} reviewDeck={this.props.reviewDeck}
                                deleteDeck={this.props.deleteDeck}/>
                </Container>

                <AddDeckModal addDeck={this.props.addDeck}/>
            </div>
        )
    }
}

export default CollectionPage

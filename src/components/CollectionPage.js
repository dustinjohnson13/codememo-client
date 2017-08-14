//@flow
import React, {Component} from 'react';
import {Container} from 'reactstrap';
import '../styles/CollectionPage.css';
import AddDeckModal from "./AddDeckModal";
import Collection from './Collection'
import {Deck} from "../services/APIDomain";

type Props = {
    decks: Array<Deck>,
    reviewDeck: any,
    addDeck: any
}

class CollectionPage extends Component<void, Props, void> {

    render() {
        return (
            <div>
                <Container>
                    <Collection decks={this.props.decks} reviewDeck={this.props.reviewDeck}/>
                </Container>

                <AddDeckModal addDeck={this.props.addDeck}/>
            </div>
        );
    }
}

export default CollectionPage;

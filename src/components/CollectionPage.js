import React, {Component} from 'react';
import {Container} from 'reactstrap';
import '../styles/CollectionPage.css';
import AddDeckModal from "./AddDeckModal";
import Collection from './Collection'

class CollectionPage extends Component {

    render() {
        return (
            <div>
                <Container>
                    <Collection decks={this.props.decks} fetchDeck={this.props.fetchDeck}/>
                </Container>

                <AddDeckModal addDeck={this.props.addDeck}/>
            </div>
        );
    }
}

export default CollectionPage;

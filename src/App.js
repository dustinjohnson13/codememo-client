import React, {Component} from 'react';
import CollectionPage from './CollectionPage'
import ReviewPage from './ReviewPage'
import * as domain from "./Domain";
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);

        this.clock = new domain.Clock(() => new Date().getTime());
        this.state = {
            collection: new domain.Collection(App.decks(this.clock)),
            page: "CollectionPage",
            deck: null
        };

        this.addNewDeckToStore = this.addNewDeckToStore.bind(this);
        this.collections = this.collections.bind(this);
        this.reviewDeck = this.reviewDeck.bind(this);
    }

    static decks(clock) {
        let decks = [];
        for (let i = 0; i < 6; i++) {
            decks.push(CollectionPage.deck(clock, i));
        }
        return decks;
    }

    addNewDeckToStore(deck) {
        this.state.collection.decks.push(deck);
        this.forceUpdate();
    }

    collections() {
        this.state = {
            ...this.state,
            page: "CollectionPage",
            deck: null
        };
        this.forceUpdate();
    }

    reviewDeck(name) {
        const deck = this.state.collection.decks.find((it) => it.name === name);

        this.state = {
            ...this.state,
            page: "ReviewPage",
            deck: deck
        };
        this.forceUpdate();
    }

    render() {
        let page = "CollectionPage" === this.state.page ?
            <CollectionPage collection={this.state.collection} reviewDeck={this.reviewDeck}
                            addNewDeckToStore={this.addNewDeckToStore} clock={this.clock}/> :
            <ReviewPage deck={this.state.deck} back={this.collections} clock={this.clock}/>;

        return (
            <div className="App">
                <div className="App-header">
                    <h2>Flashcard App</h2>
                </div>

                {page}

            </div>
        );
    }
}

export default App;

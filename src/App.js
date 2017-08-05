import React, {Component} from 'react';
import CollectionPage from './CollectionPage'
import ReviewPage from './ReviewPage'
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            collection: {
                decks: App.decks()
            },
            page: "CollectionPage",
            deck: null
        };

        this.addNewDeckToStore = this.addNewDeckToStore.bind(this);
        this.reviewDeck = this.reviewDeck.bind(this);
    }

    static decks() {
        let decks = [];
        for (let i = 0; i < 6; i++) {
            decks.push(CollectionPage.deck(i));
        }
        return decks;
    }

    addNewDeckToStore(deck) {
        this.state.collection.decks.push(deck);
        this.forceUpdate();
    }

    reviewDeck(name) {
        const deck = this.state.collection.decks.find((it) => it.name === name);

        this.state = {
            page: "ReviewPage",
            deck: deck
        };
        this.forceUpdate();
    }

    render() {
        let page = "CollectionPage" === this.state.page ?
            <CollectionPage collection={this.state.collection} reviewDeck={this.reviewDeck} addNewDeckToStore={this.addNewDeckToStore}/> :
            <ReviewPage deck={this.state.deck}/>;

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

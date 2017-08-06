import * as domain from '../Domain.js'

export default class {

    constructor(clock) {
        this.clock = clock;
        this.collection = {decks: []};
        this.createCollection();
    }

    createDecks() {
        for (let i = 0; i < 6; i++) {
            this.createDeck(`Deck${i}`);
        }
        return this.collection;
    }

    createDeck(name) {
        const cards = [];
        const dueCount = Math.floor(Math.random() * 30) + 1;
        const newCount = Math.floor(Math.random() * 15) + 1;
        const totalCount = dueCount + newCount + (Math.floor(Math.random() * 15) + 1);
        const currentTime = this.clock.epochSeconds();

        for (let i = 0; i < totalCount; i++) {
            let dueTime = null;
            if (i > dueCount) {
                dueTime = currentTime + (10000 * i);
            } else if (i > newCount) {
                dueTime = currentTime - (10000 * i);
            }

            const card = new domain.Card(`Question Number ${i}?`, `Answer Number ${i}`, dueTime);
            cards.push(card);
        }

        const deck = new domain.Deck(name, cards);
        this.collection = {
            ...this.collection,
            decks: [
                ...this.collection.decks,
                deck
            ]
        };

        return this.collection;
    }

    createCollection() {
        return this.createDecks()
    }

    addDeck(name) {
        this.createDeck(name);
        return this.fetchCollection();
    }

    fetchCollection() {
        return new Promise((resolve, reject) => { // fetch(`https://www.reddit.com/r/${subreddit}.json`)
            setTimeout(() => resolve(this.collection), 250);
        });
    }

    fetchDeck(name) {
        return new Promise((resolve, reject) => {
            setTimeout(() => resolve(this.collection.decks.find(it => it.name === name)), 250);
        });
    }

};
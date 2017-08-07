import * as domain from '../Domain.js'

export default class {

    constructor(clock) {
        this.clock = clock;
        this.collectionStore = {decks: []};
        this.idCounter = 1;
        this.timeoutDelay = 250;
        this.createCollectionStore();
    }

    createDecks() {
        for (let i = 0; i < 6; i++) {
            this.createDeck(`Deck${i}`);
        }
        return this.collectionStore;
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

        const deck = new domain.Deck(name, `deck-${this.idCounter++}`, cards);
        this.collectionStore = {
            ...this.collectionStore,
            decks: [
                ...this.collectionStore.decks,
                deck
            ]
        };

        return this.collectionStore;
    }

    createCollectionStore() {
        return this.createDecks()
    }

    addDeck(name) {
        this.createDeck(name);
        return this.fetchCollection();
    }

    fetchCollection() {
        return new Promise((resolve, reject) => { // fetch(`https://www.reddit.com/r/${subreddit}.json`)
            const decks = this.collectionStore.decks.map(it => {
                return {
                    id: it.id,
                    name: it.name,
                    total: it.cards.length,
                    due: it.getDue(this.clock).length,
                    new: it.getNew().length
                }
            });
            const collectionResponse = {decks: decks};

            setTimeout(() => resolve(collectionResponse), this.timeoutDelay);
        });
    }

    fetchDeck(name) {
        return new Promise((resolve, reject) => {
            const deck = this.collectionStore.decks.find(it => it.name === name);
            const cards = deck.cards.map(it => {
                return {
                    id: it.id,
                    due: it.due
                }
            });
            const deckResponse = {id: deck.id, name: deck.name, cards: cards};

            setTimeout(() => resolve(deckResponse), this.timeoutDelay);
        });
    }

};
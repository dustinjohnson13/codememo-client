import * as domain from '../Domain.js'

class FrozenClock implements Clock {
    epochSeconds(): number{
        return 1;
    }
}

// Creates a deck with 27 due cards, 23 new cards, and 80 total cards
export default class {

    constructor(clock) {
        this.clock = clock === undefined ? new FrozenClock() : clock;
        this.collectionStore = {decks: []};
        this.idCounter = 1;
        this.createCollectionStore();
    }

    createDecks() {
        for (let i = 0; i < 6; i++) {
            const idNumber = this.idCounter++;
            this.createDeck(`Deck${idNumber}`, idNumber);
        }
        return this.collectionStore;
    }

    createDeck(name, idNumber) {
        const idNum = idNumber === undefined ? this.idCounter++ : idNumber;

        const cards = [];
        const dueCount = 27;
        const newCount = 23;
        const goodCount = 30;
        const totalCount = dueCount + newCount + goodCount;
        const currentTime = this.clock.epochSeconds();
        const deckId = `deck-${idNum}`;

        for (let i = 0; i < totalCount; i++) {
            let dueTime = null;
            if (i < goodCount) {
                dueTime = currentTime + (10000 * i);
            } else if (i < (goodCount + dueCount)) {
                dueTime = currentTime - (10000 * i);
            }

            const card = new domain.Card(`${deckId}-card-${i}`, `Question Number ${i}?`, `Answer Number ${i}`, dueTime);
            cards.push(card);
        }

        const deck = new domain.Deck(deckId, name, cards);
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
        return Promise.resolve(collectionResponse);
    }

    fetchDeck(name) {
        const currentTime = this.clock.epochSeconds();
        const deck = this.collectionStore.decks.find(it => it.name === name);
        const cards = deck.cards.map(it => {
            const status = it.due === null ? 'NEW' : currentTime > it.due ? 'DUE' : 'OK';
            return {
                id: it.id,
                status: status
            }
        });
        const deckResponse = {id: deck.id, name: deck.name, cards: cards};
        return Promise.resolve(deckResponse);
    }

    fetchCards(ids) {
        const allCards = this.collectionStore.decks.reduce((cards, deck) => {
            return cards.concat(deck.cards);
        }, []);
        const cardsForIds = allCards.filter(card => ids.indexOf(card.id) !== -1);

        const cardJsonArray = cardsForIds.map(card => {
            return {id: card.id, question: card.question, answer: card.answer, due: card.due}
        });
        const cardResponse = {cards: cardJsonArray};
        return Promise.resolve(cardResponse);
    }

    answerCard(id, answer) {
        for (let deck of this.collectionStore.decks) {
            for (let i = 0; i < deck.cards.length; i++) {
                const card = deck.cards[i];
                if (card.id === id) {
                    card.due = this.clock.epochSeconds() + 86400; // 1 day
                    deck.cards.splice(i, 1);
                    deck.cards.push(card);
                    return this.fetchCards([id]).then(cards => cards.cards[0]);
                }
            }
        }

        return Promise.reject(`Unable to find card with id [${id}]`)
    }

};
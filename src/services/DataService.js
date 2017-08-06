import * as domain from '../Domain.js'

export default class {

    constructor(clock) {
        this.clock = clock;
    }

    createDecks(clock) {
        let decks = [];
        for (let i = 0; i < 6; i++) {
            decks.push(this.createDeck(`Deck${i}`));
        }
        return decks;
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

        return new domain.Deck(name, cards);
    }

    getCollection() {
        return new domain.Collection(this.createDecks(this.clock))
    }

};
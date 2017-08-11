//@flow
import * as domain from '../Domain.js'
import type {Clock} from "../Domain";
import Deck from "../components/Deck";
import {
    Card as APICard,
    CardDetail,
    CardDetailResponse,
    CollectionResponse,
    Deck as APIDeck,
    DeckResponse
} from "../services/APIDomain";

class FrozenClock implements Clock {
    epochSeconds(): number {
        return 1;
    }
}

// Creates a deck with 27 due cards, 23 new cards, and 80 total cards
export default class {

    clock: Clock;
    collectionStore: Array<Deck>;
    idCounter: number;

    constructor(clock: Clock | void) {
        this.clock = (clock) ? clock : new FrozenClock();
        this.collectionStore = [];
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

    createDeck(name: string, idNumber: number | null): Promise<CollectionResponse> {
        const idNum = idNumber ? idNumber : this.idCounter++;

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
        this.collectionStore = [
            ...this.collectionStore,
            deck
        ];

        return new CollectionResponse(this.collectionStore);
    }

    createCollectionStore() {
        return this.createDecks()
    }

    addDeck(name: string): Promise<CollectionResponse> {
        this.createDeck(name, null);
        return this.fetchCollection();
    }

    fetchCollection(): Promise<CollectionResponse> {
        const decks = this.collectionStore.map(it => {
            return new APIDeck(it.id, it.name,
                it.cards.length, it.getDue(this.clock).length,
                it.getNew().length
            )
        });
        const collectionResponse = {decks: decks};
        return Promise.resolve(collectionResponse);
    }

    fetchDeck(name: string): Promise<DeckResponse> {
        const currentTime = this.clock.epochSeconds();
        const deck = this.collectionStore.find(it => it.name === name);
        if (deck) {
            const cards = deck.cards.map(it => {
                const status = it.due === null ? 'NEW' : currentTime > it.due ? 'DUE' : 'OK';
                return new APICard(it.id, status)
            });
            const deckResponse = new DeckResponse(deck.id, deck.name, cards);
            return Promise.resolve(deckResponse);
        } else {
            return Promise.reject(`Unable to find deck with name [${name}]`)
        }
    }

    fetchCards(ids: Array<string>): Promise<CardDetailResponse> {
        const idsToInclude = new Set(ids);
        const cardsForIds = [];

        for (let deck of this.collectionStore) {
            for (let card of deck.cards) {
                if (idsToInclude.has(card.id)) {
                    cardsForIds.push(card);
                }
            }
        }

        const cardJsonArray = cardsForIds.map(card => {
            return new CardDetail(card.id, card.question, card.answer, card.due)
        });
        const cardResponse = new CardDetailResponse(cardJsonArray);
        return Promise.resolve(cardResponse);
    }

    answerCard(id: string, answer: string): Promise<CardDetail> {
        for (let deck of this.collectionStore) {
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
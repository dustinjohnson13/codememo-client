//@flow
import * as domain from '../Domain.js'
import * as api from '../services/APIDomain'
import {Card as APICard, CardDetail, CardDetailResponse, CollectionResponse, DeckResponse} from '../services/APIDomain'
import type {Clock} from "../Domain";

class FrozenClock implements Clock {
    epochSeconds(): number {
        return 1;
    }
}

// Creates a deck with 27 due cards, 23 new cards, and 80 total cards
export class FakeDataService {
    clock: Clock;
    collectionStore: domain.Deck[];
    idCounter: number;

    constructor(clock: Clock | void, decks?: Array<domain.Deck>) {
        this.clock = (clock) ? clock : new FrozenClock();
        this.collectionStore = [];
        this.idCounter = 1;

        if (decks) {
            this.collectionStore = decks;
        } else {
            this.createCollectionStore();
        }
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

        if (idNumber) {
            for (let i = 0; i < totalCount; i++) {
                const multiplier = i + 1;
                let dueTime = null;
                if (i < goodCount) {
                    dueTime = currentTime + (86400 * multiplier);
                } else if (i < (goodCount + dueCount)) {
                    dueTime = currentTime - (86400 * multiplier);
                }

                const card = new domain.Card(`${deckId}-card-${i}`, `Question Number ${i}?`, `Answer Number ${i}`, dueTime);
                cards.push(card);
            }
        }

        const deck = new domain.Deck(deckId, name, cards);
        this.collectionStore = [
            ...this.collectionStore,
            deck
        ];

        return this.fetchCollection()
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
            return new api.Deck(it.id, it.name,
                it.cards.length, it.getDue(this.clock).length,
                it.getNew().length
            )
        });
        const collectionResponse = new CollectionResponse(decks);
        return Promise.resolve(collectionResponse);
    }

    fetchDeck(id: string): Promise<DeckResponse> {
        const currentTime = this.clock.epochSeconds();
        const deck = this.collectionStore.find(it => it.id === id);
        if (deck) {
            const cards = deck.cards.map(it => {
                const status = (it.due) ? currentTime > it.due ? 'DUE' : 'OK' : 'NEW';
                return new APICard(it.id, status)
            });
            const deckResponse = new DeckResponse(deck.id, deck.name, cards);
            return Promise.resolve(deckResponse);
        } else {
            return Promise.reject(`Unable to find deck with id [${id}]`)
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

        const cardJsonArray = cardsForIds.map((card: domain.Card) => {
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

    addCard(deckId: string, question: string, answer: string): Promise<CardDetail> {
        for (let deck of this.collectionStore) {
            if (deckId === deck.id) {
                const cardId = `${deckId}-card-${this.idCounter++}`;
                const card = new domain.Card(cardId, question, answer, null);
                const newCards = [...deck.cards, card];
                const newDeck = new domain.Deck(deckId, deck.name, newCards);

                this.collectionStore = [
                    ...this.collectionStore.filter((deck) => deck.id !== deckId),
                    newDeck
                ];

                return Promise.resolve(new CardDetail(cardId, question, answer, null));
            }
        }
        return Promise.reject(`Unable to find deck with id [${deckId}]`)
    }

}
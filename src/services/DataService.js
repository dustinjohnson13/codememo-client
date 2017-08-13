//@flow
import {FakeDataService} from "../fakeData/FakeDataService";
import type {Clock} from "../Domain";
import {CardDetail, CardDetailResponse, CollectionResponse, DeckResponse} from "./APIDomain";

export interface DataService {
    addDeck(name: string): Promise<CollectionResponse>;

    fetchCollection(): Promise<CollectionResponse>;

    fetchDeck(name: string): Promise<DeckResponse>;

    fetchCards(ids: Array<string>): Promise<CardDetailResponse>;

    answerCard(id: string, answer: string): Promise<CardDetail>;

    addCard(deckId: string, question: string, answer: string): Promise<CardDetail>;
}

export class DelegatingDataService implements DataService {

    timeoutDelay: number;
    delegate: DataService;

    constructor(clock: Clock) {
        this.timeoutDelay = 250;
        this.delegate = new FakeDataService(clock);

        (this: any).answerCard = this.answerCard.bind(this);
        (this: any).addDeck = this.addDeck.bind(this);
        (this: any).fetchCollection = this.fetchCollection.bind(this);
        (this: any).fetchDeck = this.fetchDeck.bind(this);
        (this: any).fetchCards = this.fetchCards.bind(this);
        (this: any).answerCard = this.answerCard.bind(this);
    }

    addDeck(name: string): Promise<CollectionResponse> {
        return new Promise((resolve, reject) => {
            setTimeout(() => this.delegate.addDeck(name).then(resolve), this.timeoutDelay);
        });
    }

    fetchCollection(): Promise<CollectionResponse> {
        return new Promise((resolve, reject) => {
            setTimeout(() => this.delegate.fetchCollection().then(resolve), this.timeoutDelay);
        });
    }

    fetchDeck(name: string): Promise<DeckResponse> {
        return new Promise((resolve, reject) => {
            setTimeout(() => this.delegate.fetchDeck(name).then(resolve), this.timeoutDelay);
        });
    }

    fetchCards(ids: Array<string>): Promise<CardDetailResponse> {
        return new Promise((resolve, reject) => {
            setTimeout(() => this.delegate.fetchCards(ids).then(resolve), this.timeoutDelay);
        });
    }

    answerCard(id: string, answer: string): Promise<CardDetail> {
        return new Promise((resolve, reject) => {
            setTimeout(() => this.delegate.answerCard(id, answer).then(resolve), this.timeoutDelay);
        });
    }

    addCard(deckId: string, question: string, answer: string): Promise<CardDetail> {
        return new Promise((resolve, reject) => {
            setTimeout(() => this.delegate.addCard(deckId, question, answer).then(resolve), this.timeoutDelay);
        });
    }
}
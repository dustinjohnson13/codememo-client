//@flow
export interface Clock {
    epochSeconds(): number;
}

export const FAIL = 'FAIL';
export const HARD = 'HARD';
export const GOOD = 'GOOD';
export const EASY = 'EASY';

export class Card {
    id: string;
    status: string; // TODO: Create enum

    constructor(id: string, status: string) {
        this.id = id;
        this.status = status;
    }
}

export class Deck {
    id: string;
    name: string;
    totalCount: number;
    dueCount: number;
    newCount: number;

    constructor(id: string, name: string, totalCount: number, dueCount: number, newCount: number) {
        this.id = id;
        this.name = name;
        this.totalCount = totalCount;
        this.dueCount = dueCount;
        this.newCount = newCount;
    }
}

export class CardDetail {
    id: string;
    question: string;
    answer: string;
    due: ?number;

    constructor(id: string, question: string, answer: string, due: ?number) {
        this.id = id;
        this.question = question;
        this.answer = answer;
        this.due = due;
    }
}

export class CardDetailResponse {
    cards: Array<CardDetail>;

    constructor(cards: Array<CardDetail>) {
        this.cards = cards;
    }
}

export class DeckResponse {
    id: string;
    name: string;
    cards: Array<Card>;

    constructor(id: string, name: string, cards: Array<Card>) {
        this.id = id;
        this.name = name;
        this.cards = cards;
    }
}

export class CollectionResponse {
    decks: Array<Deck>;
    error: ?string;

    constructor(decks: Array<Deck>, error: ?string) {
        this.decks = decks;
        this.error = error;
    }
}

export interface DataService {
    addDeck(name: string): Promise<CollectionResponse>;

    fetchCollection(): Promise<CollectionResponse>;

    fetchDeck(id: string): Promise<DeckResponse>;

    fetchCards(ids: Array<string>): Promise<CardDetailResponse>;

    answerCard(id: string, answer: string): Promise<CardDetail>;

    addCard(deckId: string, question: string, answer: string): Promise<CardDetail>;
}
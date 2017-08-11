//@flow
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
    due: number;

    constructor(id: string, question: string, answer: string, due: number) {
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
    id: string;
    name: string;
    decks: Array<Deck>;
    error: ?string;

    constructor(id: string, name: string, decks: Array<Deck>, error: ?string) {
        this.id = id;
        this.name = name;
        this.decks = decks;
        this.error = error;
    }
}
//@flow
import {Review} from "../persist/Dao"

export interface Clock {
    epochSeconds(): number;
}

export const HALF_DAY_IN_SECONDS = 43200
export const ONE_DAY_IN_SECONDS = HALF_DAY_IN_SECONDS * 2
export const TWO_DAYS_IN_SECONDS = ONE_DAY_IN_SECONDS * 2
export const FOUR_DAYS_IN_SECONDS = TWO_DAYS_IN_SECONDS * 2

export const Answer = {
    FAIL: 'FAIL',
    HARD: 'HARD',
    GOOD: 'GOOD',
    EASY: 'EASY'
}

export type AnswerType = $Keys<typeof Answer>;

export const CardStatus = {
    DUE: 'DUE',
    NEW: 'NEW',
    OK: 'OK'
}

export type CardStatusType = $Keys<typeof CardStatus>;

export class Card {
    +id: string
    +status: CardStatusType // TODO: Create enum

    constructor(id: string, status: CardStatusType) {
        (this: any).id = id;
        (this: any).status = status;
    }
}

export class Deck {
    +id: string
    +name: string
    +totalCount: number
    +dueCount: number
    +newCount: number

    constructor(id: string, name: string, totalCount: number, dueCount: number, newCount: number) {
        (this: any).id = id;
        (this: any).name = name;
        (this: any).totalCount = totalCount;
        (this: any).dueCount = dueCount;
        (this: any).newCount = newCount;
    }
}

export class CardDetail {
    +id: string
    +question: string
    +answer: string
    +failInterval: number
    +hardInterval: number
    +goodInterval: number
    +easyInterval: number
    +due: number

    constructor(id: string, question: string, answer: string,
                failInterval: number, hardInterval: number,
                goodInterval: number, easyInterval: number, due: number) {
        (this: any).id = id;
        (this: any).question = question;
        (this: any).answer = answer;
        (this: any).failInterval = failInterval;
        (this: any).hardInterval = hardInterval;
        (this: any).goodInterval = goodInterval;
        (this: any).easyInterval = easyInterval;
        (this: any).due = due;
    }
}

export class CardDetailResponse {
    +cards: Array<CardDetail>

    constructor(cards: Array<CardDetail>) {
        (this: any).cards = cards
    }
}

export class DeckResponse {
    +id: string
    +name: string
    +cards: Array<Card>

    constructor(id: string, name: string, cards: Array<Card>) {
        (this: any).id = id;
        (this: any).name = name;
        (this: any).cards = cards;
    }
}

export class CollectionResponse {
    +decks: Array<Deck>
    +error: ?string

    constructor(decks: Array<Deck>, error: ?string) {
        (this: any).decks = decks;
        (this: any).error = error;
    }
}

export class ReviewsResponse {
    +reviews: Array<Review>

    constructor(reviews: Array<Review>) {
        (this: any).reviews = reviews;
    }
}

export interface DataService {
    // TODO: This should be userId instead of email
    addDeck(email: string, name: string): Promise<CollectionResponse>;

    init(clearDatabase: boolean): Promise<void>;

    fetchCollection(email: string): Promise<CollectionResponse>;

    fetchDeck(id: string): Promise<DeckResponse>;

    fetchCards(ids: Array<string>): Promise<CardDetailResponse>;

    fetchReviews(cardId: string): Promise<ReviewsResponse>;

    answerCard(id: string, answer: AnswerType): Promise<CardDetail>;

    addCard(deckId: string, question: string, answer: string): Promise<CardDetail>;
}
//@flow
import type { FormatType } from '../persist/Dao'
import { Review } from '../persist/Dao'

export interface Clock {
  epochMilliseconds(): number;
}

export const MILLIS_PER_SECOND = 1000
export const SECONDS_PER_MINUTE = 60
export const MINUTES_PER_HOUR = 60
export const HOURS_PER_DAY = 24

export const MINUTES_PER_DAY = MINUTES_PER_HOUR * HOURS_PER_DAY
export const MINUTES_PER_TWO_DAYS = MINUTES_PER_DAY * 2
export const MINUTES_PER_FOUR_DAYS = MINUTES_PER_TWO_DAYS * 2
export const MINUTES_PER_HALF_DAY = MINUTES_PER_DAY / 2

export const SECONDS_PER_HALF_DAY = MINUTES_PER_HALF_DAY * SECONDS_PER_MINUTE
export const SECONDS_PER_DAY = MINUTES_PER_DAY * SECONDS_PER_MINUTE
export const SECONDS_PER_TWO_DAYS = MINUTES_PER_TWO_DAYS * SECONDS_PER_MINUTE
export const SECONDS_PER_FOUR_DAYS = MINUTES_PER_FOUR_DAYS * SECONDS_PER_MINUTE

export const MILLIS_PER_MINUTE = SECONDS_PER_MINUTE * MILLIS_PER_SECOND
export const MILLIS_PER_HALF_DAY = SECONDS_PER_HALF_DAY * MILLIS_PER_SECOND
export const MILLIS_PER_DAY = SECONDS_PER_DAY * MILLIS_PER_SECOND
export const MILLIS_PER_TWO_DAYS = SECONDS_PER_TWO_DAYS * MILLIS_PER_SECOND
export const MILLIS_PER_FOUR_DAYS = SECONDS_PER_FOUR_DAYS * MILLIS_PER_SECOND

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

  constructor (id: string, status: CardStatusType) {
    (this: any).id = id;
    (this: any).status = status
  }
}

export class Deck {
  +id: string
  +name: string
  +totalCount: number
  +dueCount: number
  +newCount: number

  constructor (id: string, name: string, totalCount: number, dueCount: number, newCount: number) {
    (this: any).id = id;
    (this: any).name = name;
    (this: any).totalCount = totalCount;
    (this: any).dueCount = dueCount;
    (this: any).newCount = newCount
  }
}

export class CardDetail {
  +id: string
  +question: string
  +answer: string
  +format: FormatType
  +failInterval: number
  +hardInterval: number
  +goodInterval: number
  +easyInterval: number
  +due: number

  constructor (id: string, question: string, answer: string, format: FormatType,
               failInterval: number, hardInterval: number,
               goodInterval: number, easyInterval: number, due: number) {
    (this: any).id = id;
    (this: any).question = question;
    (this: any).answer = answer;
    (this: any).format = format;
    (this: any).failInterval = failInterval;
    (this: any).hardInterval = hardInterval;
    (this: any).goodInterval = goodInterval;
    (this: any).easyInterval = easyInterval;
    (this: any).due = due
  }
}

export class CardDetailResponse {
  +cards: Array<CardDetail>

  constructor (cards: Array<CardDetail>) {
    (this: any).cards = cards
  }
}

export class DeckResponse {
  +id: string
  +name: string
  +cards: Array<Card>

  constructor (id: string, name: string, cards: Array<Card>) {
    (this: any).id = id;
    (this: any).name = name;
    (this: any).cards = cards
  }
}

export class CollectionResponse {
  +decks: Array<Deck>
  +error: ?string

  constructor (decks: Array<Deck>, error: ?string) {
    (this: any).decks = decks;
    (this: any).error = error
  }
}

export class ReviewsResponse {
  +reviews: Array<Review>

  constructor (reviews: Array<Review>) {
    (this: any).reviews = reviews
  }
}

export interface DataService {

  currentTimeMillis(): number;

  // TODO: This should be userId instead of email
  addDeck(email: string, name: string): Promise<CollectionResponse>;

  deleteDeck(email: string, id: string): Promise<CollectionResponse>;

  init(clearDatabase: boolean): Promise<void>;

  fetchCollection(email: string): Promise<CollectionResponse>;

  fetchDeck(id: string): Promise<DeckResponse>;

  fetchCards(ids: Array<string>): Promise<CardDetailResponse>;

  fetchReviews(cardId: string): Promise<ReviewsResponse>;

  answerCard(id: string, startTime: number, endTime: number, answer: AnswerType): Promise<CardDetail>;

  addCard(deckId: string, format: FormatType, question: string, answer: string): Promise<CardDetail>;

  deleteCard(email: string, id: string): Promise<DeckResponse>;
}
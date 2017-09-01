//@flow
import type {AnswerType} from "../services/APIDomain"
import {CardDetail, CollectionResponse, Deck, DeckResponse} from "../services/APIDomain"
import type {PageType} from "./pages"
import type {FormatType} from "../persist/Dao"

export const REVIEW_DECK_REQUEST = 'REVIEW_DECK_REQUEST'
export const DELETE_DECK_REQUEST = 'DELETE_DECK_REQUEST'
export const DELETE_CARD_REQUEST = 'DELETE_CARD_REQUEST'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_REQUEST = 'LOGIN_REQUEST'
export const LOAD_COLLECTION_PAGE = 'LOAD_COLLECTION_PAGE'
export const LOAD_PAGE = 'LOAD_PAGE'
export const FETCH_COLLECTION_REQUEST = 'FETCH_COLLECTION_REQUEST'
export const FETCH_COLLECTION_SUCCESS = 'FETCH_COLLECTION_SUCCESS'
export const FETCH_DECK_REQUEST = 'FETCH_DECK_REQUEST'
export const FETCH_DECK_SUCCESS = 'FETCH_DECK_SUCCESS'
export const ANSWER_CARD_REQUEST = 'ANSWER_CARD_REQUEST'
export const ANSWER_CARD_SUCCESS = 'ANSWER_CARD_SUCCESS'
export const ADD_DECK_REQUEST = 'ADD_DECK_REQUEST'
export const ADD_DECK_SUCCESS = 'ADD_DECK_SUCCESS'
export const ADD_CARD_REQUEST = 'ADD_CARD_REQUEST'
export const ADD_CARD_SUCCESS = 'ADD_CARD_SUCCESS'
export const FETCH_CARDS_REQUEST = 'FETCH_CARDS_REQUEST'
export const FETCH_CARDS_SUCCESS = 'FETCH_CARDS_SUCCESS'
export const HIDE_ANSWER = 'HIDE_ANSWER'
export const SHOW_ANSWER = 'SHOW_ANSWER'
export const START_TIMER = 'START_TIMER'

export type ReviewDeckRequestAction = { type: 'REVIEW_DECK_REQUEST', id: string }
export type DeleteDeckRequestAction = { type: 'DELETE_DECK_REQUEST', id: string }
export type DeleteCardRequestAction = { type: 'DELETE_CARD_REQUEST', id: string }
export type LoginRequestAction = { type: 'LOGIN_REQUEST', email: string, password: string }
export type LoginSuccessAction = { type: 'LOGIN_SUCCESS', email: string, password: string }
export type LoadCollectionPageAction = { type: 'LOAD_COLLECTION_PAGE' };
export type LoadPageAction = { type: 'LOAD_PAGE', page: PageType };
export type FetchCollectionRequestAction = { type: 'FETCH_COLLECTION_REQUEST' }
export type FetchCollectionSuccessAction = { type: 'FETCH_COLLECTION_SUCCESS', collection: CollectionResponse }
export type FetchCardsRequestAction = { type: 'FETCH_CARDS_REQUEST', ids: Array<string> }
export type FetchCardsSuccessAction = { type: 'FETCH_CARDS_SUCCESS', cards: Array<CardDetail> }
export type FetchDeckRequestAction = { type: 'FETCH_DECK_REQUEST', id: string }
export type FetchDeckSuccessAction = { type: 'FETCH_DECK_SUCCESS', deck: DeckResponse }
export type HideAnswerAction = { type: 'HIDE_ANSWER' }
export type ShowAnswerAction = { type: 'SHOW_ANSWER' }
export type AnswerCardRequestAction = { type: 'ANSWER_CARD_REQUEST', id: string, deckId: string, answer: AnswerType }
export type AnswerCardSuccessAction = { type: 'ANSWER_CARD_SUCCESS', card: CardDetail, deckId: string }
export type AddCardRequestAction = { type: 'ADD_CARD_REQUEST', id: string, format: FormatType, question: string, answer: string }
export type AddCardSuccessAction = { type: 'ADD_CARD_SUCCESS', card: CardDetail, deckId: string }
export type AddDeckRequestAction = { type: 'ADD_DECK_REQUEST', name: string }
export type AddDeckSuccessAction = { type: 'ADD_DECK_SUCCESS', collection: CollectionResponse }
export type StartTimerAction = { type: 'START_TIMER', time: number }

export type Action =
    ShowAnswerAction
    | StartTimerAction
    | ReviewDeckRequestAction
    | DeleteDeckRequestAction
    | DeleteCardRequestAction
    | LoginSuccessAction
    | LoginRequestAction
    | LoadCollectionPageAction
    | LoadPageAction
    | HideAnswerAction
    | FetchCollectionRequestAction
    | FetchCollectionSuccessAction
    | FetchCardsRequestAction
    | FetchCardsSuccessAction
    | FetchDeckRequestAction
    | FetchDeckSuccessAction
    | AnswerCardRequestAction
    | AnswerCardSuccessAction
    | AddCardRequestAction
    | AddCardSuccessAction
    | AddDeckRequestAction
    | AddDeckSuccessAction


export type AppState = {
    +page: ?PageType;
}

export type CollectionState = {
    +decks: Array<string>,
    +decksById: { [string]: Deck }
}

export type ReviewState = {
    +dueCards: Array<CardDetail>,
    +newCards: Array<CardDetail>,
    +deckName: string,
    +deckId: string,
    +cardId: string,
    +totalCount: number,
    +question: string,
    +answer: string,
    +format: FormatType,
    +failInterval: string,
    +hardInterval: string,
    +goodInterval: string,
    +easyInterval: string,
    +showingAnswer: boolean,
    +startTime: number
}

export type CombinedState = {
    app: AppState,
    collection: CollectionState,
    review: ReviewState
}

export type Dispatch = (action: Action) => void;

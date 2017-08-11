//@flow
import type {PageType} from "./pages";
import {CardDetail, CardDetailResponse, CollectionResponse, DeckResponse} from "../services/APIDomain";

export const LOAD_PAGE = 'LOAD_PAGE';
export const FETCH_COLLECTION_REQUEST = 'FETCH_COLLECTION_REQUEST';
export const FETCH_COLLECTION_SUCCESS = 'FETCH_COLLECTION_SUCCESS';
export const FETCH_DECK_REQUEST = 'FETCH_DECK_REQUEST';
export const FETCH_DECK_SUCCESS = 'FETCH_DECK_SUCCESS';
export const ANSWER_CARD_REQUEST = 'ANSWER_CARD_REQUEST';
export const ANSWER_CARD_SUCCESS = 'ANSWER_CARD_SUCCESS';
export const ADD_DECK_REQUEST = 'ADD_DECK_REQUEST';
export const ADD_DECK_SUCCESS = 'ADD_DECK_SUCCESS';
export const FETCH_CARDS_REQUEST = 'FETCH_CARDS_REQUEST';
export const FETCH_CARDS_SUCCESS = 'FETCH_CARDS_SUCCESS';

export type LoadPageAction = { type: 'LOAD_PAGE', page: PageType };
export type FetchCollectionRequestAction = { type: 'FETCH_COLLECTION_REQUEST' }
export type FetchCollectionSuccessAction = { type: 'FETCH_COLLECTION_SUCCESS', collection: CollectionResponse }
export type FetchCardsRequestAction = { type: 'FETCH_CARDS_REQUEST', ids: Array<string> }
export type FetchCardsSuccessAction = { type: 'FETCH_CARDS_SUCCESS', cards: Array<CardDetail> }
export type FetchDeckRequestAction = { type: 'FETCH_DECK_REQUEST', name: string }
export type FetchDeckSuccessAction = { type: 'FETCH_DECK_SUCCESS', deck: DeckResponse }
export type AnswerCardRequestAction = { type: 'ANSWER_CARD_REQUEST', id: string, answer: string }
export type AnswerCardSuccessAction = { type: 'ANSWER_CARD_SUCCESS', card: CardDetail }
export type AddDeckRequestAction = { type: 'ADD_DECK_REQUEST', name: string }
export type AddDeckSuccessAction = { type: 'ADD_DECK_SUCCESS', collection: CollectionResponse }

export type Action = LoadPageAction
    | FetchCollectionRequestAction
    | FetchCollectionSuccessAction
    | FetchCardsRequestAction
    | FetchCardsSuccessAction
    | FetchDeckRequestAction
    | FetchDeckSuccessAction
    | AnswerCardRequestAction
    | AnswerCardSuccessAction
    | AddDeckRequestAction
    | AddDeckSuccessAction

export type Dispatch = (action: Action | Promise<Action>) => Promise<any>;
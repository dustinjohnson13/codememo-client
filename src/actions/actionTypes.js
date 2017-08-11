import {Page} from "./pages";
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


export type Action = { type: LOAD_PAGE, page: Page }
    | { type: FETCH_COLLECTION_REQUEST }
    | { type: FETCH_COLLECTION_SUCCESS, collection: CollectionResponse }
    | { type: FETCH_CARDS_REQUEST, ids: Array<string> }
    | { type: FETCH_CARDS_SUCCESS, cards: CardDetailResponse }
    | { type: FETCH_DECK_REQUEST, name: string }
    | { type: FETCH_DECK_SUCCESS, name: DeckResponse }
    | { type: ANSWER_CARD_REQUEST, id: string, answer: string }
    | { type: ANSWER_CARD_SUCCESS, name: CardDetail }
    | { type: ADD_DECK_REQUEST, name: string }
    | { type: ADD_DECK_SUCCESS, collection: CollectionResponse };

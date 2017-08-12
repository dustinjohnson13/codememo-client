//@flow
import type {
    AddDeckRequestAction,
    AddDeckSuccessAction,
    AnswerCardRequestAction,
    AnswerCardSuccessAction,
    Dispatch,
    FetchCardsRequestAction,
    FetchCardsSuccessAction,
    FetchCollectionRequestAction,
    FetchCollectionSuccessAction,
    FetchDeckRequestAction,
    FetchDeckSuccessAction,
    LoadPageAction,
    ThunkAction
} from "./actionTypes";
import {
    ADD_DECK_REQUEST,
    ADD_DECK_SUCCESS,
    ANSWER_CARD_REQUEST,
    ANSWER_CARD_SUCCESS,
    FETCH_CARDS_REQUEST,
    FETCH_CARDS_SUCCESS,
    FETCH_COLLECTION_REQUEST,
    FETCH_COLLECTION_SUCCESS,
    FETCH_DECK_REQUEST,
    FETCH_DECK_SUCCESS,
    LOAD_PAGE
} from "./actionTypes"
import type {PageType} from "./pages";
import {Page} from './pages'
import {CardDetail, CardDetailResponse, CollectionResponse, DeckResponse} from "../services/APIDomain";
import API from '../services/API'

export const loadPage = (page: PageType): LoadPageAction => {
    return {
        type: LOAD_PAGE,
        page: page
    }
};

export const collectionPage = (): LoadPageAction => {
    return loadPage(Page.COLLECTION);
};

export const fetchCollectionRequest = (): FetchCollectionRequestAction => {
    return {
        type: FETCH_COLLECTION_REQUEST
    }
};

export const fetchCollectionSuccess = (response: CollectionResponse): FetchCollectionSuccessAction => {
    return {
        type: FETCH_COLLECTION_SUCCESS,
        collection: response
    }
};

export const addDeckRequest = (name: string): AddDeckRequestAction => {
    return {
        type: ADD_DECK_REQUEST,
        name
    }
};

export const addDeckSuccess = (response: CollectionResponse): AddDeckSuccessAction => {
    return {
        type: ADD_DECK_SUCCESS,
        collection: response
    };
};

export const fetchDeckRequest = (name: string): FetchDeckRequestAction => {
    return {
        type: FETCH_DECK_REQUEST,
        name
    }
};

export const fetchDeckSuccess = (response: DeckResponse): FetchDeckSuccessAction => {
    return {
        type: FETCH_DECK_SUCCESS,
        deck: response
    }
};

export const fetchCardsRequest = (ids: Array<string>): FetchCardsRequestAction => {
    return {
        type: FETCH_CARDS_REQUEST,
        ids
    }
};

export const fetchCardsSuccess = (response: CardDetailResponse): FetchCardsSuccessAction => {
    return {
        type: FETCH_CARDS_SUCCESS,
        cards: response.cards
    }
};

export const answerCardRequest = (id: string, answer: string): AnswerCardRequestAction => {
    return {
        type: ANSWER_CARD_REQUEST,
        id: id,
        answer: answer
    }
};

export const answerCardSuccess = (response: CardDetail): AnswerCardSuccessAction => {
    return {
        type: ANSWER_CARD_SUCCESS,
        card: response
    }
};

export function loadCollectionPage(): ThunkAction {
    return function (dispatch: Dispatch, getState: Function) {
        return new Promise((resolve, reject) => {
            const state = getState();
            if (state.collection.decks) {
                dispatch(collectionPage());
            } else {
                dispatch(fetchCollection()).then(() => {
                    dispatch(collectionPage());
                });
            }
        });
    }
}

export function reviewDeck(name: string) {
    return function (dispatch: Dispatch, getState: Function) {
        return new Promise((resolve, reject) => {
            dispatch(fetchDeck(name))
        }).then(() => dispatch(loadPage(Page.REVIEW)))
    }
}

export function addDeck(name: string) {
    return function (dispatch: Dispatch) {

        dispatch(addDeckRequest(name));

        return API.addDeck(name)
            .then(collection => dispatch(addDeckSuccess(collection)))
    }
}

export function answerCard(id: string, answer: string) {
    return function (dispatch: Dispatch) {

        dispatch(answerCardRequest(id, answer));

        return API.answerCard(id, answer)
            .then(card => {
                dispatch(answerCardSuccess(card))
            })
    }
}

function fetchCollection() {
    return function (dispatch: Dispatch) {
        dispatch(fetchCollectionRequest());

        return API.fetchCollection()
            .then((response: CollectionResponse) =>
                dispatch(fetchCollectionSuccess(response)))

    }
}


const CARDS_TO_RETRIEVE_PER_REQUEST = 10;

function fetchDeck(name: string): ThunkAction {
    return function (dispatch: Dispatch) {

        dispatch(fetchDeckRequest(name));

        return API.fetchDeck(name)
            .then(deck => {
                dispatch(fetchDeckSuccess(deck));

                const dueOrNewCards = deck.cards.filter(card => card.status !== 'OK');
                if (dueOrNewCards.length > 0) {
                    const cardsToRetrieve = dueOrNewCards.slice(0, CARDS_TO_RETRIEVE_PER_REQUEST)
                        .reduce((ids, card) => ids.concat(card.id), []);
                    dispatch(fetchCards(cardsToRetrieve))
                }
            });
    }
}

function fetchCards(ids: Array<string>) {
    return function (dispatch: Dispatch): Promise<FetchCardsSuccessAction> {

        dispatch(fetchCardsRequest(ids));

        return API.fetchCards(ids).then((response: CardDetailResponse) =>
            dispatch(fetchCardsSuccess(response))
        );
    }
}
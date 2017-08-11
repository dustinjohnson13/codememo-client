//@flow
import type {Action} from "./actionTypes";
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
import type {DataService} from "../services/DataService";

type Dispatch = (action: Action | Promise<Action>) => Promise<any>;

export const loadPage = (page: PageType) => {
    return {
        type: LOAD_PAGE,
        page: page
    }
};

export const collectionPage = () => {
    return loadPage(Page.COLLECTION);
};

export const fetchCollectionRequest = () => {
    return {
        type: FETCH_COLLECTION_REQUEST
    }
};

export const fetchCollectionSuccess = (response: CollectionResponse) => {
    return {
        type: FETCH_COLLECTION_SUCCESS,
        collection: response
    }
};

export const addDeckRequest = (name: string) => {
    return {
        type: ADD_DECK_REQUEST,
        name
    }
};

export const addDeckSuccess = (response: CollectionResponse) => {
    return {
        type: ADD_DECK_SUCCESS,
        collection: response
    };
};

export const fetchDeckRequest = (name: string) => {
    return {
        type: FETCH_DECK_REQUEST,
        name
    }
};

export const fetchDeckSuccess = (response: DeckResponse) => {
    return {
        type: FETCH_DECK_SUCCESS,
        deck: response
    }
};

export const fetchCardsRequest = (ids: Array<string>) => {
    return {
        type: FETCH_CARDS_REQUEST,
        ids
    }
};

export const fetchCardsSuccess = (response: CardDetailResponse) => {
    return {
        type: FETCH_CARDS_SUCCESS,
        cards: response
    }
};

export const answerCardRequest = (id: string, answer: string) => {
    return {
        type: ANSWER_CARD_REQUEST,
        id: id,
        answer: answer
    }
};

export const answerCardSuccess = (response: CardDetail) => {
    return {
        type: ANSWER_CARD_SUCCESS,
        card: response
    }
};

export function loadCollectionPage(dataService: DataService) {
    return function (dispatch: Dispatch, getState: Function) {
        return new Promise((resolve, reject) => {
            const state = getState();
            if (state.collection.decks) {
                dispatch(collectionPage());
            } else {
                dispatch(fetchCollection(dataService)).then(() => {
                    dispatch(collectionPage());
                });
            }
        });
    }
}

export function reviewDeck(dataService: DataService, name: string) {
    return function (dispatch: Dispatch, getState: Function) {
        return new Promise((resolve, reject) => {
            dispatch(fetchDeck(dataService, name))
        }).then(() => dispatch(loadPage(Page.REVIEW)))
    }
}

export function addDeck(dataService: DataService, name: string) {
    return function (dispatch: Dispatch) {

        dispatch(addDeckRequest(name));

        return dataService.addDeck(name)
            .then(collection => dispatch(addDeckSuccess(collection)))
    }
}

export function answerCard(dataService: DataService, id: string, answer: string) {
    return function (dispatch: Dispatch) {

        dispatch(answerCardRequest(id, answer));

        return dataService.answerCard(id, answer)
            .then(card => {
                dispatch(answerCardSuccess(card))
            })
    }
}

function fetchCollection(dataService: DataService) {
    return function (dispatch: Dispatch) {
        dispatch(fetchCollectionRequest());

        return dataService.fetchCollection()
            .then(
                (response: CollectionResponse) => response,
                // Do not use catch, because that will also catch
                // any errors in the dispatch and resulting render,
                // causing an loop of 'Unexpected batch number' errors.
                // https://github.com/facebook/react/issues/6895
                error => console.log('An error occurred.', error)
            )
            .then((response: CollectionResponse) => {
                    dispatch(fetchCollectionSuccess(response))
                }
            );
    }
}

const CARDS_TO_RETRIEVE_PER_REQUEST = 10;

function fetchDeck(dataService: DataService, name) {
    return function (dispatch) {

        dispatch(fetchDeckRequest(name));

        return dataService.fetchDeck(name)
            .then(deck => {
                dispatch(fetchDeckSuccess(deck));

                const dueOrNewCards = deck.cards.filter(card => card.status !== 'OK');
                if (dueOrNewCards.length > 0) {
                    const cardsToRetrieve = dueOrNewCards.slice(0, CARDS_TO_RETRIEVE_PER_REQUEST)
                        .reduce((ids, card) => ids.concat(card.id), []);
                    dispatch(fetchCards(dataService, cardsToRetrieve))
                }
            });
    }
}

function fetchCards(dataService: DataService, ids) {
    return function (dispatch) {

        dispatch(fetchCardsRequest(ids));

        return dataService.fetchCards(ids).then(json => {
            dispatch(fetchCardsSuccess(json.cards))
        });
    }
}
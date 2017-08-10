// import fetch from 'isomorphic-fetch'

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
import {COLLECTION} from '../actions/pages'
import {REVIEW} from "./pages";

export const loadPage = (page) => {
    return {
        type: LOAD_PAGE,
        page: page
    }
};

export const collectionPage = () => {
    return loadPage(COLLECTION);
};

export const fetchCollectionRequest = () => {
    return {
        type: FETCH_COLLECTION_REQUEST
    }
};

export const fetchCollectionSuccess = (json) => {
    return {
        type: FETCH_COLLECTION_SUCCESS,
        collection: json
    }
};

export const addDeckRequest = name => {
    return {
        type: ADD_DECK_REQUEST,
        name
    }
};

export const addDeckSuccess = json => {
    return {
        type: ADD_DECK_SUCCESS,
        collection: json
    };
};

export const fetchDeckRequest = name => {
    return {
        type: FETCH_DECK_REQUEST,
        name
    }
};

export const fetchDeckSuccess = json => {
    return {
        type: FETCH_DECK_SUCCESS,
        deck: json
    }
};

export const fetchCardsRequest = ids => {
    return {
        type: FETCH_CARDS_REQUEST,
        ids
    }
};

export const fetchCardsSuccess = json => {
    return {
        type: FETCH_CARDS_SUCCESS,
        cards: json
    }
};

export const answerCardRequest = (id, answer) => {
    return {
        type: ANSWER_CARD_REQUEST,
        id: id,
        answer: answer
    }
};

export const answerCardSuccess = json => {
    return {
        type: ANSWER_CARD_SUCCESS,
        card: json
    }
};

export function loadCollectionPage(dataService) {
    return function (dispatch, getState) {
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

export function reviewDeck(dataService, name) {
    return function (dispatch, getState) {
        return new Promise((resolve, reject) => {
            dispatch(fetchDeck(dataService, name))
        }).then(() => dispatch(loadPage(REVIEW)))
    }
}

export function addDeck(dataService, name) {
    return function (dispatch) {

        dispatch(addDeckRequest(name));

        return dataService.addDeck(name)
            .then(collection => dispatch(addDeckSuccess(collection)))
    }
}

export function answerCard(dataService, id, answer) {
    return function (dispatch) {

        dispatch(answerCardRequest(id, answer));

        return dataService.answerCard(id, answer)
            .then(card => {
                dispatch(answerCardSuccess(card))
            })
    }
}

function fetchCollection(dataService) {
    return function (dispatch) {
        dispatch(fetchCollectionRequest());

        return dataService.fetchCollection()
            .then(
                response => response,// response => response.json(),
                // Do not use catch, because that will also catch
                // any errors in the dispatch and resulting render,
                // causing an loop of 'Unexpected batch number' errors.
                // https://github.com/facebook/react/issues/6895
                error => console.log('An error occured.', error)
            )
            .then(json => {
                    dispatch(fetchCollectionSuccess(json))
                }
            );
    }
}

const CARDS_TO_RETRIEVE_PER_REQUEST = 10;

function fetchDeck(dataService, name) {
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

function fetchCards(dataService, ids) {
    return function (dispatch) {

        dispatch(fetchCardsRequest(ids));

        return dataService.fetchCards(ids).then(json => {
            dispatch(fetchCardsSuccess(json.cards))
        });
    }
}
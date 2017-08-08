// import fetch from 'isomorphic-fetch'

import {
    ADD_DECK_REQUEST,
    ADD_DECK_SUCCESS,
    ANSWER_CARD,
    FETCH_COLLECTION_REQUEST,
    FETCH_COLLECTION_SUCCESS,
    FETCH_DECK_REQUEST,
    FETCH_DECK_SUCCESS,
    LOAD_PAGE
} from "./actionTypes"
import {COLLECTION} from '../actions/pages'

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

export const answerCard = answer => {
    return {
        type: ANSWER_CARD,
        deck: answer
    }
};

// Meet our first thunk action creator!
// Though its insides are different, you would use it just like any other action creator:
// store.dispatch(fetchPosts('reactjs'))
export function fetchCollection(dataService) {
    // Thunk middleware knows how to handle functions.
    // It passes the dispatch method as an argument to the function,
    // thus making it able to dispatch actions itself.

    return function (dispatch) {
        // First dispatch: the app state is updated to inform
        // that the API call is starting.

        dispatch(fetchCollectionRequest());

        // The function called by the thunk middleware can return a value,
        // that is passed on as the return value of the dispatch method.

        // In this case, we return a promise to wait for.
        // This is not required by thunk middleware, but it is convenient for us.
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
                    // We can dispatch many times!
                    // Here, we update the app state with the results of the API call.
                    dispatch(fetchCollectionSuccess(json))
                }
            );
    }
}

export function addDeck(dataService, name) {
    return function (dispatch) {

        dispatch(addDeckRequest(name));

        return dataService.addDeck(name)
            .then(collection => dispatch(addDeckSuccess(collection)))
    }
}

export function fetchDeck(dataService, name) {
    return function (dispatch) {

        dispatch(fetchDeckRequest(name));

        return dataService.fetchDeck(name)
            .then(deck => {
                dispatch(fetchDeckSuccess(deck))
            });
    }
}
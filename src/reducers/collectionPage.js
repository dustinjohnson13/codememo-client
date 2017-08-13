//@flow
import type {Action, CollectionState} from "../actions/actionTypes";
import {ADD_DECK_SUCCESS, FETCH_COLLECTION_SUCCESS} from '../actions/actionTypes'

export const getViewState = (state: CollectionState) => ({
    decks: state.decks ? state.decks : []
});

const collectionPage = (state: CollectionState = {decks: null}, action: Action) => {
    switch (action.type) {
        case FETCH_COLLECTION_SUCCESS:
        case ADD_DECK_SUCCESS:
            return getViewState({
                ...state,
                decks: action.collection.decks
            });
        default:
            return state;
    }
};

export default collectionPage
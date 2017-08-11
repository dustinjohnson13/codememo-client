//@flow
import type {CollectionState, FetchCollectionSuccessAction} from "../actions/actionTypes";
import {ADD_DECK_SUCCESS, FETCH_COLLECTION_SUCCESS} from '../actions/actionTypes'

export const getViewState = (state: CollectionState) => {
    const collection = state.collection;
    const decks = collection ? collection.decks : [];
    return {
        decks: decks
    }
};

const collectionPage = (state: CollectionState = {collection: null}, action: FetchCollectionSuccessAction) => {
    switch (action.type) {
        case FETCH_COLLECTION_SUCCESS:
        case ADD_DECK_SUCCESS:
            return getViewState({
                ...state,
                collection: action.collection
            });
        default:
            return state;
    }
};

export default collectionPage
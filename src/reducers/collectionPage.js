import {ADD_DECK_SUCCESS, FETCH_COLLECTION_SUCCESS} from '../actions/actionTypes'

export const getViewState = (state) => {
    const decks = state.collection.decks;
    return {
        decks: decks
    }
};

const collectionPage = (state = {}, action) => {
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
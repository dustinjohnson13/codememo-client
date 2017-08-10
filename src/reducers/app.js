import {FETCH_COLLECTION_REQUEST, FETCH_DECK_REQUEST, FETCH_DECK_SUCCESS, LOAD_PAGE} from '../actions/actionTypes'
import {REVIEW} from "../actions/pages";

export const getViewState = state => state;

const app = (state = {}, action) => {
    switch (action.type) {
        case FETCH_DECK_REQUEST:
        case FETCH_COLLECTION_REQUEST:
            return getViewState({
                ...state,
                page: null
            });
        case FETCH_DECK_SUCCESS:
            return getViewState({
                ...state,
                page: REVIEW
            });
        case LOAD_PAGE:
            return getViewState({
                ...state,
                page: action.page
            });
        default:
            return state;
    }
};

export default app
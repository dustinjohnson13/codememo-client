//@flow
import type {Action} from "../actions/actionTypes";
import {FETCH_COLLECTION_REQUEST, FETCH_DECK_REQUEST, FETCH_DECK_SUCCESS, LOAD_PAGE} from '../actions/actionTypes'
import type {PageType} from "../actions/pages";
import {Page} from "../actions/pages";

type AppState = {
    +page: ?PageType;
}

export const getViewState = (state: AppState): AppState => state;

const app = (state: AppState = {page: null}, action: Action): AppState => {
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
                page: Page.REVIEW
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
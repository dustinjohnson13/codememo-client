//@flow
import type {CombinedState} from "../actions/actionTypes";
import {appState} from "./appState";
import {reviewState} from "./reviewState";
import {collectionState} from "./collectionState";

export const defaultState = {
    app: appState,
    review: reviewState,
    collection: collectionState
};

export const storeFake = (state: CombinedState = defaultState) => {
    return {
        default: () => {
        },
        subscribe: () => {
        },
        dispatch: () => {
        },
        getState: () => {
            return {...state};
        },
    };
};
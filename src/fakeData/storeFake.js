//@flow
import type {CombinedState} from "../actions/actionTypes"
import {collectionState} from "./collectionState"
import {reviewState} from "./reviewState"

export const defaultState: CombinedState = {
    app: {page: null},
    collection: collectionState,
    review: reviewState
}

export const storeFake = (state: CombinedState = defaultState) => {
    return {
        default: () => {
        },
        subscribe: () => {
        },
        dispatch: () => {
        },
        getState: () => {
            return {...state}
        },
    }
}
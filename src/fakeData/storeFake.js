//@flow
import type {CombinedState} from "../actions/actionTypes"
import {collectionState} from "./collectionState"
import {reviewState} from "./reviewState"

export const defaultState = {
    app: {page: null},
    review: reviewState,
    collection: collectionState
}

//$FlowFixMe
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
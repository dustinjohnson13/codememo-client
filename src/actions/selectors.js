//@flow
import type {CollectionState, CombinedState, ReviewState} from "./actionTypes"

export const collection = (state: CombinedState): CollectionState => state.collection
export const review = (state: CombinedState): ReviewState => state.review

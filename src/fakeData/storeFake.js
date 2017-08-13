//@flow
import type {CombinedState} from "../actions/actionTypes";
import {DeckResponse} from "../services/APIDomain";

export const defaultState = {
    app: {page: null},
    review: {
        deckName: 'deck-1', totalCount: 6, newCount: 1, dueCount: 3,
        failInterval: '10m', hardInterval: '1d', goodInterval: '3d', easyInterval: '5d',
        toReview: [], answer: '', question: '', deck: new DeckResponse('deck-1', 'Deck1', []),
        showingAnswer: false
    },
    collection: {
        decks: []
    }
};

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
            return {...state};
        },
    };
};
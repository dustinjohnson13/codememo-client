//@flow
import type {Action, CollectionState} from "../actions/actionTypes";
import {ADD_DECK_SUCCESS, ANSWER_CARD_SUCCESS, FETCH_COLLECTION_SUCCESS} from '../actions/actionTypes'
import {Deck} from "../services/APIDomain";

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
        case ANSWER_CARD_SUCCESS:
            let decks = state.decks;
            if (decks) {
                const deckId = action.deckId;
                const deckIdx = decks.findIndex((deck) => deck.id === deckId);

                if (deckIdx > -1) {
                    const precedingDecks = decks.slice(0, deckIdx);
                    const succeedingDecks = decks.slice(deckIdx + 1);

                    const deckForId = decks[deckIdx];

                    let dueCount = deckForId.dueCount;
                    let newCount = deckForId.newCount;
                    if (deckForId.dueCount > 0) {
                        dueCount--;
                    } else if (newCount > 0) {
                        newCount--;
                    }

                    const newDeck = new Deck(deckId, deckForId.name, deckForId.totalCount, dueCount, newCount);
                    console.log(newDeck);
                    decks = [...precedingDecks, newDeck, ...succeedingDecks];
                }
            }
            return getViewState({
                ...state,
                decks: decks
            });
        default:
            return state;
    }
};

export default collectionPage
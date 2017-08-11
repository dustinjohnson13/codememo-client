import type {DataService} from "../services/DataService";
import {collectionPage, fetchCards, fetchCollection, fetchDeckRequest, fetchDeckSuccess} from "./creators";

const CARDS_TO_RETRIEVE_PER_REQUEST = 10;

export function fetchDeck(dataService: DataService, name) {
    return function (dispatch: Dispatch) {

        dispatch(fetchDeckRequest(name));

        return dataService.fetchDeck(name)
            .then(deck => {
                dispatch(fetchDeckSuccess(deck));

                const dueOrNewCards = deck.cards.filter(card => card.status !== 'OK');
                if (dueOrNewCards.length > 0) {
                    const cardsToRetrieve = dueOrNewCards.slice(0, CARDS_TO_RETRIEVE_PER_REQUEST)
                        .reduce((ids, card) => ids.concat(card.id), []);
                    dispatch(fetchCards(dataService, cardsToRetrieve))
                }
            });
    }
}

export function loadCollectionPage(dataService: DataService) {
    return function (dispatch: Dispatch, getState: Function) {
        return new Promise((resolve, reject) => {
            const state = getState();
            if (state.collection.decks) {
                dispatch(collectionPage());
            } else {
                dispatch(fetchCollection(dataService)).then(() => {
                    dispatch(collectionPage());
                });
            }
        });
    }
}
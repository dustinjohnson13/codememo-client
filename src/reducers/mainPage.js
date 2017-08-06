import * as domain from '../Domain'

import DataService from '../services/DataService';

const clock = new domain.Clock(() => new Date().getTime());
const dataService = new DataService(clock);

const mainPage = (state = {
    page: "CollectionPage",
    deck: null,
    collection: dataService.getCollection(),
    clock: clock
}, action) => {
    switch (action.type) {
        case 'SHOW_COLLECTIONS':
            return {
                ...state,
                page: "CollectionPage",
                deck: null
            };
        case 'ADD_NEW_DECK':
            const name = action.name;
            const newDeck = dataService.createDeck(name);

            return {
                ...state,
                collection: {
                    ...state.collection,
                    decks: [...state.collection.decks, newDeck]
                }
            };
        case 'REVIEW_DECK':
            const deck = state.collection.decks.find((it) => it.name === action.name);
            return {
                ...state,
                page: "ReviewPage",
                deck: deck
            };
        default:
            return state
    }
};

export default mainPage
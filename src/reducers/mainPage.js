import * as domain from '../Domain'

import DataService from '../services/DataService';

const mainPage = (state = {}, action) => {
    switch (action.type) {
        case 'FETCH_COLLECTION_REQUEST':
            return {
                ...state,
                page: null
            }
        case 'FETCH_COLLECTION_SUCCESS':
            return {
                ...state,
                page: "CollectionPage",
                collection: action.collection,
                deck: null
            };
        case 'ADD_NEW_DECK':
            const dataService = new DataService(new domain.Clock(() => new Date().getTime()));
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
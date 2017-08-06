import * as domain from '../Domain'

import DataService from '../services/DataService';

const mainPage = (state = {}, action) => {
    switch (action.type) {
        case 'FETCH_COLLECTION_REQUEST':
            return {
                ...state,
                page: null
            };
        case 'FETCH_COLLECTION_SUCCESS':
        case 'ADD_DECK_SUCCESS':
            return {
                ...state,
                page: "CollectionPage",
                collection: action.collection,
                deck: null
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
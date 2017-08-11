import {FakeDataService} from "../fakeData/FakeDataService";

import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import {loadPage, reviewDeck} from "./creators";
import {loadCollectionPage} from "./creators.thunk.js";
import {
    deckName,
    getCollection,
    getDeck1,
    getDeck1DueCards,
    gotCollection,
    gotDeck1,
    gotDeck1DueCards
} from "./creators.test.actions";
import {COLLECTION, REVIEW} from "./pages";
import {collectionState} from '../fakeData/collectionState'

describe('creators', () => {

    const dataService = new FakeDataService();
    const middlewares = [thunk];
    const mockStore = configureStore(middlewares);

    it('fetches collection and loads collection page when collection not available', () => {

        const store = mockStore({collection: {}});

        const expectedActions = [
            getCollection,
            gotCollection,
            loadPage(COLLECTION)
        ];

        store.dispatch(loadCollectionPage(dataService)).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    it('loads collection page automatically when collection available', () => {

        const state = {collection: collectionState};
        const store = mockStore(state);

        const expectedActions = [
            loadPage(COLLECTION)
        ];

        store.dispatch(loadCollectionPage(dataService)).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    it('fetches deck and loads review page', () => {

        const store = mockStore({});

        const expectedActions = [getDeck1,
            gotDeck1,
            getDeck1DueCards,
            gotDeck1DueCards,
            loadPage(REVIEW)];

        store.dispatch(reviewDeck(dataService, deckName)).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
        });
    });
});
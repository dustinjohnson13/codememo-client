//@flow
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import {collectionPage, loadCollectionPage, loadPage, reviewDeck} from "./creators";
import {
    deckName,
    getCollection,
    getDeck1,
    getDeck1DueCards,
    gotCollection,
    gotDeck1,
    gotDeck1DueCards
} from "./creators.test.actions";
import {collectionState} from '../fakeData/collectionState'
import {Page} from "./pages";
import * as API from '../services/API';

jest.mock('../services/API'); // Set mock API for module importing

describe('creators', () => {

    const dataService = API.default;

    const middlewares = [thunk];
    const mockStore = configureStore(middlewares);

    it('fetches collection and loads collection page when collection not available', () => {

        const store = mockStore({collection: {}});

        const expectedActions = [
            getCollection,
            gotCollection,
            collectionPage()
        ];

        store.dispatch(loadCollectionPage()).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    it('loads collection page automatically when collection available', () => {

        const state = {collection: collectionState};
        const store = mockStore(state);

        const expectedActions = [
            collectionPage()
        ];

        store.dispatch(loadCollectionPage()).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    it('fetches deck and loads review page', () => {

        const store = mockStore({});

        const expectedActions = [getDeck1,
            gotDeck1,
            getDeck1DueCards,
            gotDeck1DueCards,
            loadPage(Page.REVIEW)];

        // $FlowFixMe
        store.dispatch(reviewDeck(deckName)).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
        });
    });
});
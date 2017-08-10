import {fetchDeck} from '../actions/creators'
import FakeDataService from "../fakeData/FakeDataService";

import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import {fetchCollection} from "./creators";
import {deckName, getDeck1DueCards, getCollection, getDeck1, gotDeck1DueCards, gotCollection, gotDeck1} from "./creators.test.actions";

describe('creators', () => {

    const dataService = new FakeDataService();
    const middlewares = [thunk];
    const mockStore = configureStore(middlewares);
    let store;

    beforeEach(function () {
        store = mockStore({});
    });

    it('invokes proper sequence of actions on fetch collection success', () => {

        const expectedActions = [
            getCollection,
            gotCollection
        ];

        store.dispatch(fetchCollection(dataService)).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    it('invokes proper sequence of actions on fetch deck success', () => {

        const expectedActions = [getDeck1, gotDeck1, getDeck1DueCards, gotDeck1DueCards];

        store.dispatch(fetchDeck(dataService, deckName)).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
        });
    });
});
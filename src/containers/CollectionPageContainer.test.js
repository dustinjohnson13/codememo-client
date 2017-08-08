import React from 'react';

import jsdom from 'jsdom';
import {mapDispatchToProps, mapStateToProps} from "./CollectionPageContainer";
import {collectionState} from "../fakeData/collectionState";
import {Deck} from "../components/CollectionPage";
import {addDeckRequest, fetchCollectionRequest, fetchDeckRequest, fetchDeckSuccess} from "../actions/index";
import FakeDataService from "../fakeData/FakeDataService";
import middlewareFake from "../fakeData/middlewareFake";


const doc = jsdom.jsdom('<!doctype html><html><body></body></html>');
global.document = doc;
global.window = doc.defaultView;

describe('<CollectionPageContainer />', () => {

    const dataService = new FakeDataService();

    it('maps decks from state', () => {
        const expectedDecks = collectionState.decks;
        const state = {collection: collectionState};

        const props = mapStateToProps(state, {dataService: dataService});

        expect(props).toEqual({decks: expectedDecks});

    });

    it('maps fetchCollections to the appropriate action', () => {
        const dispatchedActions = [];
        const dispatcher = (action) => dispatchedActions.push(action);

        const props = mapDispatchToProps(dispatcher, {});

        props.fetchCollections();

        expect(dispatchedActions).toEqual([fetchCollectionRequest()]);
    });

    it('maps fetchDeck to the appropriate action', () => {

        const {store, next, invoke} = middlewareFake();

        const {fetchDeck} = mapDispatchToProps(invoke, {dataService: dataService});
        fetchDeck('Deck1');

        expect(store.dispatch).toHaveBeenCalledWith(fetchDeckRequest('Deck1'));
    });

    it('maps addDeck to the appropriate action', () => {

        const {store, next, invoke} = middlewareFake();

        const {addDeck} = mapDispatchToProps(invoke, {dataService: dataService});
        addDeck('BrandNew');

        expect(store.dispatch).toHaveBeenCalledWith(addDeckRequest('BrandNew'));
    });

});
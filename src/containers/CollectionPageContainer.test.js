import React from 'react';
import {mapDispatchToProps, mapStateToProps} from "./CollectionPageContainer";
import {collectionState} from "../fakeData/collectionState";
import {Deck} from "../components/CollectionPage";
import {addDeckRequest, fetchCollectionRequest} from "../actions/creators";
import middlewareFake from "../fakeData/middlewareFake";
import * as API from '../services/API';

jest.mock('../services/API'); // Set mock API for module importing

describe('<CollectionPageContainer />', () => {

    const dataService = API.default;

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

    // it('maps reviewDeck to the appropriate action', () => {
    //
    //     let reviewRequest = null;
    //     const fn = (name) => reviewRequest = name;
    //     const {reviewDeck} = mapDispatchToProps(invoke, {dataService: dataService});
    //     reviewDeck('Deck1');
    //
    //     expect(reviewDeck).toEqual();
    // });

    it('maps addDeck to the appropriate action', () => {

        const {store, next, invoke} = middlewareFake();

        const {addDeck} = mapDispatchToProps(invoke, {dataService: dataService});
        addDeck('BrandNew');

        expect(store.dispatch).toHaveBeenCalledWith(addDeckRequest('BrandNew'));
    });

});
import React from 'react';
import {mapDispatchToProps, mapStateToProps} from "./CollectionPageContainer";
import {collectionState} from "../fakeData/collectionState";
import {Deck} from "../components/CollectionPage";
import {addDeckRequest, fetchCollectionRequest, reviewDeckRequest} from "../actions/creators";
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

    it('maps reviewDeck to the appropriate action', () => {

        const expectedActions = [reviewDeckRequest('Deck1')];

        const actions = [];
        const invoke = (action: Action) => actions.push(action);

        const {reviewDeck} = mapDispatchToProps(invoke, {});
        reviewDeck('Deck1');

        expect(actions).toEqual(expectedActions);
    });

    it('maps addDeck to the appropriate action', () => {

        const expectedActions = [addDeckRequest('BrandNew')];

        const actions = [];
        const invoke = (action: Action) => actions.push(action);

        const {addDeck} = mapDispatchToProps(invoke, {});
        addDeck('BrandNew');

        expect(actions).toEqual([addDeckRequest('BrandNew')]);
    });

});
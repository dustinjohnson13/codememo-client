import React from 'react';
import {reviewState} from "../fakeData/reviewState";
import {answerCardRequest, collectionPage, loadCollectionPage} from "../actions/creators";
import {GOOD} from '../Domain'
import middlewareFake from "../fakeData/middlewareFake";
import {mapDispatchToProps, mapStateToProps} from "./ReviewPageContainer";
import {Deck} from "../components/CollectionPage";
import FakeDataService from "../fakeData/FakeDataService";

describe('<ReviewPageContainer/>', () => {

    const dataService = new FakeDataService();

    it('maps deck attributes from state', () => {
        const expectedState = {
            deckName: 'deck-1', totalCount: 6, newCount: 1, dueCount: 3
        };
        const state = {review: reviewState};

        const props = mapStateToProps(state);

        expect(props).toEqual(expectedState);

    });

    // it('maps back to the appropriate action', () => {
    //     const dispatchedActions = [];
    //     const dispatcher = (action) => dispatchedActions.push(action);
    //
    //     const props = mapDispatchToProps(dispatcher, {});
    //
    //     props.back();
    //
    //     expect(dispatchedActions).toEqual([loadCollectionPage()]);
    // });

    it('maps answerCard to the appropriate action', () => {
        const {store, next, invoke} = middlewareFake();

        const {answerCard} = mapDispatchToProps(invoke, {dataService: dataService});
        answerCard('deck-1-card-0', GOOD);

        expect(store.dispatch).toHaveBeenCalledWith(answerCardRequest('deck-1-card-0', GOOD));
    });
});
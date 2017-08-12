import React from 'react';
import {reviewState} from "../fakeData/reviewState";
import {answerCardRequest} from "../actions/creators";
import {GOOD} from '../Domain'
import middlewareFake from "../fakeData/middlewareFake";
import {mapDispatchToProps, mapStateToProps} from "./ReviewPageContainer";
import {Deck} from "../components/CollectionPage";
import * as API from '../services/API';

jest.mock('../services/API'); // Set mock API for module importing

describe('<ReviewPageContainer/>', () => {

    const dataService = API.default;

    it('maps deck attributes from state', () => {
        const expectedState = {
            "answer": "",
            "deckName": "deck-1",
            "dueCount": 3,
            "id": undefined,
            "newCount": 1,
            "question": "",
            "totalCount": 6
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
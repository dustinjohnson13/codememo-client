import React from 'react';
import {reviewState} from "../fakeData/reviewState";
import {answerCardRequest} from "../actions/creators";
import {GOOD} from '../Domain'
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
    //     const dispatcher = (action: Action) => dispatchedActions.push(action);
    //
    //     const props = mapDispatchToProps(dispatcher, {});
    //     props.back();
    //
    //     expect(dispatchedActions).toEqual([loadCollectionPage()]);
    // });

    it('maps answerCard', () => {

        const expectedActions = [answerCardRequest('deck-1-card-0', GOOD)];

        const actions = [];
        const invoke = (action: Action) => actions.push(action);

        const {answerCard} = mapDispatchToProps(invoke, {});
        answerCard('deck-1-card-0', GOOD);

        expect(actions).toEqual(expectedActions);
    });
});
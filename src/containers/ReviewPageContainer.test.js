import React from 'react';
import {reviewState} from "../fakeData/reviewState";
import {addCardRequest, answerCardRequest} from "../actions/creators";
import {GOOD} from '../Domain'
import {mapDispatchToProps, mapStateToProps} from "./ReviewPageContainer";
import {Deck} from "../components/CollectionPage";

jest.mock('../services/API'); // Set mock API for module importing

describe('<ReviewPageContainer/>', () => {

    it('maps deck attributes from state', () => {
        const expectedState = {
            "deckName": "deck-1",
            "dueCount": 3,
            "newCount": 1,
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

    it('maps answer card', () => {

        const expectedActions = [answerCardRequest('deck-1-card-0', GOOD)];

        const actions = [];
        const invoke = (action: Action) => actions.push(action);

        const {answerCard} = mapDispatchToProps(invoke, {});
        answerCard('deck-1-card-0', GOOD);

        expect(actions).toEqual(expectedActions);
    });

    it('maps add card', () => {

        const deckId = 'deck-1';
        const question = 'Some Question';
        const answer = 'Some Answer';

        const expectedActions = [addCardRequest(deckId, question, answer)];

        const actions = [];
        const invoke = (action: Action) => actions.push(action);

        const {addCard} = mapDispatchToProps(invoke, {});
        addCard(deckId, question, answer);

        expect(actions).toEqual(expectedActions);
    });
});
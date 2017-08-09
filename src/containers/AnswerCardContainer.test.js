import React from 'react';

import {mapDispatchToProps, mapStateToProps} from "./AnswerCardContainer";
import {reviewState} from "../fakeData/reviewState";
import {answerCard} from "../actions/creators";
import {HARD} from '../Domain'

describe('<AnswerCardContainer />', () => {

    it('maps card attributes from state', () => {
        const expectedState = {
            failInterval: '10m',
            hardInterval: '1d',
            goodInterval: '3d',
            easyInterval: '5d'
        };
        const state = {review: reviewState};

        const props = mapStateToProps(state);

        expect(props).toEqual(expectedState);

    });

    it('maps answerCard to the appropriate action', () => {
        const dispatchedActions = [];
        const dispatcher = (action) => dispatchedActions.push(action);

        const props = mapDispatchToProps(dispatcher, {});

        props.answerCard(HARD);

        expect(dispatchedActions).toEqual([answerCard(HARD)]);
    });
});
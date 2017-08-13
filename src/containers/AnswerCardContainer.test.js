import React from 'react';

import {mapDispatchToProps, mapStateToProps} from "./AnswerCardContainer";
import {reviewState} from "../fakeData/reviewState";
import {GOOD, HARD} from '../Domain'
import {answerCardRequest} from "../actions/creators";

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

    it('answerCard will invoke function with id and difficulty', () => {
        let answered = [];
        const dispatcher = (action) => {
            answered.push(action);
        };

        const idProp = 'some-id';
        const props = mapDispatchToProps(dispatcher, {id: idProp});

        props.answerCard(HARD);
        props.answerCard(GOOD);

        expect(answered).toEqual([answerCardRequest(idProp, HARD), answerCardRequest(idProp, GOOD)]);
    });
});
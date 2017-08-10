import React from 'react';

import {mapDispatchToProps, mapStateToProps} from "./AnswerCardContainer";
import {reviewState} from "../fakeData/reviewState";
import {GOOD, HARD} from '../Domain'

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
        const f = (id, answer) => {
            answered.push({id, answer});
        };
        const dispatcher = (action) => {
        };

        const idProp = 'some-id';
        const props = mapDispatchToProps(dispatcher, {answerCard: f, id: idProp});

        props.answerCard(HARD);
        props.answerCard(GOOD);

        expect(answered).toEqual([{id: idProp, answer: HARD}, {id: idProp, answer: GOOD}]);
    });
});
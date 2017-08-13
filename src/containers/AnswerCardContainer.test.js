import React from 'react';

import {mapDispatchToProps, mapStateToProps} from "./AnswerCardContainer";
import {reviewState} from "../fakeData/reviewState";
import {GOOD, HARD} from '../Domain'
import {answerCardRequest, hideAnswer} from "../actions/creators";

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

    it('answerCard will hide answer section and send an answer request', () => {
        const cardId = 'some-id';
        const expectedActions = [
            hideAnswer(),
            answerCardRequest(cardId, HARD),
            hideAnswer(),
            answerCardRequest(cardId, GOOD)];

        let answered = [];
        const dispatcher = (action) => {
            answered.push(action);
        };

        const props = mapDispatchToProps(dispatcher, {id: cardId});

        props.answerCard(HARD);
        props.answerCard(GOOD);

        expect(answered).toEqual(expectedActions);
    });
});
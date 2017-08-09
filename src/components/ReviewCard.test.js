import React from 'react';
import {Provider} from 'react-redux';
import {storeFake} from "../fakeData/storeFake";
import ReviewCard from "./ReviewCard";
import jsdom from 'jsdom';
import {mount} from 'enzyme';

const doc = jsdom.jsdom('<!doctype html><html><body></body></html>');
global.document = doc;
global.window = doc.defaultView;

describe('<ReviewCard />', () => {

    const state = {
        review: {
            failInterval: '1d',
            hardInterval: '2d',
            goodInterval: '3d',
            easyInterval: '4d'
        }
    };

    let component;
    beforeEach(() => {
        const store = storeFake(state);
        const wrapper = mount(
            <Provider store={store}>
                <ReviewCard question='What is the capital of Peru?' answer="Lima"/>
            </Provider>
        );

        component = wrapper.find(ReviewCard);
    });

    it('shows the question', () => {
        const collection = component.find('.review-question');
        expect(collection.length).toEqual(1);
        expect(collection.text()).toEqual('What is the capital of Peru?');
    });

    it('shows the answer only when the show answer button is pressed', () => {

        const answerSelector = '.review-answer';

        let answer = component.find(answerSelector);
        expect(answer.length).toEqual(0);

        const showAnswer = component.find('.show-answer');
        expect(showAnswer.length).toEqual(1);
        showAnswer.simulate('click');

        answer = component.find(answerSelector);
        expect(answer.length).toEqual(1);
        expect(answer.text()).toEqual('Lima');
    });
});
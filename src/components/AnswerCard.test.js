//@flow
import React from 'react';
import {Provider} from 'react-redux';
import {storeFake} from "../fakeData/storeFake";
import AnswerCard from "./AnswerCard";
import {EASY, FAIL, GOOD, HARD} from '../Domain'
import jsdom from 'jsdom';
import {mount} from 'enzyme';

const doc = jsdom.jsdom('<!doctype html><html><body></body></html>');
global.document = doc;
global.window = doc.defaultView;

describe('<AnswerCard />', () => {

    let answers;
    let app;

    const answered = (answer) => {
        answers.push(answer);
    };

    beforeEach(() => {
        answers = [];

        const store = storeFake({});
        const wrapper = mount(
            <Provider store={store}>
                <AnswerCard failInterval='30s' hardInterval='45s' goodInterval='70s' easyInterval='120s'
                            answerCard={answered}/>
            </Provider>
        );

        app = wrapper.find(AnswerCard);
    });

    it('can choose fail', () => {
        const failButton = app.find('.btn-danger');
        expect(failButton.length).toEqual(1);
        expect(failButton.text().trim()).toEqual('30s');

        failButton.simulate('click');
        expect(answers).toEqual([FAIL]);
    });

    it('can choose hard', () => {
        const hardButton = app.find('.btn-warning');
        expect(hardButton.length).toEqual(1);
        expect(hardButton.text().trim()).toEqual('45s');

        hardButton.simulate('click');
        expect(answers).toEqual([HARD]);
    });

    it('can choose good', () => {
        const goodButton = app.find('.btn-info');
        expect(goodButton.length).toEqual(1);
        expect(goodButton.text().trim()).toEqual('70s');

        goodButton.simulate('click');
        expect(answers).toEqual([GOOD]);
    });

    it('can choose easy', () => {
        const easyButton = app.find('.btn-success');
        expect(easyButton.length).toEqual(1);
        expect(easyButton.text().trim()).toEqual('120s');

        easyButton.simulate('click');
        expect(answers).toEqual([EASY]);
    });
});
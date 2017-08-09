import React from 'react';
import {Provider} from 'react-redux';
import {storeFake} from "../fakeData/storeFake";
import ReviewPage from "./ReviewPage";
import jsdom from 'jsdom';
import {mount} from 'enzyme';

const doc = jsdom.jsdom('<!doctype html><html><body></body></html>');
global.document = doc;
global.window = doc.defaultView;

describe('<ReviewPage />', () => {
    const state = {
        review: {
            failInterval: '1d',
            hardInterval: '2d',
            goodInterval: '3d',
            easyInterval: '4d'
        }
    };

    let component;
    let requestedBack = false;
    const back = () => {
        requestedBack = true;
    };

    beforeEach(() => {
        requestedBack = false;

        const store = storeFake(state);
        const wrapper = mount(
            <Provider store={store}>
                <ReviewPage deckName={'SomeDeck'} totalCount={30} dueCount={20} newCount={10} back={back}/>
            </Provider>
        );

        component = wrapper.find(ReviewPage);
    });

    it('shows the deck name', () => {
        expect(component.contains(<h3>SomeDeck</h3>)).toEqual(true);
    });

    it('should be able to go back', () => {
        expect(requestedBack).toEqual(false);
        const backBtn = component.find('.back').simulate('click');
        expect(requestedBack).toEqual(true);
    });

    it('shows the card counts', () => {
        // TODO: How to verify these?
        // expect(component.contains(<span className="due-count">20</span>)).toEqual(true);
        // expect(component.contains(<span className="new-count">10</span>)).toEqual(true);
    })
});
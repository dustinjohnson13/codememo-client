//@flow
import React from 'react';
import {Provider} from 'react-redux';
import {storeFake} from "../fakeData/storeFake";
import Collection from "./Collection";
import jsdom from 'jsdom';
import {mount} from 'enzyme';

const doc = jsdom.jsdom('<!doctype html><html><body></body></html>');
global.document = doc;
global.window = doc.defaultView;

describe('<Collection />', () => {

    const testDecks = [{id: 'deck-1', name: 'Deck1', total: 16, due: 7, new: 3},
        {id: 'deck-2', name: 'Deck2', total: 26, due: 17, new: 4}];

    const invokedFunction = (deck) => {
    };

    let component;

    beforeEach(() => {
        const store = storeFake();
        const wrapper = mount(
            <Provider store={store}>
                <Collection decks={testDecks} reviewDeck={invokedFunction}/>
            </Provider>
        );

        component = wrapper.find(Collection);
    });

    it('should render a deck for each in the collection', () => {
        expect(component.find('.deck').length).toEqual(2);
        expect(component.contains(<span>Deck1</span>)).toEqual(true);
        expect(component.contains(<span>Deck2</span>)).toEqual(true);
    });
});
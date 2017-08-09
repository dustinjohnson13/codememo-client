import React from 'react';
import {Provider} from 'react-redux';
import {storeFake} from "../fakeData/storeFake";
import {Collection, CollectionPage} from "./CollectionPage";
import Deck from './Deck'
import jsdom from 'jsdom';
import {mount} from 'enzyme';

const doc = jsdom.jsdom('<!doctype html><html><body></body></html>');
global.document = doc;
global.window = doc.defaultView;

describe('<Deck />', () => {

    const testDeck = {id: 'deck-1', name: 'Deck1', total: 16, due: 7, new: 3};

    let requestedDecks;
    let app;

    const invokedFunction = (deck) => {
        requestedDecks.push(deck);
    };

    beforeEach(() => {
        requestedDecks = [];

        const store = storeFake({});
        const wrapper = mount(
            <Provider store={store}>
                <Deck deck={testDeck} reviewDeck={invokedFunction}/>
            </Provider>
        );

        app = wrapper.find(Deck);
    });

    it('can request to review deck', () => {
        app.find('.deck').simulate('click');
        expect(requestedDecks).toEqual(['Deck1']);
    });

    it('shows due count', () => {
        const due = <span className="due-count">{7}</span>;
        expect(app.contains(due)).toEqual(true);
    });

    it('shows new count', () => {
        const count = <span className="new-count">{3}</span>;
        expect(app.contains(count)).toEqual(true);
    });

    it('shows deck name', () => {
        const name = <span>Deck1</span>;
        expect(app.contains(name)).toEqual(true);
    });
});
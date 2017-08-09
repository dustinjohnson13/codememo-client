import React from 'react';
import {Provider} from 'react-redux';
import {storeFake} from "../fakeData/storeFake";
import CollectionPage from "./CollectionPage";
import jsdom from 'jsdom';
import {mount} from 'enzyme';

const doc = jsdom.jsdom('<!doctype html><html><body></body></html>');
global.document = doc;
global.window = doc.defaultView;

describe('<CollectionPage />', () => {

    const testDecks = [{name: 'deck1', due: 10, new: 1}];

    let requestedDecks;
    let app;

    const invokedFunction = (deck) => {
        requestedDecks.push(deck);
    };
    const addDeck = (name) => {
    };

    beforeEach(() => {
        requestedDecks = [];

        const store = storeFake({});
        const wrapper = mount(
            <Provider store={store}>
                <CollectionPage decks={testDecks} fetchDeck={invokedFunction} addDeck={addDeck}/>
            </Provider>
        );

        app = wrapper.find(CollectionPage);
    });

    it('creates a collection', () => {
        const collection = app.find('.collection');
        expect(collection.length).toEqual(1);
    });

    it('creates an add deck modal', () => {
        const createDeckButton = app.find('button');
        expect(createDeckButton.length).toEqual(1);
        expect(createDeckButton.text()).toEqual('Create Deck');
    });
});
//@flow
import React from 'react'
import {Provider} from 'react-redux'
import {storeFake} from "../fakeData/storeFake"
import CollectionPage from "./CollectionPage"
import jsdom from 'jsdom'
import {mount} from 'enzyme'
import {Deck} from "../services/APIDomain"

const doc = jsdom.jsdom('<!doctype html><html><body></body></html>')
global.document = doc
global.window = doc.defaultView

describe('<CollectionPage />', () => {

    const testDecks = [new Deck('1', 'Deck 1', 20, 10, 1)]

    const reviewDeck = (deck) => {
    }
    const addDeck = (name) => {
    }
    const deleteDeck = (id) => {
    }

    let app
    beforeEach(() => {
        const store = storeFake()
        const wrapper = mount(
            <Provider store={store}>
                <CollectionPage decks={testDecks} addDeck={addDeck}
                                reviewDeck={reviewDeck} deleteDeck={deleteDeck}/>
            </Provider>
        )

        app = wrapper.find(CollectionPage)
    })

    it('creates a collection', () => {
        const collection = app.find('.collection')
        expect(collection.length).toEqual(1)
    })

    it('creates an add deck modal', () => {
        const createDeckButton = app.find('button')
        expect(createDeckButton.length).toEqual(1)
        expect(createDeckButton.text()).toEqual('Create Deck')
    })
})
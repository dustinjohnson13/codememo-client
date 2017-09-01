//@flow
import React from 'react'
import {Provider} from 'react-redux'
import {storeFake} from "../fakeData/storeFake"
import Collection from "./Collection"
import jsdom from 'jsdom'
import {mount} from 'enzyme'
import {Deck} from "../services/APIDomain"

const doc = jsdom.jsdom('<!doctype html><html><body></body></html>')
global.document = doc
global.window = doc.defaultView

describe('<Collection />', () => {

    const testDecks = [new Deck('deck-1', 'Deck1', 16, 7, 3),
        new Deck('deck-2', 'Deck2', 26, 17, 4)]

    const invokedFunction = (deck) => {
    }
    const deleteDeck = () => {
    }

    let component

    beforeEach(() => {
        const store = storeFake()
        const wrapper = mount(
            <Provider store={store}>
                <Collection decks={testDecks} reviewDeck={invokedFunction} deleteDeck={deleteDeck}/>
            </Provider>
        )

        component = wrapper.find(Collection)
    })

    it('should render a deck for each in the collection', () => {
        expect(component.find('.deck').length).toEqual(2)
        expect(component.contains(<div className="deck-name">Deck1</div>)).toEqual(true)
        expect(component.contains(<div className="deck-name">Deck2</div>)).toEqual(true)
    })
})
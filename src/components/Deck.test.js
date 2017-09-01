//@flow
import React from 'react'
import {Provider} from 'react-redux'
import {storeFake} from "../fakeData/storeFake"
import Deck from './Deck'
import jsdom from 'jsdom'
import {mount} from 'enzyme'
import {Deck as APIDeck} from "../services/APIDomain"

const doc = jsdom.jsdom('<!doctype html><html><body></body></html>')
global.document = doc
global.window = doc.defaultView

describe('<Deck />', () => {

    const testDeck = new APIDeck('deck-1', 'Deck1', 16, 7, 3)

    let actions
    let app

    const reviewDeck = (name) => {
        actions.push("reviewDeck: " + name)
    }

    const deleteDeck = (id) => {
        actions.push("delete: " + id)
    }

    beforeEach(() => {
        actions = []

        const store = storeFake()
        const wrapper = mount(
            <Provider store={store}>
                <Deck deck={testDeck} reviewDeck={reviewDeck} deleteDeck={deleteDeck}/>
            </Provider>
        )

        app = wrapper.find(Deck)
    })

    it('can request to review deck', () => {
        app.find('.review-deck').simulate('click')
        expect(actions).toEqual(['reviewDeck: deck-1'])
    })

    // TODO: Test deleting deck via modal

    it('shows due count', () => {
        const due = <span className="due-count">{7}</span>
        expect(app.contains(due)).toEqual(true)
    })

    it('shows new count', () => {
        const count = <span className="new-count">{3}</span>
        expect(app.contains(count)).toEqual(true)
    })

    it('shows deck name', () => {
        const name = <div className="deck-name">Deck1</div>
        expect(app.contains(name)).toEqual(true)
    })
})
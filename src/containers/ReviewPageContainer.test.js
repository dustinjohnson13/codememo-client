//@flow
import React from 'react'
import {addCardRequest, collectionPage, startTimer} from "../actions/creators"
import {mapDispatchToProps, mapStateToProps} from "./ReviewPageContainer"
import {defaultState} from "../fakeData/storeFake"

jest.mock('../services/API') // Set mock API for module importing

describe('<ReviewPageContainer/>', () => {

    let dispatchedActions = []
    const dispatcher = (action) => {
        dispatchedActions.push(action)
    }

    beforeEach(function () {
        dispatchedActions = []
    });

    it('maps deck attributes from state', () => {
        const expectedState = {
            "id": "deck-1",
            "deckName": "Deck1",
            "dueCount": 2,
            "newCount": 1,
            "totalCount": 6
        }
        const props = mapStateToProps(defaultState, {})

        expect(props).toEqual(expectedState)

    })

    it('maps back to the appropriate action', () => {

        const props = mapDispatchToProps(dispatcher, {})
        props.back()

        expect(dispatchedActions).toEqual([collectionPage()])
    })

    it('maps restartTimer to the appropriate action', () => {


        const props = mapDispatchToProps(dispatcher, {})
        props.restartTimer()

        expect(dispatchedActions).toEqual([startTimer()])
    })

    it('maps add card', () => {

        const deckId = 'deck-1'
        const question = 'Some Question'
        const answer = 'Some Answer'

        const expectedActions = [addCardRequest(deckId, question, answer)]

        const {addCard} = mapDispatchToProps(dispatcher, {})
        addCard(deckId, question, answer)

        expect(dispatchedActions).toEqual(expectedActions)
    })
})
//@flow
import React from 'react'
import {showAnswer} from "../actions/creators"
import {mapDispatchToProps, mapStateToProps} from "./ReviewCardContainer"
import {reviewState} from "../fakeData/reviewState"
import type {Action} from "../actions/actionTypes"
import {defaultState} from "../fakeData/storeFake"

jest.mock('../services/API') // Set mock API for module importing

describe('<ReviewCardContainer/>', () => {

    it('maps component properties', () => {
        const expectedQuestion = 'Specific q'
        const expectedAnswer = 'Specific a'
        const expectedShowingAnswer = true

        const state = {
            ...defaultState,
            review: {
                ...reviewState,
                question: expectedQuestion, answer: expectedAnswer,
                showingAnswer: expectedShowingAnswer
            }
        }

        const expectedProps = {
            answer: expectedAnswer,
            cardId: 'deck-1-card-30',
            deckId: 'deck-1',
            showingAnswer: expectedShowingAnswer,
            question: expectedQuestion
        }

        const props = mapStateToProps(state, {})

        expect(props).toEqual(expectedProps)
    })

    it('maps show answer', () => {

        const expectedActions = [showAnswer()]

        const actions = []
        const invoke = (action: Action): void => {
            actions.push(action)
        }

        const {showAnswer: fn} = mapDispatchToProps(invoke, {})
        fn()

        expect(actions).toEqual(expectedActions)
    })
})
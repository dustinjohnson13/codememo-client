//@flow
import React from 'react'

import {mapDispatchToProps, mapStateToProps} from "./AnswerCardContainer"
import {answerCardRequest, hideAnswer} from "../actions/creators"
import type {AnswerType} from "../services/APIDomain"
import {Answer} from "../services/APIDomain"
import {defaultState} from "../fakeData/storeFake"
import {SystemClock} from "../services/API"
import {FrozenClock} from "../services/__mocks__/API"

describe('<AnswerCardContainer />', () => {

    const deckId = 'some-deck-id'
    const cardId = 'some-id'
    const answerCard = (answer: AnswerType) => {
    }

    const ownProps = {id: cardId, deckId: deckId, answerCard: answerCard, clock: new FrozenClock()}

    it('maps card attributes from state', () => {
        const expectedState = {
            failInterval: '10m',
            hardInterval: '1d',
            goodInterval: '3d',
            easyInterval: '5d',
            clock: ownProps.clock
        }
        const props = mapStateToProps(defaultState, ownProps)

        expect(props).toEqual(expectedState)
    })

    it('answerCard will hide answer section and send an answer request', () => {
        const startTime1 = 11111
        const endTime1 = 20000
        const startTime2 = 22222
        const endTime2 = 30000

        const expectedActions = [
            hideAnswer(),
            answerCardRequest(cardId, deckId, startTime1, endTime1, Answer.HARD),
            hideAnswer(),
            answerCardRequest(cardId, deckId, startTime2, endTime2, Answer.GOOD)]

        let answered = []
        const dispatcher = (action) => {
            answered.push(action)
        }

        const props = mapDispatchToProps(dispatcher, ownProps)

        props.answerCard(startTime1, endTime1, Answer.HARD)
        props.answerCard(startTime2, endTime2, Answer.GOOD)

        expect(answered).toEqual(expectedActions)
    })
})
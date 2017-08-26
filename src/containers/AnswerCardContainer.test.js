//@flow
import React from 'react'

import {mapDispatchToProps, mapStateToProps} from "./AnswerCardContainer"
import {answerCardRequest, hideAnswer} from "../actions/creators"
import type {AnswerType} from "../services/APIDomain"
import {Answer} from "../services/APIDomain"
import {defaultState} from "../fakeData/storeFake"

describe('<AnswerCardContainer />', () => {

    const deckId = 'some-deck-id'
    const cardId = 'some-id'
    const answerCard = (answer: AnswerType) => {
    }

    const ownProps = {id: cardId, deckId: deckId, answerCard: answerCard}

    it('maps card attributes from state', () => {
        const expectedState = {
            failInterval: '10m',
            hardInterval: '1d',
            goodInterval: '3d',
            easyInterval: '5d'
        }
        const props = mapStateToProps(defaultState, ownProps)

        expect(props).toEqual(expectedState)
    })

    it('answerCard will hide answer section and send an answer request', () => {
        const expectedActions = [
            hideAnswer(),
            answerCardRequest(cardId, deckId, Answer.HARD),
            hideAnswer(),
            answerCardRequest(cardId, deckId, Answer.GOOD)]

        let answered = []
        const dispatcher = (action) => {
            answered.push(action)
        }

        const props = mapDispatchToProps(dispatcher, ownProps)

        props.answerCard(Answer.HARD)
        props.answerCard(Answer.GOOD)

        expect(answered).toEqual(expectedActions)
    })
})
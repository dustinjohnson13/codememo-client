import React from 'react'

import {mapDispatchToProps, mapStateToProps} from "./AnswerCardContainer"
import {reviewState} from "../fakeData/reviewState"
import {answerCardRequest, hideAnswer} from "../actions/creators"
import {Answer} from "../services/APIDomain"

describe('<AnswerCardContainer />', () => {

    it('maps card attributes from state', () => {
        const expectedState = {
            failInterval: '10m',
            hardInterval: '1d',
            goodInterval: '3d',
            easyInterval: '5d'
        }
        const state = {review: reviewState}

        const props = mapStateToProps(state)

        expect(props).toEqual(expectedState)
    })

    it('answerCard will hide answer section and send an answer request', () => {
        const deckId = 'some-deck-id'
        const cardId = 'some-id'
        const expectedActions = [
            hideAnswer(),
            answerCardRequest(cardId, deckId, Answer.HARD),
            hideAnswer(),
            answerCardRequest(cardId, deckId, Answer.GOOD)]

        let answered = []
        const dispatcher = (action) => {
            answered.push(action)
        }

        const props = mapDispatchToProps(dispatcher, {id: cardId, deckId: deckId})

        props.answerCard(Answer.HARD)
        props.answerCard(Answer.GOOD)

        expect(answered).toEqual(expectedActions)
    })
})
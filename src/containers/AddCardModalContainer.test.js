//@flow
import React from 'react'

import { mapDispatchToProps, mapStateToProps } from './AddCardModalContainer'
import { addCardRequest, startTimer, updateCardRequest } from '../actions/creators'
import { defaultState } from '../fakeData/storeFake'
import { reviewState } from '../fakeData/reviewState'
import { Format } from '../persist/Dao'

jest.mock('../services/API') // Set mock API for module importing

describe('<AnswerCardContainer />', () => {

  let actions = []
  const dispatcher = (action) => {
    actions.push(action)
  }

  beforeEach(function () {
    actions = []
  })

  const ownProps = {editMode: true}

  it('maps state to props', () => {
    const expectedState = {
      editMode: true,
      cardId: reviewState.cardId,
      deckId: reviewState.deckId,
      question: reviewState.question,
      answer: reviewState.answer,
      format: reviewState.format
    }
    const props = mapStateToProps(defaultState, ownProps)

    expect(props).toEqual(expectedState)
  })

  it('maps restart timer', () => {

    const {restartTimer} = mapDispatchToProps(dispatcher, ownProps)
    restartTimer()

    expect(actions).toEqual([startTimer()])
  })

  it('maps add card', () => {

    const deckId = 'deck-1'
    const format = Format.HTML
    const question = 'Some Question'
    const answer = 'Some Answer'

    const expectedActions = [addCardRequest(deckId, format, question, answer)]

    const {addCard} = mapDispatchToProps(dispatcher, ownProps)
    addCard(deckId, format, question, answer)

    expect(actions).toEqual(expectedActions)
  })

  it('maps update card', () => {

    const cardId = 'card-1'
    const deckId = 'deck-1'
    const format = Format.HTML
    const question = 'Some Question'
    const answer = 'Some Answer'

    const expectedActions = [updateCardRequest(deckId, cardId, format, question, answer)]

    const {updateCard} = mapDispatchToProps(dispatcher, ownProps)
    updateCard(deckId, cardId, format, question, answer)

    expect(actions).toEqual(expectedActions)
  })
})
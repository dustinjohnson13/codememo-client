//@flow
import React from 'react'
import { collectionPage, deleteCardRequest } from '../actions/creators'
import { mapDispatchToProps, mapStateToProps } from './ReviewPageContainer'
import { defaultState } from '../fakeData/storeFake'

jest.mock('../services/API') // Set mock API for module importing

describe('<ReviewPageContainer/>', () => {

  let dispatchedActions = []
  const dispatcher = (action) => {
    dispatchedActions.push(action)
  }

  beforeEach(function () {
    dispatchedActions = []
  })

  it('maps deck attributes from state', () => {
    const expectedState = {
      'id': 'deck-1',
      'cardId': 'deck-1-card-30',
      'deckName': 'Deck1',
      'dueCount': 2,
      'newCount': 1,
      'totalCount': 6
    }
    const props = mapStateToProps(defaultState, {})

    expect(props).toEqual(expectedState)

  })

  it('maps back to the appropriate action', () => {

    const props = mapDispatchToProps(dispatcher, {})
    props.back()

    expect(dispatchedActions).toEqual([collectionPage()])
  })

  it('maps delete card', () => {

    const cardId = 'deck-1-card-1'

    const expectedActions = [deleteCardRequest(cardId)]

    const {deleteCard} = mapDispatchToProps(dispatcher, {})
    deleteCard(cardId)

    expect(dispatchedActions).toEqual(expectedActions)
  })
})
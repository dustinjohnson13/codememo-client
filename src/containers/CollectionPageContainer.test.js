//@flow
import React from 'react'
import { mapDispatchToProps, mapStateToProps } from './CollectionPageContainer'
import { collectionState } from '../fakeData/collectionState'
import { addDeckRequest, reviewDeckRequest } from '../actions/creators'
import { defaultState } from '../fakeData/storeFake'

describe('<CollectionPageContainer />', () => {

  it('maps decks from state', () => {
    const expectedDecks = []
    for (let deckId of collectionState.decks) {
      expectedDecks.push(collectionState.decksById[deckId])
    }

    const state = defaultState

    const props = mapStateToProps(state, {})

    expect(props).toEqual({decks: expectedDecks})
  })

  it('maps reviewDeck to the appropriate action', () => {

    const deckId = 'deck-1'
    const expectedActions = [reviewDeckRequest(deckId)]

    const actions = []
    const invoke = (action) => {
      actions.push(action)
    }

    const {reviewDeck} = mapDispatchToProps(invoke, {})
    reviewDeck(deckId)

    expect(actions).toEqual(expectedActions)
  })

  it('maps addDeck to the appropriate action', () => {

    const expectedActions = [addDeckRequest('BrandNew')]

    const actions = []
    const invoke = (action) => {
      actions.push(action)
    }

    const {addDeck} = mapDispatchToProps(invoke, {})
    addDeck('BrandNew')

    expect(actions).toEqual([addDeckRequest('BrandNew')])
  })

})
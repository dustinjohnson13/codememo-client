//@flow
import React from 'react'
import { mapDispatchToProps, mapStateToProps } from './CollectionPageContainer'
import { collectionState } from '../fakeData/collectionState'
import { addDeckRequest, deleteDeckRequest, reviewDeckRequest } from '../actions/creators'
import { defaultState } from '../fakeData/storeFake'

describe('<CollectionPageContainer />', () => {

  let actions = []
  const invoke = (action) => {
    actions.push(action)
  }

  beforeEach(function () {
    actions = []
  })

  it('maps decks from state', () => {
    const expectedDecks = []
    for (let deckId of collectionState.decks) {
      expectedDecks.push(collectionState.decksById[deckId])
    }

    const props = mapStateToProps(defaultState, {})

    expect(props).toEqual({decks: expectedDecks})
  })

  it('maps reviewDeck to the appropriate action', () => {

    const deckId = 'deck-1'
    const expectedActions = [reviewDeckRequest(deckId)]

    const {reviewDeck} = mapDispatchToProps(invoke, {})
    reviewDeck(deckId)

    expect(actions).toEqual(expectedActions)
  })

  it('maps addDeck to the appropriate action', () => {

    const expectedActions = [addDeckRequest('BrandNew')]

    const {addDeck} = mapDispatchToProps(invoke, {})
    addDeck('BrandNew')

    expect(actions).toEqual([addDeckRequest('BrandNew')])
  })

  it('maps deleteDeck to the appropriate action', () => {

    const deckId = 'deck-1'
    const expectedActions = [deleteDeckRequest(deckId)]

    const {deleteDeck} = mapDispatchToProps(invoke, {})
    deleteDeck(deckId)

    expect(actions).toEqual(expectedActions)
  })

})
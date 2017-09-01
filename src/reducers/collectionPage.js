//@flow
import type { Action, CollectionState, DeleteCardSuccessAction } from '../actions/actionTypes'
import {
  ADD_CARD_SUCCESS,
  ADD_DECK_SUCCESS,
  ANSWER_CARD_SUCCESS,
  DELETE_CARD_SUCCESS,
  FETCH_COLLECTION_SUCCESS
} from '../actions/actionTypes'
import { Deck } from '../services/APIDomain'

export const getViewState = (state: CollectionState) => state

export const initialState = {decks: [], decksById: {}}

const collectionPage = (state: CollectionState = initialState, action: Action) => {
  switch (action.type) {
    case FETCH_COLLECTION_SUCCESS:
    case ADD_DECK_SUCCESS:
      const incomingDecks = action.collection.decks
      const incomingDecksById = incomingDecks.reduce((map, deck) => {
        map[deck.id] = deck
        return map
      }, {})
      return getViewState({
        ...state,
        decks: incomingDecks.map(deck => deck.id),
        decksById: incomingDecksById
      })
    case DELETE_CARD_SUCCESS:
      return getViewState(handleDeleteCardSuccess(state, action))
    case ADD_CARD_SUCCESS:
      let decksByIdWithAddedCard = {...state.decksById}
      const deckForAddedCard = decksByIdWithAddedCard[action.deckId]
      if (deckForAddedCard) {
        decksByIdWithAddedCard[action.deckId] = new Deck(deckForAddedCard.id, deckForAddedCard.name,
          deckForAddedCard.totalCount + 1, deckForAddedCard.dueCount, deckForAddedCard.newCount + 1)
      }
      return getViewState({
        ...state,
        decksById: decksByIdWithAddedCard
      })
    case ANSWER_CARD_SUCCESS:
      let decksById = state.decksById
      const deckId = action.deckId
      const deck = decksById[deckId]

      if (deck) {
        let dueCount = deck.dueCount
        let newCount = deck.newCount
        if (deck.dueCount > 0) {
          dueCount--
        } else if (newCount > 0) {
          newCount--
        }

        const newDeck = new Deck(deckId, deck.name, deck.totalCount, dueCount, newCount)
        decksById = {...decksById}
        decksById[deckId] = newDeck
      }
      return getViewState({
        ...state,
        decksById: decksById
      })
    default:
      return state
  }
}

const handleDeleteCardSuccess = (state: CollectionState, action: DeleteCardSuccessAction) => {
  let decksById = state.decksById
  const deckId = action.deck.id
  const deck = decksById[deckId]

  if (deck) {
    let dueCount = deck.dueCount
    let newCount = deck.newCount
    if (deck.dueCount > 0) {
      dueCount--
    } else if (newCount > 0) {
      newCount--
    }

    const newDeck = new Deck(deckId, deck.name, deck.totalCount - 1, dueCount, newCount)
    decksById = {...decksById}
    decksById[deckId] = newDeck
  }
  return {
    ...state,
    decksById: decksById
  }
}

export default collectionPage
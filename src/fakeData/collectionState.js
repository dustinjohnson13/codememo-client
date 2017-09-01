//@flow
import { Deck } from '../services/APIDomain'
import type { CollectionState } from '../actions/actionTypes'

export const collectionState: CollectionState = {
  decks: ['deck-1'],
  decksById: {
    'deck-1': new Deck('deck-1-card-1', 'Deck1', 80, 27, 23)
  }
}
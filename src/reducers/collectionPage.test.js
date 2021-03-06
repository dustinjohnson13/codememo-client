//@flow
import collectionPage, { initialState } from './collectionPage'
import {
  addCardSuccess,
  addDeckSuccess,
  answerCardSuccess,
  deleteCardSuccess,
  fetchCollectionSuccess,
  startTimer,
  updateDeckSuccess
} from '../actions/creators'
import {
  CardDetail,
  CollectionResponse,
  Deck,
  DeckResponse,
  MINUTES_PER_DAY,
  MINUTES_PER_FOUR_DAYS,
  MINUTES_PER_HALF_DAY,
  MINUTES_PER_TWO_DAYS
} from '../services/APIDomain'
import { Format } from '../persist/Dao'

describe('collectionPage', () => {

  const twoDecksWithDueAndNewCards = new CollectionResponse([new Deck('deck1', 'Deck1', 80, 27, 23), new Deck('deck2', 'Deck2', 80, 27, 23)])
  const twoDecksWithDueAndNewCardsState = {
    decks: twoDecksWithDueAndNewCards.decks.map(deck => deck.id),
    decksById: twoDecksWithDueAndNewCards.decks.reduce((map, obj) => {
      map[obj.id] = obj
      return map
    }, {})
  }

  it('adds decks on fetch collection success', () => {
    const previousState = initialState
    const expectedState = twoDecksWithDueAndNewCardsState

    const actualState = collectionPage(previousState, fetchCollectionSuccess(twoDecksWithDueAndNewCards))

    expect(actualState).toEqual(expectedState)
  })

  it('adds decks on add deck success', () => {
    const collection = new CollectionResponse([new Deck('deck1', 'Deck1', 80, 27, 23)])

    const previousState = initialState
    const expectedState = {
      decks: ['deck1'],
      decksById: {'deck1': collection.decks[0]}
    }

    const actualState = collectionPage(previousState, addDeckSuccess(collection))

    expect(actualState).toEqual(expectedState)
  })

  it('renames decks on update deck success', () => {
    const collection = new CollectionResponse([new Deck('deck1', 'Deck1', 80, 27, 23)])

    const previousState = {
      ...initialState,
      decks: ['oldDeck'],
      decksById: {'oldDeck': collection.decks[0]}
    }

    const expectedState = {
      decks: ['deck1'],
      decksById: {'deck1': collection.decks[0]}
    }

    const actualState = collectionPage(previousState, updateDeckSuccess(collection))

    expect(actualState).toEqual(expectedState)
  })

  it('increases new count when a new card is added', () => {
    const initialState = {
      decks: ['deck1', 'deck2'],
      decksById: {
        'deck1': new Deck('deck1', 'Deck1', 80, 27, 23),
        'deck2': new Deck('deck2', 'Deck2', 0, 0, 0)
      }
    }

    const expectedState = {
      decks: ['deck1', 'deck2'],
      decksById: {
        'deck1': new Deck('deck1', 'Deck1', 80, 27, 23),
        'deck2': new Deck('deck2', 'Deck2', 1, 0, 1)
      }
    }

    const action = addCardSuccess(new CardDetail('some-card', 'some question', 'some answer', Format.PLAIN,
      MINUTES_PER_HALF_DAY, MINUTES_PER_DAY, MINUTES_PER_TWO_DAYS, MINUTES_PER_FOUR_DAYS, 9999999), 'deck2')
    const actualState = collectionPage(initialState, action)

    expect(actualState).toEqual(expectedState)
  })

  it('decreases due count when a due card is successfully answer', () => {
    const expectedState = {
      decks: ['deck1', 'deck2'],
      decksById: {
        'deck1': new Deck('deck1', 'Deck1', 80, 27, 23),
        'deck2': new Deck('deck2', 'Deck2', 80, 26, 23)
      }
    }

    const card = new CardDetail('some-card', 'some question', 'some answer', Format.PLAIN,
      MINUTES_PER_HALF_DAY, MINUTES_PER_DAY,
      MINUTES_PER_TWO_DAYS, MINUTES_PER_FOUR_DAYS, 9999999)
    const actualState = collectionPage(twoDecksWithDueAndNewCardsState, answerCardSuccess(card, 'deck2'))

    expect(actualState).toEqual(expectedState)
  })

  it('decreases new count when a due card is successfully answer', () => {
    const previousState = {
      decks: ['deck1', 'deck2'],
      decksById: {'deck1': new Deck('deck1', 'Deck1', 80, 0, 23), 'deck2': new Deck('deck2', 'Deck2', 80, 27, 23)}
    }

    const expectedState = {
      decks: ['deck1', 'deck2'],
      decksById: {'deck1': new Deck('deck1', 'Deck1', 80, 0, 22), 'deck2': new Deck('deck2', 'Deck2', 80, 27, 23)}
    }

    const actualState = collectionPage(previousState, answerCardSuccess(new CardDetail('some-card', 'some question', 'some answer',
      Format.PLAIN, MINUTES_PER_HALF_DAY, MINUTES_PER_DAY, MINUTES_PER_TWO_DAYS, MINUTES_PER_FOUR_DAYS, 9999999), 'deck1'))

    expect(actualState).toEqual(expectedState)
  })

  it('does nothing when a card is successfully answered it cannot find the deck for', () => {
    const previousState = twoDecksWithDueAndNewCardsState
    const expectedState = twoDecksWithDueAndNewCardsState

    const actualState = collectionPage(previousState, answerCardSuccess(new CardDetail('some-card', 'some question', 'some answer',
      Format.PLAIN, MINUTES_PER_HALF_DAY, MINUTES_PER_DAY, MINUTES_PER_TWO_DAYS, MINUTES_PER_FOUR_DAYS, 9999999), 'unknown-deck'))

    expect(actualState).toEqual(expectedState)
  })

  it('does nothing when a card is successfully answered and due/new counts are both zero', () => {
    const previousState = {
      decks: ['deck1', 'deck2'],
      decksById: {'deck1': new Deck('deck1', 'Deck1', 80, 0, 0), 'deck2': new Deck('deck2', 'Deck2', 80, 27, 23)}
    }
    const expectedState = previousState

    const actualState = collectionPage(previousState, answerCardSuccess(new CardDetail('some-card', 'some question', 'some answer',
      Format.PLAIN, MINUTES_PER_HALF_DAY, MINUTES_PER_DAY, MINUTES_PER_TWO_DAYS, MINUTES_PER_FOUR_DAYS, 9999999), 'deck1'))

    expect(actualState).toEqual(expectedState)
  })

  it('decreases total and due counts when a card is deleted', () => {
    const expectedState = {
      decks: ['deck1', 'deck2'],
      decksById: {
        'deck1': new Deck('deck1', 'Deck1', 80, 27, 23),
        'deck2': new Deck('deck2', 'Deck2', 79, 26, 23)
      }
    }

    const deckId = expectedState.decks[1]
    const response = new DeckResponse(deckId, expectedState.decksById[deckId].name, [])

    const actualState = collectionPage(twoDecksWithDueAndNewCardsState, deleteCardSuccess('cardId', response))
    expect(actualState).toEqual(expectedState)
  })

  it('decreases total and new counts when a card is deleted', () => {
    const expectedState = {
      decks: ['deck1', 'deck2'],
      decksById: {
        'deck1': new Deck('deck1', 'Deck1', 80, 27, 23),
        'deck2': new Deck('deck2', 'Deck2', 79, 0, 22)
      }
    }

    const initialState = {
      ...twoDecksWithDueAndNewCardsState,
      decksById: {
        ...twoDecksWithDueAndNewCardsState.decksById,
        'deck2': new Deck('deck2', 'Deck2', 80, 0, 23)
      }
    }

    const deckId = expectedState.decks[1]
    const response = new DeckResponse(deckId, expectedState.decksById[deckId].name, [])

    const actualState = collectionPage(initialState, deleteCardSuccess('cardId', response))
    expect(actualState).toEqual(expectedState)
  })

  it('returns state without change on unsupported action', () => {

    const actualState = collectionPage(initialState, startTimer())

    expect(actualState).toEqual(initialState)
  })
})
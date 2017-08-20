//@flow
import collectionPage, {initialState} from './collectionPage'
import {addCardSuccess, addDeckSuccess, answerCardSuccess, fetchCollectionSuccess} from '../actions/creators'
import {
    CardDetail,
    CollectionResponse,
    Deck,
    FOUR_DAYS_IN_SECONDS,
    HALF_DAY_IN_SECONDS,
    ONE_DAY_IN_SECONDS,
    TWO_DAYS_IN_SECONDS
} from "../services/APIDomain"

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

        const action = addCardSuccess(new CardDetail('some-card', 'some question', 'some answer',
            HALF_DAY_IN_SECONDS, ONE_DAY_IN_SECONDS, TWO_DAYS_IN_SECONDS, FOUR_DAYS_IN_SECONDS, 9999999), 'deck2')
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

        const card = new CardDetail('some-card', 'some question', 'some answer', HALF_DAY_IN_SECONDS,
            ONE_DAY_IN_SECONDS, TWO_DAYS_IN_SECONDS, FOUR_DAYS_IN_SECONDS, 9999999)
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

        const actualState = collectionPage(previousState, answerCardSuccess(new CardDetail('some-card', 'some question', 'some answer', HALF_DAY_IN_SECONDS, ONE_DAY_IN_SECONDS, TWO_DAYS_IN_SECONDS, FOUR_DAYS_IN_SECONDS, 9999999), 'deck1'))

        expect(actualState).toEqual(expectedState)
    })

    it('does nothing when a card is successfully answered it cannot find the deck for', () => {
        const previousState = twoDecksWithDueAndNewCardsState
        const expectedState = twoDecksWithDueAndNewCardsState

        const actualState = collectionPage(previousState, answerCardSuccess(new CardDetail('some-card', 'some question', 'some answer', HALF_DAY_IN_SECONDS, ONE_DAY_IN_SECONDS, TWO_DAYS_IN_SECONDS, FOUR_DAYS_IN_SECONDS, 9999999), 'unknown-deck'))

        expect(actualState).toEqual(expectedState)
    })

    it('does nothing when a card is successfully answered and due/new counts are both zero', () => {
        const previousState = {
            decks: ['deck1', 'deck2'],
            decksById: {'deck1': new Deck('deck1', 'Deck1', 80, 0, 0), 'deck2': new Deck('deck2', 'Deck2', 80, 27, 23)}
        }
        const expectedState = previousState

        const actualState = collectionPage(previousState, answerCardSuccess(new CardDetail('some-card', 'some question', 'some answer', HALF_DAY_IN_SECONDS, ONE_DAY_IN_SECONDS, TWO_DAYS_IN_SECONDS, FOUR_DAYS_IN_SECONDS, 9999999), 'deck1'))

        expect(actualState).toEqual(expectedState)
    })
})
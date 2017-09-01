//@flow
import {
    addCard,
    addCardRequest,
    addCardSuccess,
    answerCard,
    answerCardRequest,
    answerCardSuccess,
    deleteCard,
    deleteCardRequest,
    deleteDeck,
    deleteDeckRequest,
    fetchCardsSuccess,
    fetchCollection,
    fetchCollectionSuccess,
    fetchDeckSuccess,
    loadCollectionPage,
    loadPage,
    reviewDeck,
    reviewDeckRequest,
    startTimer
} from "./creators"
import {call, put, select} from 'redux-saga/effects'
import {
    CardDetail,
    CardDetailResponse,
    CollectionResponse,
    DeckResponse,
    MILLIS_PER_MINUTE,
    MINUTES_PER_DAY,
    MINUTES_PER_FOUR_DAYS,
    MINUTES_PER_HALF_DAY,
    MINUTES_PER_TWO_DAYS
} from "../services/APIDomain"
import {Page} from "./pages"
import * as selectors from './selectors'
import {deckId, deckName, getDeck1DueCards, gotDeck1} from "./creators.test.actions"
import API from '../services/API'
import {collectionState} from "../fakeData/collectionState"
import {initialState} from "../reducers/collectionPage"
import {DUE_IMMEDIATELY, Format, TEST_USER_EMAIL} from "../persist/Dao"
import {reviewState} from "../fakeData/reviewState"

jest.mock('../services/API') // Set mock API for module importing

describe('creators', () => {


    // Still need tests for these two:
    // yield takeEvery(ADD_DECK_REQUEST, addDeck);
    // yield takeEvery(LOAD_COLLECTION_PAGE, loadCollectionPage);

    it('sends delete card request to the API and returns the response', () => {

        const action = deleteCardRequest('card-1')
        const gen = deleteCard(action)
        expect(gen.next().value).toEqual(call(API.deleteDeck, TEST_USER_EMAIL, action.id))

        const response = new DeckResponse('deck-1', "Deck 1", [])

        expect(gen.next(response).value).toEqual(put(fetchDeckSuccess(response)))
    })

    it('sends delete deck request to the API and returns the collection response', () => {

        const action = deleteDeckRequest('deck-1')
        const gen = deleteDeck(action)
        expect(gen.next().value).toEqual(call(API.deleteDeck, TEST_USER_EMAIL, action.id))

        const response = new CollectionResponse([])

        expect(gen.next(response).value).toEqual(put(fetchCollectionSuccess(response)))
    })

    it('sends new card to the API and returns the new card detail', () => {

        const action = addCardRequest('deck-1', Format.HTML, 'Some Question', 'Some Answer')
        const gen = addCard(action)
        expect(gen.next().value).toEqual(call(API.addCard, action.id, action.format, action.question, action.answer))

        const newCard = new CardDetail('deck-1-card-0', 'Some Question', 'Some Answer', Format.HTML, MINUTES_PER_HALF_DAY,
            MINUTES_PER_DAY, MINUTES_PER_TWO_DAYS, MINUTES_PER_FOUR_DAYS, DUE_IMMEDIATELY)

        expect(gen.next(newCard).value).toEqual(put(addCardSuccess(newCard, 'deck-1')))
    })

    it('sends the card answer to the API and returns the new card detail', () => {

        const deckId = 'deck-1'
        const action = answerCardRequest('deck-1-card-0', deckId, 'GOOD')
        const startTime = API.currentTimeMillis() - MILLIS_PER_MINUTE

        const gen = answerCard(action)

        expect(gen.next().value).toEqual(select(selectors.review))
        expect(gen.next({...reviewState, startTime: startTime}).value)
            .toEqual(call(API.answerCard, action.id, startTime, API.currentTimeMillis(), action.answer))

        const newCard = new CardDetail(action.id, 'question', 'answer', Format.PLAIN, MINUTES_PER_HALF_DAY, MINUTES_PER_DAY,
            MINUTES_PER_TWO_DAYS, MINUTES_PER_FOUR_DAYS, 9000)
        expect(gen.next(newCard).value).toEqual(put(answerCardSuccess(newCard, deckId)))
        expect(gen.next(newCard).value).toEqual(put(startTimer()))
    })

    it('loads collection page automatically when collection available', () => {

        const gen = loadCollectionPage()
        expect(gen.next().value).toEqual(select(selectors.collection))

        let next = gen.next(collectionState)
        expect(next.value).toEqual(put(loadPage(Page.COLLECTION)))
    })

    it('loads collection page after fetching collection when its absent', () => {

        const gen = loadCollectionPage()
        expect(gen.next().value).toEqual(select(selectors.collection))

        let next = gen.next(initialState)
        expect(next.value).toEqual(call(fetchCollection))

        next = gen.next(new CollectionResponse([]))
        expect(next.value).toEqual(put(loadPage(Page.COLLECTION)))
    })

    it('fetches deck and loads review page', () => {

        const gen = reviewDeck(reviewDeckRequest(deckId))

        expect(gen.next().value)
            .toEqual(call(API.fetchDeck, deckId))

        expect(gen.next(gotDeck1.deck).value)
            .toEqual(put(gotDeck1))

        expect(gen.next(getDeck1DueCards.ids).value)
            .toEqual(put(getDeck1DueCards))

        expect(gen.next().value).toEqual(put(loadPage(Page.REVIEW)))
        expect(gen.next().value).toEqual(put(startTimer()))
    })

    it('sends no cards fetch response when review deck requested for zero card deck', () => {

        const gen = reviewDeck(reviewDeckRequest(deckId))

        expect(gen.next().value)
            .toEqual(call(API.fetchDeck, deckId))

        const deckResponse = new DeckResponse(deckId, deckName, [])
        expect(gen.next(deckResponse).value)
            .toEqual(put(fetchDeckSuccess(deckResponse)))

        expect(gen.next().value)
            .toEqual(put(fetchCardsSuccess(new CardDetailResponse([]))))

        expect(gen.next().value).toEqual(put(loadPage(Page.REVIEW)))
    })
})
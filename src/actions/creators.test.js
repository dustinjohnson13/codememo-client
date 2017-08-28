//@flow
import {
    addCard,
    addCardRequest,
    addCardSuccess,
    answerCard,
    answerCardRequest,
    answerCardSuccess,
    fetchCardsSuccess,
    fetchCollection,
    fetchDeckSuccess,
    loadCollectionPage,
    loadPage,
    reviewDeck,
    reviewDeckRequest
} from "./creators"
import {call, put, select} from 'redux-saga/effects'
import {
    CardDetail,
    CardDetailResponse,
    CollectionResponse,
    DeckResponse,
    FOUR_DAYS_IN_SECONDS,
    HALF_DAY_IN_SECONDS,
    ONE_DAY_IN_SECONDS, ONE_MINUTE_IN_SECONDS,
    TWO_DAYS_IN_SECONDS
} from "../services/APIDomain"
import {Page} from "./pages"
import * as selectors from './selectors'
import {deckId, deckName, getDeck1DueCards, gotDeck1} from "./creators.test.actions"
import API from '../services/API'
import {collectionState} from "../fakeData/collectionState"
import {initialState} from "../reducers/collectionPage"
import {DUE_IMMEDIATELY} from "../persist/Dao"

jest.mock('../services/API') // Set mock API for module importing

describe('creators', () => {


    // Still need tests for these two:
    // yield takeEvery(ADD_DECK_REQUEST, addDeck);
    // yield takeEvery(LOAD_COLLECTION_PAGE, loadCollectionPage);

    it('sends new card to the API and returns the new card detail', () => {

        const action = addCardRequest('deck-1', 'Some Question', 'Some Answer')
        const gen = addCard(action)
        expect(gen.next().value).toEqual(call(API.addCard, action.id, action.question, action.answer))

        const newCard = new CardDetail('deck-1-card-0', 'Some Question', 'Some Answer', HALF_DAY_IN_SECONDS,
            ONE_DAY_IN_SECONDS, TWO_DAYS_IN_SECONDS, FOUR_DAYS_IN_SECONDS, DUE_IMMEDIATELY)

        expect(gen.next(newCard).value).toEqual(put(addCardSuccess(newCard, 'deck-1')))
    })

    it('sends the card answer to the API and returns the new card detail', () => {

        const startTime = 123456789
        const endTime = startTime + ONE_MINUTE_IN_SECONDS

        const deckId = 'deck-1'
        const action = answerCardRequest('deck-1-card-0', deckId, startTime, endTime, 'GOOD')

        const gen = answerCard(action)
        expect(gen.next().value).toEqual(call(API.answerCard, action.id, startTime, endTime, action.answer))

        const newCard = new CardDetail(action.id, 'question', 'answer', HALF_DAY_IN_SECONDS, ONE_DAY_IN_SECONDS,
            TWO_DAYS_IN_SECONDS, FOUR_DAYS_IN_SECONDS, 9000)
        expect(gen.next(newCard).value).toEqual(put(answerCardSuccess(newCard, deckId)))
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
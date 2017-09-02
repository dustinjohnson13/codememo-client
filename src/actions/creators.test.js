//@flow
import {
  addCard,
  addCardRequest,
  addCardSuccess,
  addDeck,
  addDeckRequest,
  addDeckSuccess,
  answerCard,
  answerCardRequest,
  answerCardSuccess,
  deleteCard,
  deleteCardRequest,
  deleteCardSuccess,
  deleteDeck,
  deleteDeckRequest,
  fetchCards,
  fetchCardsRequest,
  fetchCardsSuccess,
  fetchCollection,
  fetchCollectionRequest,
  fetchCollectionSuccess,
  fetchDeckSuccess,
  loadCollectionPage,
  loadPage,
  login,
  loginRequest,
  loginSuccess,
  reviewDeck,
  reviewDeckRequest,
  saga,
  startTimer,
  updateCard,
  updateCardRequest,
  updateCardSuccess
} from './creators'
import { call, put, select, takeEvery } from 'redux-saga/effects'
import {
  CardDetail,
  CardDetailResponse,
  DeckResponse,
  MILLIS_PER_MINUTE,
  MINUTES_PER_DAY,
  MINUTES_PER_FOUR_DAYS,
  MINUTES_PER_HALF_DAY,
  MINUTES_PER_TWO_DAYS
} from '../services/APIDomain'
import { Page } from './pages'
import * as selectors from './selectors'
import {
  cardDetailResponse,
  deckId,
  deckName,
  getDeck1DueCards,
  gotCollection,
  gotDeck1
} from './creators.test.actions'
import API from '../services/API'
import { collectionState } from '../fakeData/collectionState'
import { initialState } from '../reducers/collectionPage'
import { DUE_IMMEDIATELY, Format, TEST_USER_EMAIL } from '../persist/Dao'
import { reviewState } from '../fakeData/reviewState'
import {
  ADD_CARD_REQUEST,
  ADD_DECK_REQUEST,
  ANSWER_CARD_REQUEST,
  DELETE_CARD_REQUEST,
  DELETE_DECK_REQUEST,
  FETCH_CARDS_REQUEST,
  FETCH_COLLECTION_REQUEST,
  LOAD_COLLECTION_PAGE,
  LOGIN_REQUEST,
  REVIEW_DECK_REQUEST,
  UPDATE_CARD_REQUEST
} from './actionTypes'

jest.mock('../services/API') // Set mock API for module importing

describe('creators', () => {

  it('configures saga appropriately', () => {

    const gen = saga()

    expect(gen.next().value).toEqual(takeEvery(ADD_CARD_REQUEST, addCard))
    expect(gen.next().value).toEqual(takeEvery(UPDATE_CARD_REQUEST, updateCard))
    expect(gen.next().value).toEqual(takeEvery(ANSWER_CARD_REQUEST, answerCard))
    expect(gen.next().value).toEqual(takeEvery(DELETE_DECK_REQUEST, deleteDeck))
    expect(gen.next().value).toEqual(takeEvery(DELETE_CARD_REQUEST, deleteCard))
    expect(gen.next().value).toEqual(takeEvery(REVIEW_DECK_REQUEST, reviewDeck))
    expect(gen.next().value).toEqual(takeEvery(FETCH_CARDS_REQUEST, fetchCards))
    expect(gen.next().value).toEqual(takeEvery(FETCH_COLLECTION_REQUEST, fetchCollection))
    expect(gen.next().value).toEqual(takeEvery(ADD_DECK_REQUEST, addDeck))
    expect(gen.next().value).toEqual(takeEvery(LOGIN_REQUEST, login))
    expect(gen.next().value).toEqual(takeEvery(LOAD_COLLECTION_PAGE, loadCollectionPage))
  })

  it('sends delete card request to the API and returns the response', () => {

    const cardId = 'card-1'
    const action = deleteCardRequest(cardId)
    const gen = deleteCard(action)
    expect(gen.next().value).toEqual(call(API.deleteCard, TEST_USER_EMAIL, action.id))

    const response = new DeckResponse('deck-1', 'Deck 1', [])

    expect(gen.next(response).value).toEqual(put(deleteCardSuccess(cardId, response)))
  })

  it('sends delete deck request to the API and returns the collection response', () => {

    const action = deleteDeckRequest('deck-1')
    const gen = deleteDeck(action)
    expect(gen.next().value).toEqual(call(API.deleteDeck, TEST_USER_EMAIL, action.id))

    const response = gotCollection.collection

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

  it('sends card updates to the API and returns the new card detail', () => {

    const deckId = 'deck-1'
    const cardId = 'deck-1-card-0'

    const action = updateCardRequest(deckId, cardId, Format.HTML, 'Some Question', 'Some Answer')
    const gen = updateCard(action)
    expect(gen.next().value).toEqual(call(API.updateCard, action.id, action.format, action.question, action.answer))

    const updatedCard = new CardDetail(cardId, 'Some Question', 'Some Answer', Format.HTML, MINUTES_PER_HALF_DAY,
      MINUTES_PER_DAY, MINUTES_PER_TWO_DAYS, MINUTES_PER_FOUR_DAYS, DUE_IMMEDIATELY)

    expect(gen.next(updatedCard).value).toEqual(put(updateCardSuccess(updatedCard, 'deck-1')))
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

    const response = gotCollection.collection

    next = gen.next(response)
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

  it('handles login appropriately', () => {
    const email = 'me@here.com'
    const password = 'somepassword'

    const gen = login(loginRequest(email, password))

    expect(gen.next().value).toEqual(call(API.init, false))
    expect(gen.next().value).toEqual(put(loginSuccess(email, password)))
    expect(gen.next().value).toEqual(call(loadCollectionPage))
  })

  it('can add deck', () => {
    const deckName = 'Some New Deck'

    const gen = addDeck(addDeckRequest(deckName))

    expect(gen.next().value).toEqual(call(API.addDeck, TEST_USER_EMAIL, deckName))

    const response = gotCollection.collection
    expect(gen.next(response).value).toEqual(put(addDeckSuccess(response)))
  })

  it('can fetch collection', () => {
    const gen = fetchCollection(fetchCollectionRequest())

    expect(gen.next().value).toEqual(call(API.fetchCollection, TEST_USER_EMAIL))

    const response = gotCollection.collection
    expect(gen.next(response).value).toEqual(put(fetchCollectionSuccess(response)))
  })

  it('can fetch cards', () => {
    const ids = ['1', '2', '3']
    const gen = fetchCards(fetchCardsRequest(ids))

    expect(gen.next().value).toEqual(call(API.fetchCards, ids))

    expect(gen.next(cardDetailResponse).value).toEqual(put(fetchCardsSuccess(cardDetailResponse)))
  })
})
//@flow
import type {
    Action,
    AddCardRequestAction,
    AddCardSuccessAction,
    AddDeckRequestAction,
    AddDeckSuccessAction,
    AnswerCardRequestAction,
    AnswerCardSuccessAction,
    FetchCardsRequestAction,
    FetchCardsSuccessAction,
    FetchCollectionRequestAction,
    FetchCollectionSuccessAction,
    FetchDeckRequestAction,
    FetchDeckSuccessAction,
    HideAnswerAction,
    LoadCollectionPageAction,
    LoadPageAction,
    LoginRequestAction,
    LoginSuccessAction,
    ReviewDeckRequestAction,
    ShowAnswerAction
} from "./actionTypes"
import {
    ADD_CARD_REQUEST,
    ADD_CARD_SUCCESS,
    ADD_DECK_REQUEST,
    ADD_DECK_SUCCESS,
    ANSWER_CARD_REQUEST,
    ANSWER_CARD_SUCCESS,
    FETCH_CARDS_REQUEST,
    FETCH_CARDS_SUCCESS,
    FETCH_COLLECTION_REQUEST,
    FETCH_COLLECTION_SUCCESS,
    FETCH_DECK_REQUEST,
    FETCH_DECK_SUCCESS,
    HIDE_ANSWER,
    LOAD_COLLECTION_PAGE,
    LOAD_PAGE,
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    REVIEW_DECK_REQUEST,
    SHOW_ANSWER
} from "./actionTypes"
import type {PageType} from "./pages"
import {Page} from './pages'
import type {AnswerType} from "../services/APIDomain"
import {CardDetail, CardDetailResponse, CardStatus, CollectionResponse, DeckResponse} from "../services/APIDomain"
import API from '../services/API'
import {call, put, select, takeEvery} from 'redux-saga/effects'
import * as selectors from './selectors'
import {TEST_USER_EMAIL} from "../persist/Dao"
import AWS from "aws-sdk"

export const hideAnswer = (): HideAnswerAction => {
    return {type: HIDE_ANSWER}
}

export const showAnswer = (): ShowAnswerAction => {
    return {type: SHOW_ANSWER}
}

export const loadPage = (page: PageType): LoadPageAction => {
    return {
        type: LOAD_PAGE,
        page: page
    }
}

export const loginPage = (): LoadPageAction => {
    return {
        type: LOAD_PAGE,
        page: Page.LOGIN
    }
}

export const collectionPage = (): LoadCollectionPageAction => {
    return {type: LOAD_COLLECTION_PAGE}
}

export const loginRequest = (email: string, password: string): LoginRequestAction => {
    return {type: LOGIN_REQUEST, email: email, password: password}
}

export const loginSuccess = (email: string, password: string): LoginSuccessAction => {
    return {type: LOGIN_SUCCESS, email: email, password: password}
}

export const fetchCollectionRequest = (): FetchCollectionRequestAction => {
    return {
        type: FETCH_COLLECTION_REQUEST
    }
}

export const fetchCollectionSuccess = (response: CollectionResponse): FetchCollectionSuccessAction => {
    return {
        type: FETCH_COLLECTION_SUCCESS,
        collection: response
    }
}

export const addDeckRequest = (name: string): AddDeckRequestAction => {
    return {
        type: ADD_DECK_REQUEST,
        name
    }
}

export const addDeckSuccess = (response: CollectionResponse): AddDeckSuccessAction => {
    return {
        type: ADD_DECK_SUCCESS,
        collection: response
    }
}

export const reviewDeckRequest = (id: string): ReviewDeckRequestAction => {
    return {
        type: REVIEW_DECK_REQUEST,
        id
    }
}

export const fetchDeckRequest = (id: string): FetchDeckRequestAction => {
    return {
        type: FETCH_DECK_REQUEST,
        id
    }
}

export const fetchDeckSuccess = (response: DeckResponse): FetchDeckSuccessAction => {
    return {
        type: FETCH_DECK_SUCCESS,
        deck: response
    }
}

export const fetchCardsRequest = (ids: Array<string>): FetchCardsRequestAction => {
    return {
        type: FETCH_CARDS_REQUEST,
        ids
    }
}

export const fetchCardsSuccess = (response: CardDetailResponse): FetchCardsSuccessAction => {
    return {
        type: FETCH_CARDS_SUCCESS,
        cards: response.cards
    }
}

export const answerCardRequest = (id: string, deckId: string, answer: AnswerType): AnswerCardRequestAction => {
    return {
        type: ANSWER_CARD_REQUEST,
        id: id,
        deckId: deckId,
        answer: answer
    }
}

export const answerCardSuccess = (response: CardDetail, deckId: string): AnswerCardSuccessAction => {
    return {
        type: ANSWER_CARD_SUCCESS,
        card: response,
        deckId: deckId
    }
}

export const addCardRequest = (id: string, question: string, answer: string): AddCardRequestAction => {
    return {
        type: ADD_CARD_REQUEST,
        id: id,
        answer: answer,
        question: question
    }
}

export const addCardSuccess = (response: CardDetail, deckId: string): AddCardSuccessAction => {
    return {
        type: ADD_CARD_SUCCESS,
        card: response,
        deckId: deckId
    }
}

export function* loadCollectionPage(): Generator<LoadCollectionPageAction, any, void> {
    const collection = yield select(selectors.collection)
    // $FlowFixMe
    if (collection.decks.length === 0) {
        yield call(fetchCollection)
    }
    yield put(loadPage(Page.COLLECTION))
}

export function* login(action: LoginRequestAction): Generator<LoginRequestAction, any, void> {
    // TODO: Eventually do a real form of login
    AWS.config.update({
        ...AWS.config,
        credentials: new AWS.Credentials(action.email, action.password)
    })

    API.init(false)

    yield put(loginSuccess(action.email, action.password))
    yield call(loadCollectionPage)
}

export function* addDeck(action: AddDeckRequestAction): Generator<AddDeckRequestAction, any, void> {
    // TODO: Should be using a collection id or real email
    const deck = yield call(API.addDeck, TEST_USER_EMAIL, action.name)
    // $FlowFixMe
    yield put(addDeckSuccess(deck))
}

export function* addCard(action: AddCardRequestAction): Generator<AddCardRequestAction, any, void> {
    const card = yield call(API.addCard, action.id, action.question, action.answer)
    // $FlowFixMe
    yield put(addCardSuccess(card, action.id))
}

export function* answerCard(action: AnswerCardRequestAction): Generator<AnswerCardRequestAction, any, void> {
    const card = yield call(API.answerCard, action.id, action.answer)
    // $FlowFixMe
    yield put(answerCardSuccess(card, action.deckId))
}

export function* reviewDeck(action: ReviewDeckRequestAction): Generator<ReviewDeckRequestAction, any, void> {
    const deck = yield call(API.fetchDeck, action.id)
    // $FlowFixMe
    yield put(fetchDeckSuccess(deck))

    // $FlowFixMe
    const dueOrNewCards = deck.cards.filter(card => card.status !== CardStatus.OK)
    if (dueOrNewCards.length > 0) {
        yield put(fetchCardsRequest(dueOrNewCards.map(card => card.id)))
    } else {
        yield put(fetchCardsSuccess(new CardDetailResponse([])))
    }

    yield put(loadPage(Page.REVIEW))
}

export function* fetchCollection(action: FetchCollectionRequestAction): Generator<FetchCollectionRequestAction, any, void> {
    // TODO: Should be using real email
    const response = yield call(API.fetchCollection, TEST_USER_EMAIL)
    // $FlowFixMe
    yield put(fetchCollectionSuccess(response))
}

export function* fetchCards(action: FetchCardsRequestAction): Generator<FetchCardsRequestAction, any, void> {
    const response = yield call(API.fetchCards, action.ids)
    // $FlowFixMe
    yield put(fetchCardsSuccess(response))
}

// TODO: Are these the correct generics?
export function* saga(): Generator<Action, any, void> {
    yield takeEvery(ADD_CARD_REQUEST, addCard)
    yield takeEvery(ANSWER_CARD_REQUEST, answerCard)
    yield takeEvery(REVIEW_DECK_REQUEST, reviewDeck)
    yield takeEvery(FETCH_CARDS_REQUEST, fetchCards)
    yield takeEvery(FETCH_COLLECTION_REQUEST, fetchCollection)
    yield takeEvery(ADD_DECK_REQUEST, addDeck)
    yield takeEvery(LOGIN_REQUEST, login)
    yield takeEvery(LOAD_COLLECTION_PAGE, loadCollectionPage)
}
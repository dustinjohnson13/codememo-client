//@flow
import type {
    Action,
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
    LoadCollectionPageAction,
    LoadPageAction,
    ReviewDeckRequestAction
} from "./actionTypes";
import {
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
    LOAD_COLLECTION_PAGE,
    LOAD_PAGE,
    REVIEW_DECK_REQUEST
} from "./actionTypes"
import type {PageType} from "./pages";
import {Page} from './pages'
import {CardDetail, CardDetailResponse, CollectionResponse, DeckResponse} from "../services/APIDomain";
import API from '../services/API'
import {call, put, select, takeEvery} from 'redux-saga/effects'
import * as selectors from './selectors';

export const loadPage = (page: PageType): LoadPageAction => {
    return {
        type: LOAD_PAGE,
        page: page
    }
};

export const collectionPage = (): LoadCollectionPageAction => {
    return {type: LOAD_COLLECTION_PAGE};
};

export const fetchCollectionRequest = (): FetchCollectionRequestAction => {
    return {
        type: FETCH_COLLECTION_REQUEST
    }
};

export const fetchCollectionSuccess = (response: CollectionResponse): FetchCollectionSuccessAction => {
    return {
        type: FETCH_COLLECTION_SUCCESS,
        collection: response
    }
};

export const addDeckRequest = (name: string): AddDeckRequestAction => {
    return {
        type: ADD_DECK_REQUEST,
        name
    }
};

export const addDeckSuccess = (response: CollectionResponse): AddDeckSuccessAction => {
    return {
        type: ADD_DECK_SUCCESS,
        collection: response
    };
};

export const reviewDeckRequest = (name: string): ReviewDeckRequestAction => {
    return {
        type: REVIEW_DECK_REQUEST,
        name
    }
};

export const fetchDeckRequest = (name: string): FetchDeckRequestAction => {
    return {
        type: FETCH_DECK_REQUEST,
        name
    }
};

export const fetchDeckSuccess = (response: DeckResponse): FetchDeckSuccessAction => {
    return {
        type: FETCH_DECK_SUCCESS,
        deck: response
    }
};

export const fetchCardsRequest = (ids: Array<string>): FetchCardsRequestAction => {
    return {
        type: FETCH_CARDS_REQUEST,
        ids
    }
};

export const fetchCardsSuccess = (response: CardDetailResponse): FetchCardsSuccessAction => {
    return {
        type: FETCH_CARDS_SUCCESS,
        cards: response.cards
    }
};

export const answerCardRequest = (id: string, answer: string): AnswerCardRequestAction => {
    return {
        type: ANSWER_CARD_REQUEST,
        id: id,
        answer: answer
    }
};

export const answerCardSuccess = (response: CardDetail): AnswerCardSuccessAction => {
    return {
        type: ANSWER_CARD_SUCCESS,
        card: response
    }
};

export function* loadCollectionPage(): Generator<LoadCollectionPageAction, any, void> {
    const collection = yield select(selectors.collection);
    //$FlowFixMe
    if (!collection.decks) {
        yield call(fetchCollection);
        yield put(loadPage(Page.COLLECTION));
    } else {
        yield put(loadPage(Page.COLLECTION));
    }
}

export function* addDeck(action: AddDeckRequestAction): Generator<AddDeckRequestAction, any, void> {
    const deck = yield call(addDeckFunc, action.name);
    // $FlowFixMe
    yield put(addDeckSuccess(deck));
}

// TODO: Use channels instead of promises?: https://github.com/redux-saga/redux-saga/issues/508
export function addDeckFunc(name: string): DeckResponse {
    return API.addDeck(name);
}

export function answerCardFunc(id: string, answer: string) {
    return API.answerCard(id, answer);
}

export function fetchDeckFunc(name: string): DeckResponse {
    return API.fetchDeck(name);
}

export function fetchCardsFunc(ids: Array<string>): CardDetailResponse {
    return API.fetchCards(ids);
}

export function fetchCollectionFuncs(): CollectionResponse {
    return API.fetchCollection();
}

export function* answerCard(action: AnswerCardRequestAction): Generator<AnswerCardRequestAction, any, void> {
    const card = yield call(answerCardFunc, action.id, action.answer);
    // $FlowFixMe
    yield put(answerCardSuccess(card));
}

const CARDS_TO_RETRIEVE_PER_REQUEST = 10;

export function* reviewDeck(action: ReviewDeckRequestAction): Generator<ReviewDeckRequestAction, any, void> {
    const deck = yield call(fetchDeckFunc, action.name);
    // $FlowFixMe
    yield put(fetchDeckSuccess(deck));

    // $FlowFixMe
    const dueOrNewCards = deck.cards.filter(card => card.status !== 'OK');
    if (dueOrNewCards.length > 0) {
        const cardsToRetrieve = dueOrNewCards.slice(0, CARDS_TO_RETRIEVE_PER_REQUEST)
            .reduce((ids, card) => ids.concat(card.id), []);
        yield put(fetchCardsRequest(cardsToRetrieve));
    }

    yield put(loadPage(Page.REVIEW));
}

export function* fetchCollection(action: FetchCollectionRequestAction): Generator<FetchCollectionRequestAction, any, void> {
    const response = yield call(fetchCollectionFuncs);
    // $FlowFixMe
    yield put(fetchCollectionSuccess(response));
}

export function* fetchCards(action: FetchCardsRequestAction): Generator<FetchCardsRequestAction, any, void> {
    const response = yield call(fetchCardsFunc, action.ids);
    // $FlowFixMe
    yield put(fetchCardsSuccess(response));
}

// TODO: Are these the correct generics?
export function* saga(): Generator<Action, any, void> {
    yield takeEvery(ANSWER_CARD_REQUEST, answerCard);
    yield takeEvery(REVIEW_DECK_REQUEST, reviewDeck);
    yield takeEvery(FETCH_CARDS_REQUEST, fetchCards);
    yield takeEvery(FETCH_COLLECTION_REQUEST, fetchCollection);
    yield takeEvery(ADD_DECK_REQUEST, addDeck);
    yield takeEvery(LOAD_COLLECTION_PAGE, loadCollectionPage);
}
//@flow
import type {
    AddDeckRequestAction,
    AddDeckSuccessAction,
    AnswerCardRequestAction,
    AnswerCardSuccessAction,
    Dispatch,
    FetchCardsRequestAction,
    FetchCardsSuccessAction,
    FetchCollectionRequestAction,
    FetchCollectionSuccessAction,
    FetchDeckRequestAction,
    FetchDeckSuccessAction,
    LoadPageAction
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
    LOAD_PAGE
} from "./actionTypes"
import type {PageType} from "./pages";
import {Page} from './pages'
import {CardDetail, CardDetailResponse, CollectionResponse, DeckResponse} from "../services/APIDomain";
import type {DataService} from "../services/DataService";
import {fetchDeck} from './creators.thunk'

export const loadPage = (page: PageType): LoadPageAction => {
    return {
        type: LOAD_PAGE,
        page: page
    }
};

export const collectionPage = (): LoadPageAction => {
    return loadPage(Page.COLLECTION);
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

export function reviewDeck(dataService: DataService, name: string) {
    return function (dispatch: Dispatch, getState: Function) {
        return new Promise((resolve, reject) => {
            dispatch(fetchDeck(dataService, name))
        }).then(() => dispatch(loadPage(Page.REVIEW)))
    }
}

export function addDeck(dataService: DataService, name: string) {
    return function (dispatch: Dispatch) {

        dispatch(addDeckRequest(name));

        return dataService.addDeck(name)
            .then(collection => dispatch(addDeckSuccess(collection)))
    }
}

export function answerCard(dataService: DataService, id: string, answer: string) {
    return function (dispatch: Dispatch) {

        dispatch(answerCardRequest(id, answer));

        return dataService.answerCard(id, answer)
            .then(card => {
                dispatch(answerCardSuccess(card))
            })
    }
}

export function fetchCollection(dataService: DataService) {
    return function (dispatch: Dispatch) {
        dispatch(fetchCollectionRequest());

        return dataService.fetchCollection()
            .then((response: CollectionResponse) =>
                dispatch(fetchCollectionSuccess(response)))

    }
}

export function fetchCards(dataService: DataService, ids: Array<string>) {
    return function (dispatch: Dispatch): Promise<FetchCardsSuccessAction> {

        dispatch(fetchCardsRequest(ids));

        return dataService.fetchCards(ids).then((response: CardDetailResponse) =>
            dispatch(fetchCardsSuccess(response))
        );
    }
}
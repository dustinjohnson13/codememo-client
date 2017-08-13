//@flow
import {
    addCard,
    addCardRequest,
    addCardSuccess,
    answerCard,
    answerCardRequest,
    answerCardSuccess,
    fetchCollection,
    loadCollectionPage,
    loadPage,
    reviewDeck,
    reviewDeckRequest
} from "./creators";
import {call, put, select} from 'redux-saga/effects'
import {CardDetail, CollectionResponse} from "../services/APIDomain";
import {Page} from "./pages";
import * as selectors from './selectors'
import {deckId, getDeck1DueCards, gotDeck1} from "./creators.test.actions";
import API from '../services/API';

jest.mock('../services/API'); // Set mock API for module importing

describe('creators', () => {


    // Still need tests for these two:
    // yield takeEvery(ADD_DECK_REQUEST, addDeck);
    // yield takeEvery(LOAD_COLLECTION_PAGE, loadCollectionPage);

    it('sends new card to the API and returns the new card detail', () => {

        const action = addCardRequest('deck-1', 'Some Question', 'Some Answer');
        const gen = addCard(action);
        expect(gen.next().value).toEqual(call(API.addCard, action.id, action.question, action.answer));

        const newCard = new CardDetail('deck-1-card-0', 'Some Question', 'Some Answer', null);
        //$FlowFixMe
        expect(gen.next(newCard).value).toEqual(put(addCardSuccess(newCard)));
    });

    it('sends the card answer to the API and returns the new card detail', () => {

        const action = answerCardRequest('deck-1-card-0', 'GOOD');
        const gen = answerCard(action);
        expect(gen.next().value).toEqual(call(API.answerCard, action.id, action.answer));

        const newCard = new CardDetail(action.id, 'question', 'answer', 9000);
        //$FlowFixMe
        expect(gen.next(newCard).value).toEqual(put(answerCardSuccess(newCard)));
    });

    it('loads collection page automatically when collection available', () => {

        const gen = loadCollectionPage();
        expect(gen.next().value).toEqual(select(selectors.collection));

        //$FlowFixMe
        let next = gen.next(new CollectionResponse([]));
        expect(next.value).toEqual(put(loadPage(Page.COLLECTION)));
    });

    it('loads collection page after fetching collection when its absent', () => {

        const gen = loadCollectionPage();
        expect(gen.next().value).toEqual(select(selectors.collection));

        //$FlowFixMe
        let next = gen.next({decks: null});
        expect(next.value).toEqual(call(fetchCollection));

        //$FlowFixMe
        next = gen.next(new CollectionResponse([]));
        expect(next.value).toEqual(put(loadPage(Page.COLLECTION)));
    });

    it('fetches deck and loads review page', () => {

        const gen = reviewDeck(reviewDeckRequest(deckId));

        expect(gen.next().value)
            .toEqual(call(API.fetchDeck, deckId));

        //$FlowFixMe
        expect(gen.next(gotDeck1.deck).value)
            .toEqual(put(gotDeck1));

        //$FlowFixMe
        expect(gen.next(getDeck1DueCards.ids).value)
            .toEqual(put(getDeck1DueCards));

        expect(gen.next().value).toEqual(put(loadPage(Page.REVIEW)));
    });
});
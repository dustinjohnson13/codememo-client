import app from './app';
import {
    fetchCollectionRequest,
    fetchCollectionSuccess,
    fetchDeckRequest,
    fetchDeckSuccess,
    loadPage
} from '../actions/index'
import {COLLECTION, REVIEW} from "../actions/pages"

describe('app', () => {
    it('nullifies page while fetching decks', () => {
        const previousState = {page: COLLECTION};
        const expectedState = {page: null};

        const actualState = app(previousState, fetchDeckRequest());

        expect(actualState).toEqual(expectedState);
    });

    it('nullifies page while fetching the collection', () => {
        const previousState = {page: COLLECTION};
        const expectedState = {page: null};

        const actualState = app(previousState, fetchCollectionRequest());

        expect(actualState).toEqual(expectedState);
    });

    it('sets page to CollectionPage on fetch collection success', () => {
        const previousState = {page: null};
        const expectedState = {page: COLLECTION};

        const actualState = app(previousState, fetchCollectionSuccess());

        expect(actualState).toEqual(expectedState);
    });

    it('sets page to ReviewPage on fetch deck success', () => {
        const previousState = {page: null};
        const expectedState = {page: REVIEW};

        const actualState = app(previousState, fetchDeckSuccess());

        expect(actualState).toEqual(expectedState);
    });

    it('sets page to requested target on load page', () => {
        const previousState = {page: null};
        const expectedState = {page: REVIEW};

        const actualState = app(previousState, loadPage(REVIEW));

        expect(actualState).toEqual(expectedState);
    });
});
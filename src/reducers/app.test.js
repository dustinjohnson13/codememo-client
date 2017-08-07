import app from './app';
import {
    fetchCollectionRequest,
    fetchCollectionSuccess,
    fetchDeckRequest,
    fetchDeckSuccess,
    loadPage
} from '../actions/index'

describe('app', () => {
    it('nullifies page while fetching decks', () => {
        const previousState = {page: 'CollectionPage'};
        const expectedState = {page: null};

        const actualState = app(previousState, fetchDeckRequest());

        expect(actualState).toEqual(expectedState);
    });

    it('nullifies page while fetching the collection', () => {
        const previousState = {page: 'CollectionPage'};
        const expectedState = {page: null};

        const actualState = app(previousState, fetchCollectionRequest());

        expect(actualState).toEqual(expectedState);
    });

    it('sets page to CollectionPage on fetch collection success', () => {
        const previousState = {page: null};
        const expectedState = {page: 'CollectionPage'};

        const actualState = app(previousState, fetchCollectionSuccess());

        expect(actualState).toEqual(expectedState);
    });

    it('sets page to ReviewPage on fetch deck success', () => {
        const previousState = {page: null};
        const expectedState = {page: 'ReviewPage'};

        const actualState = app(previousState, fetchDeckSuccess());

        expect(actualState).toEqual(expectedState);
    });

    it('sets page to requested target on load page', () => {
        const previousState = {page: null};
        const expectedState = {page: 'ReviewPage'};

        const actualState = app(previousState, loadPage('ReviewPage'));

        expect(actualState).toEqual(expectedState);
    });
});
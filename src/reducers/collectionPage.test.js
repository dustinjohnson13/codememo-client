import collectionPage from './collectionPage';
import {addDeckSuccess, fetchCollectionSuccess} from '../actions/index'

describe('collectionPage', () => {

    it('adds decks on fetch collection success', () => {
        const collection = {decks: [{name: 'deck1'}]};

        const previousState = {collection: null};
        const expectedState = {decks: collection.decks};

        const actualState = collectionPage(previousState, fetchCollectionSuccess(collection));

        expect(actualState).toEqual(expectedState);
    });

    it('adds decks on add deck success', () => {
        const collection = {decks: [{name: 'deck1'}]};

        const previousState = {collection: null};
        const expectedState = {decks: collection.decks};

        const actualState = collectionPage(previousState, addDeckSuccess(collection));

        expect(actualState).toEqual(expectedState);
    });

});
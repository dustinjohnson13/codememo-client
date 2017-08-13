//@flow
import collectionPage from './collectionPage';
import {addDeckSuccess, fetchCollectionSuccess} from '../actions/creators'
import {CollectionResponse, Deck} from "../services/APIDomain";

describe('collectionPage', () => {

    it('adds decks on fetch collection success', () => {
        const collection = new CollectionResponse([new Deck('deck1', 'Deck1', 80, 27, 23)]);

        const previousState = {decks: null};
        const expectedState = {decks: collection.decks};

        const actualState = collectionPage(previousState, fetchCollectionSuccess(collection));

        expect(actualState).toEqual(expectedState);
    });

    it('adds decks on add deck success', () => {
        const collection = new CollectionResponse([new Deck('deck1', 'Deck1', 80, 27, 23)]);

        const previousState = {decks: null};
        const expectedState = {decks: collection.decks};

        const actualState = collectionPage(previousState, addDeckSuccess(collection));

        expect(actualState).toEqual(expectedState);
    });

});
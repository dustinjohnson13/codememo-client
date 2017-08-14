//@flow
import collectionPage from './collectionPage';
import {addDeckSuccess, answerCardSuccess, fetchCollectionSuccess} from '../actions/creators'
import {CardDetail, CollectionResponse, Deck} from "../services/APIDomain";

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

    it('decreases due count when a due card is successfully answer', () => {
        const previousState = {decks: [new Deck('deck1', 'Deck1', 80, 27, 23), new Deck('deck2', 'Deck2', 80, 27, 23)]};
        const expectedState = {decks: [new Deck('deck1', 'Deck1', 80, 27, 23), new Deck('deck2', 'Deck2', 80, 26, 23)]};

        const actualState = collectionPage(previousState, answerCardSuccess(new CardDetail('some-card', 'some question', 'some answer', 9999999), 'deck2'));

        expect(actualState).toEqual(expectedState);
    });

    it('decreases new count when a due card is successfully answer', () => {
        const previousState = {decks: [new Deck('deck1', 'Deck1', 80, 0, 23), new Deck('deck2', 'Deck2', 80, 27, 23)]};
        const expectedState = {decks: [new Deck('deck1', 'Deck1', 80, 0, 22), new Deck('deck2', 'Deck2', 80, 27, 23)]};

        const actualState = collectionPage(previousState, answerCardSuccess(new CardDetail('some-card', 'some question', 'some answer', 9999999), 'deck1'));

        expect(actualState).toEqual(expectedState);
    });

    it('does nothing when a card is successfully answered it cannot find the deck for', () => {
        const previousState = {decks: [new Deck('deck1', 'Deck1', 80, 0, 23), new Deck('deck2', 'Deck2', 80, 27, 23)]};
        const expectedState = {decks: [new Deck('deck1', 'Deck1', 80, 0, 23), new Deck('deck2', 'Deck2', 80, 27, 23)]};

        const actualState = collectionPage(previousState, answerCardSuccess(new CardDetail('some-card', 'some question', 'some answer', 9999999), 'unknown-deck'));

        expect(actualState).toEqual(expectedState);
    });

    it('does nothing when a card is successfully answered and due/new counts are both zero', () => {
        const previousState = {decks: [new Deck('deck1', 'Deck1', 80, 0, 0), new Deck('deck2', 'Deck2', 80, 27, 23)]};
        const expectedState = {decks: [new Deck('deck1', 'Deck1', 80, 0, 0), new Deck('deck2', 'Deck2', 80, 27, 23)]};

        const actualState = collectionPage(previousState, answerCardSuccess(new CardDetail('some-card', 'some question', 'some answer', 9999999), 'deck1'));

        expect(actualState).toEqual(expectedState);
    });
});
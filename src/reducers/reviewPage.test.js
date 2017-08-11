import reviewPage from './reviewPage';
import {answerCardSuccess, fetchCardsSuccess, fetchDeckSuccess} from '../actions/creators'
import {answerCard} from '../actions/creators.thunk.js'
import {GOOD} from '../Domain'
import {CardDetail, CardDetailResponse, DeckResponse} from "../services/APIDomain";

describe('reviewPage', () => {

    const expectedDeckName = 'My Deck';
    const expectedDeckID = 'deck1';

    const cards = [{id: 'deck-1-card-32', status: 'NEW'},
        {id: 'deck-1-card-30', status: 'DUE'}, {id: 'deck-1-card-31', status: 'DUE'},
        {id: '5', status: 'OK'}, {id: '6', status: 'OK'}];
    const deck = new DeckResponse(expectedDeckID, expectedDeckName, cards);

    it('adds deck information on fetch deck success', () => {

        const previousState = {toReview: []};
        const expectedState = {
            deck: deck, answer: '', question: '', toReview: [],
            deckName: expectedDeckName, totalCount: 5, newCount: 1, dueCount: 2,
            failInterval: '10m', hardInterval: '1d', goodInterval: '3d', easyInterval: '5d'
        };

        const action = fetchDeckSuccess(deck);
        const actualState = reviewPage(previousState, action);

        expect(actualState).toEqual(expectedState);
    });

    it('adds question and answer on fetch cards success', () => {

        const cardDetails = [new CardDetail('deck-1-card-30', 'Question Number 30?', 'Answer Number 30', -299999),
            new CardDetail('deck-1-card-31', 'Question Number 31?', 'Answer Number 31', -309999),
            new CardDetail('deck-1-card-32', 'Question Number 32?', 'Answer Number 32', null)];
        const cardsResponse = new CardDetailResponse(cardDetails);

        const previousState = {deck: deck};
        const expectedState = {
            deck: deck,
            answer: "Answer Number 30",
            question: "Question Number 30?",
            deckName: expectedDeckName,
            dueCount: 2,
            easyInterval: "5d",
            failInterval: "10m",
            goodInterval: "3d",
            hardInterval: "1d",
            newCount: 1,
            totalCount: 5,
            toReview: cardsResponse.cards
        };

        const action = fetchCardsSuccess(cardsResponse);
        const actualState = reviewPage(previousState, action);

        expect(actualState).toEqual(expectedState);
    });

    it('loads next question and answer on answer card', () => {

        const previousState = {
            deck: deck,
            answer: "Answer Number 30",
            question: "Question Number 30?",
            deckName: expectedDeckName,
            dueCount: 2,
            easyInterval: "5d",
            failInterval: "10m",
            goodInterval: "3d",
            hardInterval: "1d",
            newCount: 1,
            totalCount: 5,
            toReview: [{
                id: 'deck-1-card-30',
                question: 'Question Number 30?',
                answer: 'Answer Number 30',
                due: -299999
            }, {
                id: 'deck-1-card-31',
                question: 'Question Number 31?',
                answer: 'Answer Number 31',
                due: -309999
            }, {
                id: 'deck-1-card-32',
                question: 'Question Number 32?',
                answer: 'Answer Number 32',
                due: null
            }]
        };

        const expectedCards = [{id: 'deck-1-card-32', status: 'NEW'},
            {id: 'deck-1-card-31', status: 'DUE'},
            {id: '5', status: 'OK'}, {id: '6', status: 'OK'}, {id: 'deck-1-card-30', status: 'OK'}];
        const expectedDeck = {id: expectedDeckID, name: expectedDeckName, cards: expectedCards};

        const expectedState = {
            answer: "Answer Number 31",
            deckName: expectedDeckName,
            deck: expectedDeck,
            question: "Question Number 31?",
            dueCount: 1,
            easyInterval: "5d",
            failInterval: "10m",
            goodInterval: "3d",
            hardInterval: "1d",
            newCount: 1,
            totalCount: 5,
            toReview: [{
                id: 'deck-1-card-31',
                question: 'Question Number 31?',
                answer: 'Answer Number 31',
                due: -309999
            }, {
                id: 'deck-1-card-32',
                question: 'Question Number 32?',
                answer: 'Answer Number 32',
                due: null
            }]
        };

        const actualState = reviewPage(previousState, answerCardSuccess({
            id: 'deck-1-card-30',
            question: 'Question Number 30?',
            answer: 'Answer Number 30',
            due: 86400
        }, GOOD));

        expect(actualState).toEqual(expectedState);
    });

});
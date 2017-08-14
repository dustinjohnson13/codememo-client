//@flow
import reviewPage, {initialState} from './reviewPage';
import {
    addCardSuccess,
    answerCardSuccess,
    fetchCardsSuccess,
    fetchDeckSuccess,
    hideAnswer,
    showAnswer
} from '../actions/creators'
import {Card, CardDetail, CardDetailResponse, DeckResponse} from "../services/APIDomain";

describe('reviewPage', () => {

    const expectedDeckName = 'My Deck';
    const expectedDeckID = 'deck1';

    const cards = [new Card('deck-1-card-32', 'NEW'),
        new Card('deck-1-card-30', 'DUE'), new Card('deck-1-card-31', 'DUE'),
        new Card('5', 'OK'), new Card('6', 'OK')];
    const deck = new DeckResponse(expectedDeckID, expectedDeckName, cards);

    const addCardResponse = new CardDetail('deck-1-card-99', 'Some Question', 'Some Answer', null);


    it('adds new card on add card success', () => {

        const response = addCardResponse;

        const previousState = {
            ...initialState,
            deck: deck,
            totalCount: 5,
            newCount: 1,
            dueCount: 2,
            toReview: [
                new CardDetail('deck-1-card-30', 'Question Number 30?', 'Answer Number 30', -299999),
                new CardDetail('deck-1-card-31', 'Question Number 31?', 'Answer Number 31', -309999),
                new CardDetail('deck-1-card-32', 'Question Number 32?', 'Answer Number 32', null)
            ]
        };

        const newCards = [...cards, new Card('deck-1-card-99', 'NEW')];
        const expectedDeck = new DeckResponse(expectedDeckID, expectedDeckName, newCards);
        const expectedToReview = [...previousState.toReview, response];

        const action = addCardSuccess(response);
        const actualState = reviewPage(previousState, action);

        expect(actualState.deck).toEqual(expectedDeck);
        expect(actualState.totalCount).toEqual(6);
        expect(actualState.newCount).toEqual(2);
        expect(actualState.dueCount).toEqual(2);
        expect(actualState.toReview).toEqual(expectedToReview);
    });

    it('hides answer when requested', () => {

        const previousState = {
            ...initialState,
            deck: deck,
            totalCount: 5,
            newCount: 1,
            dueCount: 2,
            toReview: [
                new CardDetail('deck-1-card-30', 'Question Number 30?', 'Answer Number 30', -299999),
                new CardDetail('deck-1-card-31', 'Question Number 31?', 'Answer Number 31', -309999),
                new CardDetail('deck-1-card-32', 'Question Number 32?', 'Answer Number 32', null)
            ],
            showingAnswer: true
        };

        const action = hideAnswer();
        const actualState = reviewPage(previousState, action);

        expect(actualState.showingAnswer).toEqual(false);
    });

    it('shows answer when requested', () => {

        const previousState = {
            ...initialState,
            deck: deck,
            totalCount: 5,
            newCount: 1,
            dueCount: 2,
            toReview: [
                new CardDetail('deck-1-card-30', 'Question Number 30?', 'Answer Number 30', -299999),
                new CardDetail('deck-1-card-31', 'Question Number 31?', 'Answer Number 31', -309999),
                new CardDetail('deck-1-card-32', 'Question Number 32?', 'Answer Number 32', null)
            ],
            showingAnswer: false
        };

        const action = showAnswer();
        const actualState = reviewPage(previousState, action);

        expect(actualState.showingAnswer).toEqual(true);
    });

    it('adds deck information on fetch deck success', () => {

        const previousState = {...initialState};
        const expectedState =
            {
                deck: deck, answer: '', question: '', toReview: [], showingAnswer: false,
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

        const previousState = {...initialState, deck: deck};
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
            toReview: cardsResponse.cards,
            showingAnswer: false
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
            toReview: [new CardDetail(
                'deck-1-card-30',
                'Question Number 30?',
                'Answer Number 30',
                -299999
            ), new CardDetail('deck-1-card-31',
                'Question Number 31?',
                'Answer Number 31',
                -309999
            ), new CardDetail('deck-1-card-32',
                'Question Number 32?',
                'Answer Number 32',
                null)],
            showingAnswer: false
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
            }],
            showingAnswer: false
        };

        const action = answerCardSuccess(new CardDetail('deck-1-card-30', 'Question Number 30?', 'Answer Number 30', 86400), 'deck-1');
        const actualState = reviewPage(previousState, action);

        expect(actualState).toEqual(expectedState);
    });

});
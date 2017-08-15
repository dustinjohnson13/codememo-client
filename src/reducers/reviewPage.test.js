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
            totalCount: 5,
            dueCards: [
                new CardDetail('deck-1-card-30', 'Question Number 30?', 'Answer Number 30', -299999),
                new CardDetail('deck-1-card-31', 'Question Number 31?', 'Answer Number 31', -309999)
            ],
            newCards: [
                new CardDetail('deck-1-card-32', 'Question Number 32?', 'Answer Number 32', null)
            ]
        };

        const expectedDueCards = previousState.dueCards;
        const expectedNewCards = [...previousState.newCards, response];

        const action = addCardSuccess(response, 'deck-1');
        const actualState = reviewPage(previousState, action);

        expect(actualState.totalCount).toEqual(6);
        expect(actualState.dueCards).toEqual(expectedDueCards);
        expect(actualState.newCards).toEqual(expectedNewCards);
    });

    it('adds question/answer on add card success if there are no cards for review', () => {

        const response = addCardResponse;

        const previousState = {
            ...initialState,
            question: '',
            answer: '',
            dueCards: [],
            newCards: []
        };

        const action = addCardSuccess(response, 'deck-1');
        const actualState = reviewPage(previousState, action);

        expect(actualState.question).toEqual(response.question);
        expect(actualState.answer).toEqual(response.answer);
    });

    it('hides answer when requested', () => {

        const previousState = {
            ...initialState,
            showingAnswer: true
        };

        const action = hideAnswer();
        const actualState = reviewPage(previousState, action);

        expect(actualState.showingAnswer).toEqual(false);
    });

    it('shows answer when requested', () => {

        const previousState = {
            ...initialState,
            showingAnswer: false
        };

        const action = showAnswer();
        const actualState = reviewPage(previousState, action);

        expect(actualState.showingAnswer).toEqual(true);
    });

    it('adds deck information on fetch deck success', () => {

        const previousState = {...initialState};
        // TODO: Breakup the deck instance
        const expectedState =
            {
                ...previousState,
                deckName: expectedDeckName, deckId: expectedDeckID,
                totalCount: 5
            };

        const action = fetchDeckSuccess(deck);
        const actualState = reviewPage(previousState, action);

        expect(actualState).toEqual(expectedState);
    });

    it('adds question, answer, answer intervals, and cards for review on fetch cards success', () => {

        const cardDetails = [new CardDetail('deck-1-card-30', 'Question Number 30?', 'Answer Number 30', -299999),
            new CardDetail('deck-1-card-31', 'Question Number 31?', 'Answer Number 31', -309999),
            new CardDetail('deck-1-card-32', 'Question Number 32?', 'Answer Number 32', null)];
        const cardsResponse = new CardDetailResponse(cardDetails);

        const previousState = {...initialState};
        const expectedState = {
            ...previousState,
            dueCards: [
                new CardDetail('deck-1-card-30', 'Question Number 30?', 'Answer Number 30', -299999),
                new CardDetail('deck-1-card-31', 'Question Number 31?', 'Answer Number 31', -309999)
            ],
            newCards: [
                new CardDetail('deck-1-card-32', 'Question Number 32?', 'Answer Number 32', null)
            ],
            answer: "Answer Number 30",
            question: "Question Number 30?",
            cardId: 'deck-1-card-30',
            easyInterval: "5d",
            failInterval: "10m",
            goodInterval: "3d",
            hardInterval: "1d"
        };

        const action = fetchCardsSuccess(cardsResponse);
        const actualState = reviewPage(previousState, action);

        expect(actualState).toEqual(expectedState);
    });

    it('resets answer card state on answer card', () => {

        const previousState = {
            ...initialState,
            answer: "Answer Number 30",
            question: "Question Number 30?",
            cardId: 'deck-1-card-30',
            totalCount: 5,
            dueCards: [new CardDetail(
                'deck-1-card-30',
                'Question Number 30?',
                'Answer Number 30',
                -299999
            ), new CardDetail('deck-1-card-31',
                'Question Number 31?',
                'Answer Number 31',
                -309999
            )],
            newCards: [
                new CardDetail('deck-1-card-32',
                    'Question Number 32?',
                    'Answer Number 32',
                    null)
            ],
            showingAnswer: true
        };

        const expectedDueCards = previousState.dueCards.slice(1);

        const expectedState = {
            ...previousState,
            answer: "Answer Number 31",
            question: "Question Number 31?",
            cardId: 'deck-1-card-31',
            totalCount: 5,
            dueCards: expectedDueCards,
            showingAnswer: false
        };

        const action = answerCardSuccess(new CardDetail('deck-1-card-30', 'Question Number 30?', 'Answer Number 30', 86400), 'deck-1');
        const actualState = reviewPage(previousState, action);

        expect(actualState).toEqual(expectedState);
    });

});
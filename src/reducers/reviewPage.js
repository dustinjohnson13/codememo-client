//@flow
import type {Action, ReviewState} from "../actions/actionTypes";
import {ADD_CARD_SUCCESS, ANSWER_CARD_SUCCESS, FETCH_CARDS_SUCCESS, FETCH_DECK_SUCCESS} from '../actions/actionTypes'
import {Card, DeckResponse} from "../services/APIDomain";

export const initialState = {
    toReview: [],
    deck: new DeckResponse('', '', []),
    deckName: '',
    totalCount: 0,
    newCount: 0,
    dueCount: 0,
    question: '',
    answer: '',
    failInterval: '',
    hardInterval: '',
    goodInterval: '',
    easyInterval: ''
};

export const getViewState = (state: ReviewState): ReviewState => {
    const deck = state.deck;
    const cardsForReview = state.toReview;

    const deckName = deck ? deck.name : '';
    const totalCount = deck ? deck.cards.length : 0;
    const newCount = deck ? deck.cards.filter(it => it.status === 'NEW').length : 0;
    const dueCount = deck ? deck.cards.filter(it => it.status === 'DUE').length : 0;
    let question = '';
    let answer = '';
    if (cardsForReview.length !== 0) {
        question = cardsForReview[0].question;
        answer = cardsForReview[0].answer;
    }

    return {
        toReview: cardsForReview,
        deck: deck,
        deckName: deckName,
        totalCount: totalCount,
        newCount: newCount,
        dueCount: dueCount,
        question: question,
        answer: answer,
        failInterval: '10m',
        hardInterval: '1d',
        goodInterval: '3d',
        easyInterval: '5d'
    };
};

const reviewPage = (state: ReviewState = initialState, action: Action) => {
    switch (action.type) {
        case FETCH_DECK_SUCCESS:
            const deck = action.deck;
            return getViewState({
                ...state,
                deck: deck
            });
        case FETCH_CARDS_SUCCESS:
            const cards = action.cards;
            return getViewState({
                ...state,
                toReview: cards
            });
        case ADD_CARD_SUCCESS:
            const addedCard = action.card;
            const newToReview = [...state.toReview, addedCard];
            const deckCardsPlusAddedCard = [...state.deck.cards, new Card(addedCard.id, 'NEW')];
            return getViewState({
                ...state,
                toReview: newToReview,
                deck: new DeckResponse(state.deck.id, state.deck.name, deckCardsPlusAddedCard)
            });
        case ANSWER_CARD_SUCCESS:
            const newCard = action.card;
            const reviewedCard = state.toReview.find(card => card.question === state.question && card.answer === state.answer);
            const reviewedDeckCard = state.deck.cards.find(card => newCard.id === card.id);

            const newDeckCards = state.deck.cards.filter(card => card !== reviewedDeckCard);
            if (reviewedDeckCard) {
                newDeckCards.push(new Card(reviewedDeckCard.id, 'OK'));
            }

            const newDeck = new DeckResponse(state.deck.id, state.deck.name, newDeckCards);

            return getViewState({
                ...state,
                toReview: state.toReview.filter(card => card !== reviewedCard),
                deck: newDeck
            });
        default:
            return state;
    }
};

export default reviewPage
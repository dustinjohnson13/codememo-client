//@flow
import type {Action, ReviewState} from "../actions/actionTypes";
import {
    ADD_CARD_SUCCESS,
    ANSWER_CARD_SUCCESS,
    FETCH_CARDS_SUCCESS,
    FETCH_DECK_SUCCESS,
    HIDE_ANSWER,
    SHOW_ANSWER
} from '../actions/actionTypes'

export const initialState = {
    toReview: [],
    deckName: '',
    deckId: '',
    totalCount: 0,
    newCount: 0,
    dueCount: 0,
    question: '',
    answer: '',
    failInterval: '',
    hardInterval: '',
    goodInterval: '',
    easyInterval: '',
    showingAnswer: false
};

export const getViewState = (state: ReviewState): ReviewState => state;

const reviewPage = (state: ReviewState = initialState, action: Action) => {
    switch (action.type) {
        case HIDE_ANSWER:
            return getViewState({
                ...state,
                showingAnswer: false
            });
        case SHOW_ANSWER:
            return getViewState({
                ...state,
                showingAnswer: true
            });
        case FETCH_DECK_SUCCESS:
            const deck = action.deck;
            const totalCount = deck ? deck.cards.length : 0;
            const newCount = deck ? deck.cards.filter(it => it.status === 'NEW').length : 0;
            const dueCount = deck ? deck.cards.filter(it => it.status === 'DUE').length : 0;

            return getViewState({
                ...state,
                deckName: deck.name,
                deckId: deck.id,
                totalCount: totalCount,
                newCount: newCount,
                dueCount: dueCount

            });
        case FETCH_CARDS_SUCCESS:
            const cards = action.cards;
            const cardsForReview = cards;
            let question = '';
            let answer = '';
            if (cardsForReview.length !== 0) {
                question = cardsForReview[0].question;
                answer = cardsForReview[0].answer;
            }

            return getViewState({
                ...state,
                toReview: cards,
                question: question,
                answer: answer,
                failInterval: '10m',
                hardInterval: '1d',
                goodInterval: '3d',
                easyInterval: '5d'
            });
        case ADD_CARD_SUCCESS:
            const addedCard = action.card;
            const newToReview = [...state.toReview, addedCard];
            return getViewState({
                ...state,
                totalCount: state.totalCount + 1,
                newCount: state.newCount + 1,
                toReview: newToReview
            });
        case ANSWER_CARD_SUCCESS:
            const reviewedCard = action.card;
            const minusReviewedCard = state.toReview.filter(card => card.id !== reviewedCard.id);
            const doneReviewing = minusReviewedCard.length === 0;

            return getViewState({
                ...state,
                toReview: minusReviewedCard,
                question: doneReviewing ? '' : minusReviewedCard[0].question,
                answer: doneReviewing ? '' : minusReviewedCard[0].answer,
                dueCount: state.dueCount > 0 ? state.dueCount - 1 : state.dueCount,
                newCount: state.dueCount > 0 ? state.newCount : state.newCount - 1,
                showingAnswer: false
            });
        default:
            return state;
    }
};

export default reviewPage
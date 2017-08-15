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
    dueCards: [],
    newCards: [],
    deckName: '',
    deckId: '',
    // TODO: Collapse cardId, question, answer into one field
    cardId: '',
    totalCount: 0,
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

            return getViewState({
                ...state,
                deckName: deck.name,
                deckId: deck.id,
                totalCount: totalCount

            });
        case FETCH_CARDS_SUCCESS:
            const cards = action.cards;
            const cardsForReview = cards;
            let question = '';
            let answer = '';
            let cardId = '';
            if (cardsForReview.length !== 0) {
                question = cardsForReview[0].question;
                answer = cardsForReview[0].answer;
                cardId = cardsForReview[0].id;
            }

            return getViewState({
                ...state,
                dueCards: cards.filter(card => card.due),
                newCards: cards.filter(card => !card.due),
                question: question,
                answer: answer,
                cardId: cardId,
                failInterval: '10m',
                hardInterval: '1d',
                goodInterval: '3d',
                easyInterval: '5d'
            });
        case ADD_CARD_SUCCESS:
            const addedCard = action.card;
            const reviewNewCard = state.question === '';
            const questionAfterAddCard = reviewNewCard ? addedCard.question : state.question;
            const answerAfterAddCard = reviewNewCard ? addedCard.answer : state.answer;
            const cardIdAfterAddCard = reviewNewCard ? addedCard.id : state.cardId;
            return getViewState({
                ...state,
                totalCount: state.totalCount + 1,
                newCards: [...state.newCards, addedCard],
                question: questionAfterAddCard,
                answer: answerAfterAddCard,
                cardId: cardIdAfterAddCard,
                showingAnswer: false
            });
        case ANSWER_CARD_SUCCESS:
            const reviewedCard = action.card;
            const dueCardsMinusReviewed = state.dueCards.filter(card => card.id !== reviewedCard.id);
            const newCardsMinusReviewed = state.newCards.filter(card => card.id !== reviewedCard.id);
            const numDueCards = dueCardsMinusReviewed.length;
            const numNewCards = newCardsMinusReviewed.length;
            const doneReviewing = numDueCards === 0 && numNewCards === 0;

            return getViewState({
                ...state,
                dueCards: dueCardsMinusReviewed,
                newCards: newCardsMinusReviewed,
                question: doneReviewing ? '' : numDueCards > 0 ? dueCardsMinusReviewed[0].question : newCardsMinusReviewed[0].question,
                answer: doneReviewing ? '' : numDueCards > 0 ? dueCardsMinusReviewed[0].answer : newCardsMinusReviewed[0].answer,
                cardId: doneReviewing ? '' : numDueCards > 0 ? dueCardsMinusReviewed[0].id : newCardsMinusReviewed[0].id,
                showingAnswer: false
            });
        default:
            return state;
    }
};

export default reviewPage
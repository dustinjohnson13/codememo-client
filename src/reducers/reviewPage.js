import {ANSWER_CARD_SUCCESS, FETCH_CARDS_SUCCESS, FETCH_DECK_SUCCESS} from '../actions/actionTypes'

export const getViewState = state => {
    const deck = state.deck;
    const cardsForReview = state.toReview;

    const deckName = deck.name;
    const totalCount = deck.cards.length;
    const newCount = deck.cards.filter(it => it.status === 'NEW').length;
    const dueCount = deck.cards.filter(it => it.status === 'DUE').length;
    const nextCard = cardsForReview.length === 0 ? {question: null, answer: null} : cardsForReview[0];

    return {
        deck: deck,
        deckName: deckName,
        totalCount: totalCount,
        newCount: newCount,
        dueCount: dueCount,
        // TODO: Should these stay here?
        question: nextCard.question,
        answer: nextCard.answer,
        failInterval: '10m',
        hardInterval: '1d',
        goodInterval: '3d',
        easyInterval: '5d',
        toReview: cardsForReview
    };
};

const reviewPage = (state = {toReview: []}, action) => {
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
        case ANSWER_CARD_SUCCESS:
            const newCard = action.card;
            const reviewedCard = state.toReview.find(card => card.question === state.question && card.answer === state.answer);
            const reviewedDeckCard = state.deck.cards.find(card => newCard.id === card.id);

            const newDeckCard = {...reviewedDeckCard, status: 'OK'};
            const newDeckCards = state.deck.cards.filter(card => card !== reviewedDeckCard);
            newDeckCards.push(newDeckCard);

            const newDeck = {
                ...state.deck,
                cards: newDeckCards
            };

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
//@flow
import {CardDetail} from "../services/APIDomain";

export const reviewState = {
    deckName: 'Deck1', deckId: 'deck-1', cardId: 'deck-1-card-30', totalCount: 6,
    failInterval: '10m', hardInterval: '1d', goodInterval: '3d', easyInterval: '5d',
    answer: '', question: '', showingAnswer: false,
    dueCards: [
        new CardDetail('deck-1-card-30', 'Question Number 30?', 'Answer Number 30', -299999),
        new CardDetail('deck-1-card-31', 'Question Number 31?', 'Answer Number 31', -309999)
    ],
    newCards: [
        new CardDetail('deck-1-card-32', 'Question Number 32?', 'Answer Number 32', null)
    ]
};
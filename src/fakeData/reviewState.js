//@flow
import {
    CardDetail,
    FOUR_DAYS_IN_SECONDS,
    HALF_DAY_IN_SECONDS,
    ONE_DAY_IN_SECONDS,
    TWO_DAYS_IN_SECONDS
} from "../services/APIDomain"
import {DUE_IMMEDIATELY} from "../persist/Dao"
import type {ReviewState} from "../actions/actionTypes"

export const reviewState: ReviewState = {
    deckName: 'Deck1', deckId: 'deck-1', cardId: 'deck-1-card-30', totalCount: 6,
    failInterval: '10m', hardInterval: '1d', goodInterval: '3d', easyInterval: '5d',
    answer: '', question: '', showingAnswer: false,
    dueCards: [
        new CardDetail('deck-1-card-30', 'Question Number 30?', 'Answer Number 30',
            HALF_DAY_IN_SECONDS, ONE_DAY_IN_SECONDS, TWO_DAYS_IN_SECONDS, FOUR_DAYS_IN_SECONDS, -299999),
        new CardDetail('deck-1-card-31', 'Question Number 31?', 'Answer Number 31', HALF_DAY_IN_SECONDS,
            ONE_DAY_IN_SECONDS, TWO_DAYS_IN_SECONDS, FOUR_DAYS_IN_SECONDS, -309999)
    ],
    newCards: [
        new CardDetail('deck-1-card-32', 'Question Number 32?', 'Answer Number 32', HALF_DAY_IN_SECONDS,
            ONE_DAY_IN_SECONDS, TWO_DAYS_IN_SECONDS, FOUR_DAYS_IN_SECONDS, DUE_IMMEDIATELY)
    ]
}
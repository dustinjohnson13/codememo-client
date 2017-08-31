//@flow
import {
    CardDetail,
    MINUTES_PER_DAY,
    MINUTES_PER_FOUR_DAYS,
    MINUTES_PER_HALF_DAY,
    MINUTES_PER_TWO_DAYS
} from "../services/APIDomain"
import {DUE_IMMEDIATELY, Format} from "../persist/Dao"
import type {ReviewState} from "../actions/actionTypes"

export const reviewState: ReviewState = {
    deckName: 'Deck1', deckId: 'deck-1', cardId: 'deck-1-card-30', totalCount: 6,
    failInterval: '10m', hardInterval: '1d', goodInterval: '3d', easyInterval: '5d',
    answer: '', question: '', showingAnswer: false, startTime: -1, format: Format.PLAIN,
    dueCards: [
        new CardDetail('deck-1-card-30', 'Question Number 30?', 'Answer Number 30', Format.PLAIN,
            MINUTES_PER_HALF_DAY, MINUTES_PER_DAY, MINUTES_PER_TWO_DAYS, MINUTES_PER_FOUR_DAYS, -299999),
        new CardDetail('deck-1-card-31', 'Question Number 31?', 'Answer Number 31', Format.PLAIN, MINUTES_PER_HALF_DAY,
            MINUTES_PER_DAY, MINUTES_PER_TWO_DAYS, MINUTES_PER_FOUR_DAYS, -309999)
    ],
    newCards: [
        new CardDetail('deck-1-card-32', 'Question Number 32?', 'Answer Number 32', Format.PLAIN, MINUTES_PER_HALF_DAY,
            MINUTES_PER_DAY, MINUTES_PER_TWO_DAYS, MINUTES_PER_FOUR_DAYS, DUE_IMMEDIATELY)
    ]
}
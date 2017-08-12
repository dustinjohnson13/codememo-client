//@flow
import {Deck} from "../services/APIDomain";

export const reviewState = {
    deckName: 'deck-1', totalCount: 6, newCount: 1, dueCount: 3,
    failInterval: '10m', hardInterval: '1d', goodInterval: '3d', easyInterval: '5d',
    toReview: [], answer: '', question: '', deck: new Deck('deck-1', 'Deck1', 80, 27, 23)
};
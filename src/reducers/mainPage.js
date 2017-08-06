import * as domain from '../Domain.js'

const clock = new domain.Clock(() => new Date().getTime());

const createDecks = (clock) => {
    let decks = [];
    for (let i = 0; i < 6; i++) {
        decks.push(createDeck(clock, `Deck${i}`));
    }
    return decks;
};

const createDeck = (clock, name) => {
    const cards = [];
    const dueCount = Math.floor(Math.random() * 30) + 1;
    const newCount = Math.floor(Math.random() * 15) + 1;
    const totalCount = dueCount + newCount + (Math.floor(Math.random() * 15) + 1);
    const currentTime = clock.epochSeconds();

    for (let i = 0; i < totalCount; i++) {
        let dueTime = null;
        if (i > dueCount) {
            dueTime = currentTime + (10000 * i);
        } else if (i > newCount) {
            dueTime = currentTime - (10000 * i);
        }

        const card = new domain.Card(`Question Number ${i}?`, `Answer Number ${i}`, dueTime);
        cards.push(card);
    }

    return new domain.Deck(name, cards);
};

const mainPage = (state = {
    page: "CollectionPage",
    deck: null,
    collection: new domain.Collection(createDecks(clock)),
    clock: clock
}, action) => {
    switch (action.type) {
        case 'SHOW_COLLECTIONS':
            return {
                ...state,
                page: "CollectionPage",
                deck: null
            };
        case 'ADD_NEW_DECK':
            const name = action.name;
            const newDeck = createDeck(clock, name);

            return {
                ...state,
                collection: {
                    ...state.collection,
                    decks: [...state.collection.decks, newDeck]
                }
            };
        case 'REVIEW_DECK':
            const deck = state.collection.decks.find((it) => it.name === action.name);
            return {
                ...state,
                page: "ReviewPage",
                deck: deck
            };
        default:
            return state
    }
};

export default mainPage
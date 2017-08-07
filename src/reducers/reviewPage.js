export const getViewState = state => {
    const deck = state.deck;

    const deckName = deck.name;
    const totalCount = deck.cards.length;
    const newCount = deck.cards.filter(it => it.status === 'NEW').length;
    const dueCount = deck.cards.filter(it => it.status === 'DUE').length;

    return {
        deckName: deckName,
        totalCount: totalCount,
        newCount: newCount,
        dueCount: dueCount
    };
};

const reviewPage = (state = {}, action) => {
    switch (action.type) {
        case 'FETCH_DECK_SUCCESS':
            const deck = action.deck;
            return getViewState({
                ...state,
                deck: deck
            });
        default:
            return state;
    }
};

export default reviewPage
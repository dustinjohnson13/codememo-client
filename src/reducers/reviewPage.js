export const getViewState = state => state;

const reviewPage = (state = {}, action) => {
    switch (action.type) {
        case 'FETCH_DECK_SUCCESS':
            const deck = action.deck;
            return getViewState({
                ...state,
                deck: deck
            });
        default:
            return getViewState(state);
    }
};

export default reviewPage
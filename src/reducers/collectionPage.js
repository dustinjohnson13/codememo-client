export const getViewState = state => state;

const collectionPage = (state = {}, action) => {
    switch (action.type) {
        case 'FETCH_COLLECTION_REQUEST':
            return getViewState({
                ...state,
                page: null
            });
        case 'FETCH_COLLECTION_SUCCESS':
        case 'ADD_DECK_SUCCESS':
            return getViewState({
                ...state,
                page: "CollectionPage",
                collection: action.collection,
                deck: null
            });
        case 'FETCH_DECK_SUCCESS':
            const deck = action.deck;
            return getViewState({
                ...state,
                page: "ReviewPage",
                deck: deck
            });
        default:
            return getViewState(state);
    }
};

export default collectionPage
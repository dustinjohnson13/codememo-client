const collectionPage = (state = {}, action) => {
    switch (action.type) {
        case 'FETCH_COLLECTION_REQUEST':
            return {
                ...state,
                page: null
            };
        case 'FETCH_COLLECTION_SUCCESS':
        case 'ADD_DECK_SUCCESS':
            return {
                ...state,
                page: "CollectionPage",
                collection: action.collection,
                deck: null
            };
        case 'FETCH_DECK_SUCCESS':
            const deck = action.deck;
            return {
                ...state,
                page: "ReviewPage",
                deck: deck
            };
        default:
            return state
    }
};

export default collectionPage
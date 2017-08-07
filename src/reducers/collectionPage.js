export const getViewState = state => state;

const collectionPage = (state = {}, action) => {
    switch (action.type) {
        case 'FETCH_COLLECTION_SUCCESS':
        case 'ADD_DECK_SUCCESS':
            return getViewState({
                ...state,
                collection: action.collection,
                deck: null
            });
        default:
            return getViewState(state);
    }
};

export default collectionPage
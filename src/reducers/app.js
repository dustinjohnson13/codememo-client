export const getViewState = state => state;

const app = (state = {}, action) => {
    switch (action.type) {
        case 'FETCH_DECK_REQUEST':
        case 'FETCH_COLLECTION_REQUEST':
            return getViewState({
                ...state,
                page: null
            });
        case 'FETCH_COLLECTION_SUCCESS':
            return getViewState({
                ...state,
                page: "CollectionPage"
            });
        case 'FETCH_DECK_SUCCESS':
            return getViewState({
                ...state,
                page: "ReviewPage"
            });
        case 'LOAD_PAGE':
            return getViewState({
                ...state,
                page: action.page
            });
        default:
            return state;
    }
};

export default app
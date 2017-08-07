export const getViewState = state => state;

const reviewPage = (state = {}, action) => {
    switch (action.type) {
        case 'SET_VISIBILITY_FILTER':
            return action.filter;
        default:
            return getViewState(state);
    }
};

export default reviewPage
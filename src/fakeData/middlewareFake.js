import thunk from 'redux-thunk'

export const middlewareFake = () => {
    const store = {
        getState: jest.fn(() => ({})),
        dispatch: jest.fn(),
    };
    const next = jest.fn();

    const invoke = (action) => {
        thunk(store)(next)(action);
    };

    return {store, next, invoke}
};

export default middlewareFake;
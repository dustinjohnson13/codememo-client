//@flow
import thunk from 'redux-thunk'
import type {Action} from "../actions/actionTypes";

export const middlewareFake = () => {
    const store = {
        getState: jest.fn(() => ({})),
        dispatch: jest.fn(),
    };
    const next = jest.fn();

    const invoke = (action: Action) => {
        thunk(store)(next)(action);
    };

    return {store, next, invoke}
};

export default middlewareFake;
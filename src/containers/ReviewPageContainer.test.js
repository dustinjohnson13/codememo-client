import React from 'react';

import {mapDispatchToProps, mapStateToProps} from "./ReviewPageContainer";
import {reviewState} from "../fakeData/reviewState";
import {collectionPage} from "../actions/creators";

describe('<ReviewPageContainer />', () => {

    it('maps deck attributes from state', () => {
        const expectedState = {
            deckName: 'deck-1', totalCount: 6, newCount: 1, dueCount: 3
        };
        const state = {review: reviewState};

        const props = mapStateToProps(state);

        expect(props).toEqual(expectedState);

    });

    it('maps back to the appropriate action', () => {
        const dispatchedActions = [];
        const dispatcher = (action) => dispatchedActions.push(action);

        const props = mapDispatchToProps(dispatcher, {});

        props.back();

        expect(dispatchedActions).toEqual([collectionPage()]);
    });
});
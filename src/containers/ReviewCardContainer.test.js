import React from 'react';
import {showAnswer} from "../actions/creators";
import {mapDispatchToProps, mapStateToProps} from "./ReviewCardContainer";
import {Deck} from "../components/CollectionPage";
import {reviewState} from "../fakeData/reviewState";
import {DeckResponse} from "../services/APIDomain";

jest.mock('../services/API'); // Set mock API for module importing

describe('<ReviewCardContainer/>', () => {

    it('maps component properties', () => {
        const expectedQuestion = 'Specific q';
        const expectedAnswer = 'Specific a';
        const expectedShowingAnswer = true;

        const state = {
            review: {
                ...reviewState,
                question: expectedQuestion, answer: expectedAnswer,
                showingAnswer: expectedShowingAnswer,
                deck: new DeckResponse('deck-2', 'Deck2', [])
            }
        };

        const expectedProps = {
            answer: expectedAnswer,
            cardId: undefined,
            deckId: 'deck-2',
            showingAnswer: expectedShowingAnswer,
            question: expectedQuestion
        };

        const props = mapStateToProps(state, {});

        expect(props).toEqual(expectedProps);
    });

    it('maps show answer', () => {

        const expectedActions = [showAnswer()];

        const actions = [];
        const invoke = (action: Action) => actions.push(action);

        const {showAnswer: fn} = mapDispatchToProps(invoke, {});
        fn();

        expect(actions).toEqual(expectedActions);
    });
});
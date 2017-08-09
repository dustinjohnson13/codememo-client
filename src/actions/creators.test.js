import {fetchDeck} from '../actions/creators'
import FakeDataService from "../fakeData/FakeDataService";
import {FETCH_CARDS_REQUEST, FETCH_CARDS_SUCCESS, FETCH_DECK_REQUEST, FETCH_DECK_SUCCESS} from "./actionTypes";

import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'

describe('creators', () => {
    it('invokes proper sequence of actions on fetch deck success', () => {

        const deckName = 'Deck1';
        const dataService = new FakeDataService();

        const expectedActions = [{"name": deckName, "type": FETCH_DECK_REQUEST}, {
            "deck": {
                "cards": [{
                    "id": "deck-1-card-0",
                    "status": "OK"
                }, {"id": "deck-1-card-1", "status": "OK"}, {"id": "deck-1-card-2", "status": "OK"}, {
                    "id": "deck-1-card-3",
                    "status": "OK"
                }, {"id": "deck-1-card-4", "status": "OK"}, {"id": "deck-1-card-5", "status": "OK"}, {
                    "id": "deck-1-card-6",
                    "status": "OK"
                }, {"id": "deck-1-card-7", "status": "OK"}, {"id": "deck-1-card-8", "status": "OK"}, {
                    "id": "deck-1-card-9",
                    "status": "OK"
                }, {"id": "deck-1-card-10", "status": "OK"}, {"id": "deck-1-card-11", "status": "OK"}, {
                    "id": "deck-1-card-12",
                    "status": "OK"
                }, {"id": "deck-1-card-13", "status": "OK"}, {"id": "deck-1-card-14", "status": "OK"}, {
                    "id": "deck-1-card-15",
                    "status": "OK"
                }, {"id": "deck-1-card-16", "status": "OK"}, {"id": "deck-1-card-17", "status": "OK"}, {
                    "id": "deck-1-card-18",
                    "status": "OK"
                }, {"id": "deck-1-card-19", "status": "OK"}, {"id": "deck-1-card-20", "status": "OK"}, {
                    "id": "deck-1-card-21",
                    "status": "OK"
                }, {"id": "deck-1-card-22", "status": "OK"}, {"id": "deck-1-card-23", "status": "OK"}, {
                    "id": "deck-1-card-24",
                    "status": "OK"
                }, {"id": "deck-1-card-25", "status": "OK"}, {"id": "deck-1-card-26", "status": "OK"}, {
                    "id": "deck-1-card-27",
                    "status": "OK"
                }, {"id": "deck-1-card-28", "status": "OK"}, {"id": "deck-1-card-29", "status": "OK"}, {
                    "id": "deck-1-card-30",
                    "status": "DUE"
                }, {"id": "deck-1-card-31", "status": "DUE"}, {"id": "deck-1-card-32", "status": "DUE"}, {
                    "id": "deck-1-card-33",
                    "status": "DUE"
                }, {"id": "deck-1-card-34", "status": "DUE"}, {"id": "deck-1-card-35", "status": "DUE"}, {
                    "id": "deck-1-card-36",
                    "status": "DUE"
                }, {"id": "deck-1-card-37", "status": "DUE"}, {"id": "deck-1-card-38", "status": "DUE"}, {
                    "id": "deck-1-card-39",
                    "status": "DUE"
                }, {"id": "deck-1-card-40", "status": "DUE"}, {"id": "deck-1-card-41", "status": "DUE"}, {
                    "id": "deck-1-card-42",
                    "status": "DUE"
                }, {"id": "deck-1-card-43", "status": "DUE"}, {"id": "deck-1-card-44", "status": "DUE"}, {
                    "id": "deck-1-card-45",
                    "status": "DUE"
                }, {"id": "deck-1-card-46", "status": "DUE"}, {"id": "deck-1-card-47", "status": "DUE"}, {
                    "id": "deck-1-card-48",
                    "status": "DUE"
                }, {"id": "deck-1-card-49", "status": "DUE"}, {"id": "deck-1-card-50", "status": "DUE"}, {
                    "id": "deck-1-card-51",
                    "status": "DUE"
                }, {"id": "deck-1-card-52", "status": "DUE"}, {"id": "deck-1-card-53", "status": "DUE"}, {
                    "id": "deck-1-card-54",
                    "status": "DUE"
                }, {"id": "deck-1-card-55", "status": "DUE"}, {"id": "deck-1-card-56", "status": "DUE"}, {
                    "id": "deck-1-card-57",
                    "status": "NEW"
                }, {"id": "deck-1-card-58", "status": "NEW"}, {"id": "deck-1-card-59", "status": "NEW"}, {
                    "id": "deck-1-card-60",
                    "status": "NEW"
                }, {"id": "deck-1-card-61", "status": "NEW"}, {"id": "deck-1-card-62", "status": "NEW"}, {
                    "id": "deck-1-card-63",
                    "status": "NEW"
                }, {"id": "deck-1-card-64", "status": "NEW"}, {"id": "deck-1-card-65", "status": "NEW"}, {
                    "id": "deck-1-card-66",
                    "status": "NEW"
                }, {"id": "deck-1-card-67", "status": "NEW"}, {"id": "deck-1-card-68", "status": "NEW"}, {
                    "id": "deck-1-card-69",
                    "status": "NEW"
                }, {"id": "deck-1-card-70", "status": "NEW"}, {"id": "deck-1-card-71", "status": "NEW"}, {
                    "id": "deck-1-card-72",
                    "status": "NEW"
                }, {"id": "deck-1-card-73", "status": "NEW"}, {"id": "deck-1-card-74", "status": "NEW"}, {
                    "id": "deck-1-card-75",
                    "status": "NEW"
                }, {"id": "deck-1-card-76", "status": "NEW"}, {"id": "deck-1-card-77", "status": "NEW"}, {
                    "id": "deck-1-card-78",
                    "status": "NEW"
                }, {"id": "deck-1-card-79", "status": "NEW"}], "id": "deck-1", "name": "Deck1"
            }, "type": FETCH_DECK_SUCCESS
        }, {
            "type": FETCH_CARDS_REQUEST,
            "ids": ["deck-1-card-30", "deck-1-card-31", "deck-1-card-32", "deck-1-card-33", "deck-1-card-34", "deck-1-card-35", "deck-1-card-36", "deck-1-card-37", "deck-1-card-38", "deck-1-card-39"]
        },
            {
                "type": FETCH_CARDS_SUCCESS,
                "cards": [
                    {
                        id: 'deck-1-card-30',
                        question: 'Question Number 30?',
                        answer: 'Answer Number 30',
                        due: -299999
                    },
                    {
                        id: 'deck-1-card-31',
                        question: 'Question Number 31?',
                        answer: 'Answer Number 31',
                        due: -309999
                    },
                    {
                        id: 'deck-1-card-32',
                        question: 'Question Number 32?',
                        answer: 'Answer Number 32',
                        due: -319999
                    },
                    {
                        id: 'deck-1-card-33',
                        question: 'Question Number 33?',
                        answer: 'Answer Number 33',
                        due: -329999
                    },
                    {
                        id: 'deck-1-card-34',
                        question: 'Question Number 34?',
                        answer: 'Answer Number 34',
                        due: -339999
                    },
                    {
                        id: 'deck-1-card-35',
                        question: 'Question Number 35?',
                        answer: 'Answer Number 35',
                        due: -349999
                    },
                    {
                        id: 'deck-1-card-36',
                        question: 'Question Number 36?',
                        answer: 'Answer Number 36',
                        due: -359999
                    },
                    {
                        id: 'deck-1-card-37',
                        question: 'Question Number 37?',
                        answer: 'Answer Number 37',
                        due: -369999
                    },
                    {
                        id: 'deck-1-card-38',
                        question: 'Question Number 38?',
                        answer: 'Answer Number 38',
                        due: -379999
                    },
                    {
                        id: 'deck-1-card-39',
                        question: 'Question Number 39?',
                        answer: 'Answer Number 39',
                        due: -389999
                    }]
            }];

        const middlewares = [thunk];
        const mockStore = configureStore(middlewares);
        const store = mockStore({});

        store.dispatch(fetchDeck(dataService, deckName)).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
        });
    });
});
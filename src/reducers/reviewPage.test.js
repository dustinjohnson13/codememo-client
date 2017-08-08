import reviewPage from './reviewPage';
import {fetchDeckSuccess} from '../actions/index'

describe('reviewPage', () => {
    it('adds deck information on fetch deck success', () => {
        const expectedDeckName = 'My Deck';
        const expectedDeckID = 'deck1';

        const cards = [{id: '1', status: 'NEW'},
            {id: '2', status: 'DUE'}, {id: '3', status: 'DUE'}, {id: '4', status: 'DUE'},
            {id: '5', status: 'OK'}, {id: '6', status: 'OK'}];
        const deck = {id: expectedDeckID, name: expectedDeckName, cards: cards};

        const previousState = {};
        const expectedState = {deckName: expectedDeckName, totalCount: 6, newCount: 1, dueCount: 3,
                failInterval: '10m', hardInterval: '1d', goodInterval: '3d', easyInterval: '5d'};

        const actualState = reviewPage(previousState, fetchDeckSuccess(deck));

        expect(actualState).toEqual(expectedState);
    });

});
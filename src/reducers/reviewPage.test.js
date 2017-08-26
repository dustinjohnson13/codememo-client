//@flow
import reviewPage, {initialState} from './reviewPage'
import {
    addCardSuccess,
    answerCardSuccess,
    fetchCardsSuccess,
    fetchDeckSuccess,
    hideAnswer,
    showAnswer
} from '../actions/creators'
import {
    Card,
    CardDetail,
    CardDetailResponse,
    DeckResponse,
    FOUR_DAYS_IN_SECONDS,
    HALF_DAY_IN_SECONDS,
    ONE_DAY_IN_SECONDS,
    TWO_DAYS_IN_SECONDS
} from "../services/APIDomain"
import {DUE_IMMEDIATELY} from "../persist/Dao"

describe('reviewPage', () => {

    const expectedDeckName = 'My Deck'
    const expectedDeckID = 'deck1'

    const cards = [new Card('deck-1-card-32', 'NEW'),
        new Card('deck-1-card-30', 'DUE'), new Card('deck-1-card-31', 'DUE'),
        new Card('5', 'OK'), new Card('6', 'OK')]
    const deck = new DeckResponse(expectedDeckID, expectedDeckName, cards)

    const addCardResponse = new CardDetail('deck-1-card-99', 'Some Question', 'Some Answer', HALF_DAY_IN_SECONDS, ONE_DAY_IN_SECONDS, TWO_DAYS_IN_SECONDS, FOUR_DAYS_IN_SECONDS, DUE_IMMEDIATELY)

    it('adds new card on add card success', () => {

        const response = addCardResponse

        const previousState = {
            ...initialState,
            totalCount: 5,
            dueCards: [
                new CardDetail('deck-1-card-30', 'Question Number 30?', 'Answer Number 30', HALF_DAY_IN_SECONDS, ONE_DAY_IN_SECONDS, TWO_DAYS_IN_SECONDS, FOUR_DAYS_IN_SECONDS, -299999),
                new CardDetail('deck-1-card-31', 'Question Number 31?', 'Answer Number 31', HALF_DAY_IN_SECONDS, ONE_DAY_IN_SECONDS, TWO_DAYS_IN_SECONDS, FOUR_DAYS_IN_SECONDS, -309999)
            ],
            newCards: [
                new CardDetail('deck-1-card-32', 'Question Number 32?', 'Answer Number 32', HALF_DAY_IN_SECONDS, ONE_DAY_IN_SECONDS, TWO_DAYS_IN_SECONDS, FOUR_DAYS_IN_SECONDS, DUE_IMMEDIATELY)
            ]
        }

        const expectedDueCards = previousState.dueCards
        const expectedNewCards = [...previousState.newCards, response]

        const action = addCardSuccess(response, 'deck-1')
        const actualState = reviewPage(previousState, action)

        expect(actualState.totalCount).toEqual(6)
        expect(actualState.dueCards).toEqual(expectedDueCards)
        expect(actualState.newCards).toEqual(expectedNewCards)
    })

    it('adds question/answer/id for added card if there are no cards for review', () => {

        const response = addCardResponse

        const previousState = {
            ...initialState,
            question: '',
            answer: '',
            dueCards: [],
            newCards: []
        }

        const action = addCardSuccess(response, 'deck-1')
        const actualState = reviewPage(previousState, action)

        expect(actualState.question).toEqual(response.question)
        expect(actualState.answer).toEqual(response.answer)
        expect(actualState.cardId).toEqual(response.id)
        expect(actualState.failInterval).toEqual("12h")
        expect(actualState.hardInterval).toEqual("1d")
        expect(actualState.goodInterval).toEqual("2d")
        expect(actualState.easyInterval).toEqual("4d")
    })

    it('hides answer after adding card', () => {

        const response = addCardResponse

        const previousState = {
            ...initialState,
            dueCards: [],
            newCards: [],
            showingAnswer: true
        }

        const action = addCardSuccess(response, 'deck-1')
        const actualState = reviewPage(previousState, action)

        expect(actualState.showingAnswer).toEqual(false)
    })

    it('hides answer when requested', () => {

        const previousState = {
            ...initialState,
            showingAnswer: true
        }

        const action = hideAnswer()
        const actualState = reviewPage(previousState, action)

        expect(actualState.showingAnswer).toEqual(false)
    })

    it('shows answer when requested', () => {

        const previousState = {
            ...initialState,
            showingAnswer: false
        }

        const action = showAnswer()
        const actualState = reviewPage(previousState, action)

        expect(actualState.showingAnswer).toEqual(true)
    })

    it('adds deck information on fetch deck success', () => {

        const previousState = {...initialState}
        // TODO: Breakup the deck instance
        const expectedState =
            {
                ...previousState,
                deckName: expectedDeckName, deckId: expectedDeckID,
                totalCount: 5
            }

        const action = fetchDeckSuccess(deck)
        const actualState = reviewPage(previousState, action)

        expect(actualState).toEqual(expectedState)
    })

    it('adds question, answer, answer intervals, and cards for review on fetch cards success', () => {

        const cardDetails = [new CardDetail('deck-1-card-30', 'Question Number 30?', 'Answer Number 30', HALF_DAY_IN_SECONDS, ONE_DAY_IN_SECONDS, TWO_DAYS_IN_SECONDS, FOUR_DAYS_IN_SECONDS, -299999),
            new CardDetail('deck-1-card-31', 'Question Number 31?', 'Answer Number 31', HALF_DAY_IN_SECONDS, ONE_DAY_IN_SECONDS, TWO_DAYS_IN_SECONDS, FOUR_DAYS_IN_SECONDS, -309999),
            new CardDetail('deck-1-card-32', 'Question Number 32?', 'Answer Number 32', HALF_DAY_IN_SECONDS, ONE_DAY_IN_SECONDS, TWO_DAYS_IN_SECONDS, FOUR_DAYS_IN_SECONDS, DUE_IMMEDIATELY)]
        const cardsResponse = new CardDetailResponse(cardDetails)

        const previousState = {...initialState}
        const expectedState = {
            ...previousState,
            dueCards: [
                new CardDetail('deck-1-card-30', 'Question Number 30?', 'Answer Number 30', HALF_DAY_IN_SECONDS, ONE_DAY_IN_SECONDS, TWO_DAYS_IN_SECONDS, FOUR_DAYS_IN_SECONDS, -299999),
                new CardDetail('deck-1-card-31', 'Question Number 31?', 'Answer Number 31', HALF_DAY_IN_SECONDS, ONE_DAY_IN_SECONDS, TWO_DAYS_IN_SECONDS, FOUR_DAYS_IN_SECONDS, -309999)
            ],
            newCards: [
                new CardDetail('deck-1-card-32', 'Question Number 32?', 'Answer Number 32', HALF_DAY_IN_SECONDS, ONE_DAY_IN_SECONDS, TWO_DAYS_IN_SECONDS, FOUR_DAYS_IN_SECONDS, DUE_IMMEDIATELY)
            ],
            answer: "Answer Number 30",
            question: "Question Number 30?",
            cardId: 'deck-1-card-30',
            failInterval: "12h",
            hardInterval: "1d",
            goodInterval: "2d",
            easyInterval: "4d"
        }

        const action = fetchCardsSuccess(cardsResponse)
        const actualState = reviewPage(previousState, action)

        expect(actualState).toEqual(expectedState)
    })

    it('resets answer card state on answer card', () => {

        const previousState = {
            ...initialState,
            answer: "Answer Number 30",
            question: "Question Number 30?",
            cardId: 'deck-1-card-30',
            totalCount: 5,
            dueCards: [new CardDetail(
                'deck-1-card-30',
                'Question Number 30?',
                'Answer Number 30',
                HALF_DAY_IN_SECONDS, ONE_DAY_IN_SECONDS, TWO_DAYS_IN_SECONDS,
                FOUR_DAYS_IN_SECONDS,
                -299999
            ), new CardDetail('deck-1-card-31',
                'Question Number 31?',
                'Answer Number 31',
                HALF_DAY_IN_SECONDS, ONE_DAY_IN_SECONDS, TWO_DAYS_IN_SECONDS,
                FOUR_DAYS_IN_SECONDS,
                -309999
            )],
            newCards: [
                new CardDetail('deck-1-card-32',
                    'Question Number 32?',
                    'Answer Number 32',
                    HALF_DAY_IN_SECONDS, ONE_DAY_IN_SECONDS, TWO_DAYS_IN_SECONDS,
                    FOUR_DAYS_IN_SECONDS,
                    DUE_IMMEDIATELY)
            ],
            showingAnswer: true
        }

        const expectedDueCards = previousState.dueCards.slice(1)

        const expectedState = {
            ...previousState,
            answer: "Answer Number 31",
            question: "Question Number 31?",
            failInterval: "12h",
            hardInterval: "1d",
            goodInterval: "2d",
            easyInterval: "4d",
            cardId: 'deck-1-card-31',
            totalCount: 5,
            dueCards: expectedDueCards,
            showingAnswer: false
        }

        const action = answerCardSuccess(new CardDetail('deck-1-card-30', 'Question Number 30?', 'Answer Number 30', HALF_DAY_IN_SECONDS, ONE_DAY_IN_SECONDS, TWO_DAYS_IN_SECONDS, FOUR_DAYS_IN_SECONDS, 86400), 'deck-1')
        const actualState = reviewPage(previousState, action)

        expect(actualState).toEqual(expectedState)
    })

})
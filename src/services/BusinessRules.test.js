//@flow
import {Answer, CardStatus, HALF_DAY_IN_SECONDS, ONE_DAY_IN_SECONDS, TWO_DAYS_IN_SECONDS} from "./APIDomain"

import BusinessRules from "./BusinessRules"
import {Card, Deck, DUE_IMMEDIATELY} from "../persist/Dao"
import {fakeCards, fakeDecks} from "../fakeData/InMemoryDao"
import {FrozenClock} from "./__mocks__/API"

describe('BusinessRules', () => {

    const clock = new FrozenClock()
    const businessRules = new BusinessRules()

    it('should throw error on answer card: start time after end time', () => {
        expect.assertions(1)

        const startTime = clock.epochSeconds()
        const endTime = startTime - 90
        const original = new Card('1', 'templateId', 1, TWO_DAYS_IN_SECONDS, 2000)

        try {
            businessRules.cardAnswered(startTime, endTime, original, Answer.GOOD)
        } catch (e) {
            expect(e).toEqual(new Error("Start time must be less than or equal to end time!"))
        }
    })

    it('should set next due time on answer card: due card', () => {

        const endTime = clock.epochSeconds()
        const startTime = endTime - 90
        const currentGoodInterval = TWO_DAYS_IN_SECONDS

        const expectedNewDue = { // The cards have a current goodInterval of two days
            [Answer.FAIL]: endTime + HALF_DAY_IN_SECONDS,
            [Answer.HARD]: endTime + ONE_DAY_IN_SECONDS,
            [Answer.GOOD]: endTime + TWO_DAYS_IN_SECONDS,
            [Answer.EASY]: endTime + (TWO_DAYS_IN_SECONDS * 2)
        }

        const original = new Card('1', 'templateId', 1, currentGoodInterval, 2000)

        const actuals = [Answer.FAIL, Answer.HARD, Answer.GOOD, Answer.EASY].map(it => {
            const {updatedCard, review} = businessRules.cardAnswered(startTime, endTime, original, it)
            return {answer: it, newCard: updatedCard}
        })

        for (let answerAndActual of actuals) {
            const expectedDueTime = expectedNewDue[answerAndActual.answer]
            const newCard = answerAndActual.newCard

            expect(newCard.due).toEqual(expectedDueTime)
        }
    })

    it('should set next good interval on answer card: due card', () => {

        const endTime = clock.epochSeconds()
        const startTime = endTime - 90
        const currentGoodInterval = TWO_DAYS_IN_SECONDS

        const expectedNewGoodInterval = {
            [Answer.FAIL]: ONE_DAY_IN_SECONDS,
            [Answer.HARD]: TWO_DAYS_IN_SECONDS,
            [Answer.GOOD]: (TWO_DAYS_IN_SECONDS * 2),
            [Answer.EASY]: (TWO_DAYS_IN_SECONDS * 4)
        }

        const original = new Card('1', 'templateId', 1, currentGoodInterval, 2000)

        const actuals = [Answer.FAIL, Answer.HARD, Answer.GOOD, Answer.EASY].map(it => {
            const {updatedCard, review} = businessRules.cardAnswered(startTime, endTime, original, it)
            return {answer: it, newCard: updatedCard}
        })

        for (let answerAndActual of actuals) {
            const expectedGoodInterval = expectedNewGoodInterval[answerAndActual.answer]
            const newCard = answerAndActual.newCard

            expect(newCard.goodInterval).toEqual(expectedGoodInterval)
        }
    })

    it('should return a multiple of two for card good interval for all current intervals', () => {

        const currentGoodInterval = TWO_DAYS_IN_SECONDS
        const card = new Card('1', 'templateId', 1, currentGoodInterval, 2000)

        const expectedIntervals = [
            HALF_DAY_IN_SECONDS, ONE_DAY_IN_SECONDS, TWO_DAYS_IN_SECONDS, TWO_DAYS_IN_SECONDS * 2
        ]

        const actual = businessRules.currentAnswerIntervals(card)

        expect(actual).toEqual(expectedIntervals)
    })

    it('should map cards to api cards based on due time', () => {
        const currentTime = 2000

        const brandNew = new Card('1', 'templateId', 1, ONE_DAY_IN_SECONDS, DUE_IMMEDIATELY)
        const dueEarlier = new Card('2', 'templateId', 1, ONE_DAY_IN_SECONDS, currentTime - 100)
        const dueNow = new Card('3', 'templateId', 1, ONE_DAY_IN_SECONDS, currentTime)
        const ok = new Card('4', 'templateId', 1, ONE_DAY_IN_SECONDS, currentTime + 1);

        [brandNew, dueEarlier, dueNow, ok].forEach((card, idx) => {
            const apiCard = businessRules.cardToAPICard(currentTime, card)
            expect(apiCard.id).toEqual(card.id)

            const expectedStatus = idx === 0 ? CardStatus.NEW : idx === 3 ? CardStatus.OK : CardStatus.DUE
            expect(apiCard.status).toEqual(expectedStatus)
        })
    })

    it('should create a collection response with the correct card counts', async () => {
        const currentTime = 2000

        const decks: Array<Deck> = fakeDecks('1', 2, true)
        const cards: Array<Array<Card>> = []
        const expectedCounts: Array<{ expectedTotal: number, expectedDue: number, expectedNew: number }> = []

        decks.forEach((deck, idx) => {
            const multiplier = idx + 1
            const totalCount = multiplier * 10
            const dueCount = multiplier * 4
            const newCount = multiplier * 2

            expectedCounts.push({expectedTotal: totalCount, expectedDue: dueCount, expectedNew: newCount})
            const {templates, cards: cardsForTemplates} = fakeCards(currentTime, deck.id, totalCount, dueCount, newCount, true)
            cards.push(cardsForTemplates)
        })


        const response = businessRules.decksToAPICollectionResponse(currentTime, decks, cards)
        expect(response.decks.length).toEqual(2)

        decks.forEach((deck, idx) => {
            const apiDeck = response.decks[idx]

            expect(apiDeck.name).toEqual(deck.name)
            expect(apiDeck.totalCount).toEqual(expectedCounts[idx].expectedTotal)
            expect(apiDeck.dueCount).toEqual(expectedCounts[idx].expectedDue)
            expect(apiDeck.newCount).toEqual(expectedCounts[idx].expectedNew)
        })
    })
})
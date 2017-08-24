//@flow
import {
    ANSWERS,
    EASY,
    FAIL,
    GOOD,
    HALF_DAY_IN_SECONDS,
    HARD,
    ONE_DAY_IN_SECONDS,
    TWO_DAYS_IN_SECONDS
} from "./APIDomain"
import Card from "../entity/Card"
import BusinessRules from "./BusinessRules"

describe('BusinessRules', () => {

    it('should set next due time on answer card: due card', () => {

        const currentTime = 1
        const currentGoodInterval = TWO_DAYS_IN_SECONDS

        const expectedNewDue = { // The cards have a current goodInterval of two days
            [FAIL]: currentTime + HALF_DAY_IN_SECONDS,
            [HARD]: currentTime + ONE_DAY_IN_SECONDS,
            [GOOD]: currentTime + TWO_DAYS_IN_SECONDS,
            [EASY]: currentTime + (TWO_DAYS_IN_SECONDS * 2)
        }

        const original = new Card(undefined, 'deckId', 'Some question', 'Some answer', currentGoodInterval, undefined)

        const actuals = ANSWERS.map(it => {
            return {answer: it, newCard: new BusinessRules().cardAnswered(currentTime, original, it)}
        })

        for (let answerAndActual of actuals) {
            const expectedDueTime = expectedNewDue[answerAndActual.answer]
            const newCard = answerAndActual.newCard

            expect(newCard.due).toEqual(expectedDueTime)
        }
    })

    it('should set next good interval on answer card: due card', () => {

        const currentTime = 1
        const currentGoodInterval = TWO_DAYS_IN_SECONDS

        const expectedNewGoodInterval = {
            [FAIL]: ONE_DAY_IN_SECONDS,
            [HARD]: TWO_DAYS_IN_SECONDS,
            [GOOD]: (TWO_DAYS_IN_SECONDS * 2),
            [EASY]: (TWO_DAYS_IN_SECONDS * 4)
        }

        const original = new Card(undefined, 'deckId', 'Some question', 'Some answer', currentGoodInterval, undefined)

        const actuals = ANSWERS.map(it => {
            return {answer: it, newCard: new BusinessRules().cardAnswered(currentTime, original, it)}
        })

        for (let answerAndActual of actuals) {
            const expectedGoodInterval = expectedNewGoodInterval[answerAndActual.answer]
            const newCard = answerAndActual.newCard

            expect(newCard.goodInterval).toEqual(expectedGoodInterval)
        }
    })

    it('should return a multiple of two for card good interval for all current intervals', () => {

        const currentGoodInterval = TWO_DAYS_IN_SECONDS
        const card = new Card(undefined, 'deckId', 'Some question', 'Some answer', currentGoodInterval, undefined)

        const expectedIntervals = [
            HALF_DAY_IN_SECONDS, ONE_DAY_IN_SECONDS, TWO_DAYS_IN_SECONDS, TWO_DAYS_IN_SECONDS * 2
        ]

        const actual = new BusinessRules().currentAnswerIntervals(card)

        expect(actual).toEqual(expectedIntervals)
    })
})
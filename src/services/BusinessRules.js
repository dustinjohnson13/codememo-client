//@flow
import Card from "../entity/Card"
import {EASY, FAIL, GOOD, HALF_DAY_IN_SECONDS, HARD, ONE_DAY_IN_SECONDS} from "./APIDomain"

export default class BusinessRules {

    cardAnswered(currentTime: number, original: Card, answer: string): Card {

        let newDue = currentTime
        let newGoodInterval = original.goodInterval
        switch (answer) {
            case FAIL:
                newDue += HALF_DAY_IN_SECONDS
                newGoodInterval = ONE_DAY_IN_SECONDS
                break
            case HARD:
                newDue += original.goodInterval / 2
                newGoodInterval = original.goodInterval
                break
            case GOOD:
                newDue += original.goodInterval
                newGoodInterval = original.goodInterval * 2
                break
            case EASY:
                newDue += original.goodInterval * 2
                newGoodInterval = original.goodInterval * 4
                break
            default:
        }

        return new Card(original.id, original.deckId, original.question, original.answer, newGoodInterval, newDue)
    }

    currentAnswerIntervals(card: Card): Array<number> {
        const failInterval = HALF_DAY_IN_SECONDS
        const hardInterval = card.goodInterval / 2
        const goodInterval = card.goodInterval
        const easyInterval = card.goodInterval * 2

        return [failInterval, hardInterval, goodInterval, easyInterval]
    }
}
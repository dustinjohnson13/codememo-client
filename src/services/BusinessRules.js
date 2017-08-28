//@flow
import type {AnswerType} from "./APIDomain"
import * as api from "./APIDomain"
import {Answer, CardStatus, HALF_DAY_IN_SECONDS, ONE_DAY_IN_SECONDS} from "./APIDomain"
import {Card, Deck, DUE_IMMEDIATELY, newReview, Review} from "../persist/Dao"

export default class BusinessRules {

    cardAnswered(startTime: number, endTime: number, original: Card, answer: AnswerType): {updatedCard: Card, review: Review} {

        if (startTime > endTime) {
            throw new Error("Start time must be less than or equal to end time!")
        }

        let newDue = endTime
        let newGoodInterval = original.goodInterval
        switch (answer) {
            case Answer.FAIL:
                newDue += HALF_DAY_IN_SECONDS
                newGoodInterval = ONE_DAY_IN_SECONDS
                break
            case Answer.HARD:
                newDue += original.goodInterval / 2
                newGoodInterval = original.goodInterval
                break
            case Answer.GOOD:
                newDue += original.goodInterval
                newGoodInterval = original.goodInterval * 2
                break
            case Answer.EASY:
                newDue += original.goodInterval * 2
                newGoodInterval = original.goodInterval * 4
                break
            default:
        }

        const updatedCard = new Card(original.id, original.templateId, original.cardNumber, newGoodInterval, newDue)
        const review = newReview(updatedCard.id, startTime, endTime, answer)

        return {updatedCard, review}
    }

    currentAnswerIntervals(card: Card): Array<number> {
        const failInterval = HALF_DAY_IN_SECONDS
        const hardInterval = card.goodInterval / 2
        const goodInterval = card.goodInterval
        const easyInterval = card.goodInterval * 2

        return [failInterval, hardInterval, goodInterval, easyInterval]
    }

    cardToAPICard(currentTime: number, card: Card): api.Card {
        const status = card.due === DUE_IMMEDIATELY ? CardStatus.NEW : card.due > currentTime ? CardStatus.OK : CardStatus.DUE

        return new api.Card(card.id, status)
    }

    decksToAPICollectionResponse(currentTime: number, decks: Array<Deck>, cardsForDecks: Array<Array<Card>>) {
        const apiDecks = []
        decks.forEach((deck, idx) => {
                const deckCards: Array<Card> = cardsForDecks[idx]
                const totalCount = deckCards.length
                const dueCount = deckCards.filter(it => it.due !== DUE_IMMEDIATELY && it.due <= currentTime).length
                const newCount = deckCards.filter(it => it.due === DUE_IMMEDIATELY).length

                apiDecks.push(new api.Deck(deck.id, deck.name, totalCount, dueCount, newCount))
            }
        )
        return new api.CollectionResponse(apiDecks)
    }
}
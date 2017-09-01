//@flow
import {
  Answer,
  CardStatus,
  MILLIS_PER_DAY,
  MILLIS_PER_HALF_DAY,
  MILLIS_PER_MINUTE,
  MILLIS_PER_TWO_DAYS,
  MINUTES_PER_DAY,
  MINUTES_PER_FOUR_DAYS,
  MINUTES_PER_HALF_DAY,
  MINUTES_PER_TWO_DAYS
} from './APIDomain'

import BusinessRules from './BusinessRules'
import { Card, Deck, DUE_IMMEDIATELY } from '../persist/Dao'
import { fakeCards, fakeDecks } from '../fakeData/InMemoryDao'
import { FrozenClock } from './__mocks__/API'

describe('BusinessRules', () => {

  const clock = new FrozenClock()
  const businessRules = new BusinessRules()

  it('should throw error on answer card: start time after end time', () => {
    expect.assertions(1)

    const startTime = clock.epochMilliseconds()
    const endTime = startTime - 90
    const original = new Card('1', 'templateId', 1, MINUTES_PER_TWO_DAYS, 2000)

    try {
      businessRules.cardAnswered(startTime, endTime, original, Answer.GOOD)
    } catch (e) {
      expect(e).toEqual(new Error('Start time must be less than or equal to end time!'))
    }
  })

  it('should use same start and end time when the duration between them is greater than three minutes', () => {
    expect.assertions(1)

    const endTime = clock.epochMilliseconds()
    const startTime = endTime - (MILLIS_PER_MINUTE * 3 + 1)
    const original = new Card('1', 'templateId', 1, MINUTES_PER_TWO_DAYS, 2000)

    const {review} = businessRules.cardAnswered(startTime, endTime, original, Answer.GOOD)
    expect(review.startTime).toEqual(review.endTime)
  })

  it('should set next due time on answer card: due card', () => {

    const endTime = clock.epochMilliseconds()
    const startTime = endTime - MILLIS_PER_MINUTE * 3
    const currentGoodInterval = MINUTES_PER_TWO_DAYS

    const expectedNewDue = { // The cards have a current goodInterval of two days
      [Answer.FAIL]: endTime + MILLIS_PER_HALF_DAY,
      [Answer.HARD]: endTime + MILLIS_PER_DAY,
      [Answer.GOOD]: endTime + MILLIS_PER_TWO_DAYS,
      [Answer.EASY]: endTime + (MILLIS_PER_TWO_DAYS * 2)
    }

    const original = new Card('1', 'templateId', 1, currentGoodInterval, 2000)

    const actuals = [Answer.FAIL, Answer.HARD, Answer.GOOD, Answer.EASY].map(it => {
      const {updatedCard, review} = businessRules.cardAnswered(startTime, endTime, original, it)
      return {answer: it, newCard: updatedCard, review: review}
    })

    for (let answerAndActual of actuals) {
      const expectedDueTime = expectedNewDue[answerAndActual.answer]
      const newCard = answerAndActual.newCard
      const review = answerAndActual.review

      expect(newCard.due).toEqual(expectedDueTime)
      expect(review.startTime).toEqual(startTime)
      expect(review.endTime).toEqual(endTime)
    }
  })

  it('should set next good interval on answer card: due card', () => {

    const endTime = clock.epochMilliseconds()
    const startTime = endTime - 90
    const currentGoodInterval = MINUTES_PER_TWO_DAYS

    const expectedNewGoodInterval = {
      [Answer.FAIL]: MINUTES_PER_DAY,
      [Answer.HARD]: MINUTES_PER_TWO_DAYS,
      [Answer.GOOD]: (MINUTES_PER_TWO_DAYS * 2),
      [Answer.EASY]: (MINUTES_PER_TWO_DAYS * 4)
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

  it('should return a multiple of two for card good interval in minutes for all current intervals', () => {

    const currentGoodInterval = MINUTES_PER_TWO_DAYS
    const card = new Card('1', 'templateId', 1, currentGoodInterval, 2000)

    const expectedIntervals = [
      MINUTES_PER_HALF_DAY, MINUTES_PER_DAY, MINUTES_PER_TWO_DAYS, MINUTES_PER_FOUR_DAYS
    ]

    const actual = businessRules.currentAnswerIntervals(card)

    expect(actual).toEqual(expectedIntervals)
  })

  it('should map cards to api cards based on due time', () => {
    const currentTime = 2000

    const brandNew = new Card('1', 'templateId', 1, MINUTES_PER_DAY, DUE_IMMEDIATELY)
    const dueEarlier = new Card('2', 'templateId', 1, MINUTES_PER_DAY, currentTime - 100)
    const dueNow = new Card('3', 'templateId', 1, MINUTES_PER_DAY, currentTime)
    const ok = new Card('4', 'templateId', 1, MINUTES_PER_DAY, currentTime + 1);

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
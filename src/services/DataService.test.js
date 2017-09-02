//@flow
import type { Clock } from './APIDomain'
import { Answer, CardDetail, CollectionResponse, DeckResponse, MILLIS_PER_MINUTE } from './APIDomain'
import DaoDelegatingDataService from './DaoDelegatingDataService'
import { Card, DUE_IMMEDIATELY, Format, newDeck, TEST_DECK_NAME, TEST_USER_EMAIL } from '../persist/Dao'
import { FrozenClock } from './__mocks__/API'
import { fakeCards, fakeReviews, REVIEW_END_TIME } from '../fakeData/InMemoryDao'

describe('Placeholder', () => {
  it('needs this placeholder', () => {
    expect(true).toBeTruthy()
  })
})

async function getDueCard (clock: Clock, service: DaoDelegatingDataService): Promise<CardDetail> {
  const collection = await service.fetchCollection(TEST_USER_EMAIL)
  const decks = collection.decks
  const deckId = decks[0].id
  const deck = await service.fetchDeck(deckId)
  const response = await service.fetchCards(deck.cards.map(card => card.id))
  const cardsWithDueTime = response.cards.filter(card => card.due && card.due !== DUE_IMMEDIATELY &&
    card.due < clock.epochMilliseconds())

  if (!cardsWithDueTime) {
    throw new Error('Unable to find cards with due time!')
  }

  return cardsWithDueTime[0]
}

export function testServiceWithDaoImplementation (createDao: any) {
  describe('DataService', () => {

    const TOTAL_COUNT = 80
    const GOOD_COUNT = 30
    const DUE_COUNT = 27

    const clock = new FrozenClock()
    let service

    let dao
    let loadedDecks = []
    let loadedTemplates = []
    let loadedCards = []

    beforeEach(async () => {
      dao = createDao()

      loadedDecks = []
      loadedTemplates = []
      loadedCards = []

      service = new DaoDelegatingDataService(dao, clock)

      await service.init(true).then(() =>
        dao.findUserByEmail(TEST_USER_EMAIL)
          .then(user => dao.saveDeck(newDeck(user.id, TEST_DECK_NAME)))
          .then(deck => {
            loadedDecks.push(deck)

            const currentTime = clock.epochMilliseconds()
            const {templates, cards} = fakeCards(currentTime, deck.id, TOTAL_COUNT,
              DUE_COUNT, TOTAL_COUNT - GOOD_COUNT - DUE_COUNT, false)

            return Promise.all(templates.map(it => dao.saveTemplate(it))).then(templates => {
              loadedTemplates = templates

              return Promise.all(cards.map((card, idx) => {
                const cardWithTemplateId = new Card(card.id, templates[idx].id, card.cardNumber, card.goodInterval, card.due)
                return dao.saveCard(cardWithTemplateId)
              })).then(cards => {
                loadedCards = cards
                return cards
              }).then(cards => {
                const reviews = fakeReviews(REVIEW_END_TIME, cards[0].id, 1, false)

                return Promise.all(reviews.map(it => dao.saveReview(it)))
              })
            })
          }))
    })

    it('can add new deck', async () => {

      const deckName = 'My New Deck'

      const actual = await service.addDeck(TEST_USER_EMAIL, deckName)
      expect(actual.decks.length).toEqual(2)

      const returnedDeck = actual.decks.find(it => it.name === deckName)
      expect(returnedDeck).toBeDefined()
      if (returnedDeck) {
        expect(returnedDeck.name).toEqual(deckName)
        expect(returnedDeck.totalCount).toEqual(0)
        expect(returnedDeck.dueCount).toEqual(0)
        expect(returnedDeck.newCount).toEqual(0)
      }
    })

    it('add deck throws error for unknown user', async () => {
      expect.assertions(1)

      try {
        await service.addDeck('unknown@blah.com', 'NewDeck')
      } catch (e) {
        expect(e.message).toEqual('No user found with email unknown@blah.com')
      }
    })

    it('can update deck', async () => {

      const original = loadedDecks[0]

      const name = 'A New Name'

      const returned = await service.updateDeck(original.id, name)
      const actual = await service.fetchCollection(TEST_USER_EMAIL)
      const toVerify = [returned, actual]

      toVerify.forEach(it => {
        expect(it.decks.length).toEqual(1)
        expect(it.decks[0].id).toEqual(original.id)
        expect(it.decks[0].name).toEqual(name)
      })
    })

    it('update deck throws error for non-existent deck', async () => {
      expect.assertions(1)

      try {
        await service.updateDeck('i-dont-exist', 'A New Name')
      } catch (e) {
        expect(e.message).toEqual('No deck found with id i-dont-exist')
      }
    })

    it('can fetch collection', async () => {

      const actual: CollectionResponse = await service.fetchCollection(TEST_USER_EMAIL)
      expect(actual.decks.length).toEqual(1)

      const returnedDeck = actual.decks[0]
      expect(returnedDeck.name).toEqual(TEST_DECK_NAME)
      expect(returnedDeck.totalCount).toEqual(TOTAL_COUNT)
      expect(returnedDeck.dueCount).toEqual(DUE_COUNT)
      expect(returnedDeck.newCount).toEqual(TOTAL_COUNT - DUE_COUNT - GOOD_COUNT)
    })

    it('fetch collection throws error for unknown user', async () => {
      expect.assertions(1)

      try {
        const actual: CollectionResponse = await service.fetchCollection('unknown@blah.com')
      } catch (e) {
        expect(e.message).toEqual('No user found with email unknown@blah.com')
      }
    })

    it('can fetch decks', async () => {
      const actual = await service.fetchCollection(TEST_USER_EMAIL)
      const deck = await service.fetchDeck(actual.decks[0].id)

      expect(deck.name).toEqual(TEST_DECK_NAME)
      expect(deck.cards.length).toEqual(TOTAL_COUNT)
    })

    it('fetch decks throws error for non-existent deck', async () => {
      expect.assertions(1)

      try {
        const actual: DeckResponse = await service.fetchDeck('i-dont-exist')
      } catch (e) {
        expect(e.message).toEqual('No deck found with id i-dont-exist')
      }
    })

    it('fetch cards throws error for non-existent template for card', async () => {
      expect.assertions(1)

      const card = loadedCards[0]
      await dao.deleteTemplate(card.templateId)

      try {
        await service.fetchCards([card.id])
      } catch (e) {
        expect(e.message).toEqual(`Unable to find template for card ${card.id}`)
      }
    })

    it('can delete deck', async () => {
      const deck = loadedDecks[0]
      const deckId = deck.id

      const deckWithCards = await service.fetchDeck(deckId)
      expect(deckWithCards.cards.length).toBeGreaterThan(0)

      const actual = await service.deleteDeck(TEST_USER_EMAIL, deckId)
      const cardResponse = await service.fetchCards([deckWithCards.cards[0].id])

      expect(cardResponse.cards.length).toEqual(0)
    })

    it('can delete card', async () => {
      const card = loadedCards[0]
      const cardId = card.id

      // We expect these two things to be deleted
      const originalReviews = await service.fetchReviews(cardId)
      const template = await dao.findTemplate(card.templateId)

      expect(template).toBeDefined()

      const deck = await service.fetchDeck(template.deckId)
      const cards = deck.cards

      // Make sure we have stuff to delete
      expect(cards.length).toBeGreaterThan(0)
      expect(originalReviews.reviews.length).toBeGreaterThan(0)

      const actual = await service.deleteCard(TEST_USER_EMAIL, cardId)

      // Make sure deletions happened
      const cardResponse = await service.fetchDeck(deck.id)
      const newReviews = await service.fetchReviews(cardId)

      expect(cardResponse.cards.length).toEqual(cards.length - 1)
      expect(newReviews.reviews.length).toEqual(0)

      const shouldBeDeleted = await dao.findTemplate(card.templateId)
      expect(shouldBeDeleted).toBeUndefined()
    })

    it('delete card throws error for non-existent card', async () => {
      expect.assertions(1)

      try {
        await service.deleteCard(TEST_USER_EMAIL, 'i-dont-exist')
      } catch (e) {
        expect(e.message).toEqual('No card with id i-dont-exist')
      }
    })

    it('delete card throws error for non-existent template for card', async () => {
      expect.assertions(1)

      const card = loadedCards[0]
      await dao.deleteTemplate(card.templateId)

      try {
        await service.deleteCard(TEST_USER_EMAIL, card.id)
      } catch (e) {
        expect(e.message).toEqual(`No template with id ${card.templateId}`)
      }
    })

    it('can add new card', async () => {
      const question = 'The question'
      const answer = 'The answer'

      const collection = await service.fetchCollection(TEST_USER_EMAIL)
      const decks = collection.decks
      const deckId = decks[0].id
      const format = Format.HTML

      const actual = await service.addCard(deckId, format, question, answer)

      expect(actual.id).toBeDefined()
      expect(actual.format).toEqual(format)
      expect(actual.question).toEqual(question)
      expect(actual.answer).toEqual(answer)
      expect(actual.due).toEqual(DUE_IMMEDIATELY)
    })

    it('add card throws error for non-existent deck', async () => {
      expect.assertions(1)

      try {
        await service.addCard('i-dont-exist', Format.PLAIN, 'question', 'answer')
      } catch (e) {
        expect(e.message).toEqual('No deck with id i-dont-exist')
      }
    })

    it('can update card', async () => {

      const original = (await service.fetchCards([loadedCards[0].id])).cards[0]

      const question = 'Brand new question'
      const answer = 'Brand new answer'
      const format = Format.HTML

      const returned = await service.updateCard(original.id, format, question, answer)
      const actual = (await service.fetchCards([original.id])).cards[0]
      const toVerify = [returned, actual]

      toVerify.forEach(it => {
        expect(it.id).toEqual(original.id)
        expect(it.format).toEqual(format)
        expect(it.question).toEqual(question)
        expect(it.answer).toEqual(answer)
        expect(it.due).toEqual(original.due)
      })
    })

    it('update card throws error for non-existent card', async () => {
      expect.assertions(1)

      try {
        await service.updateCard('i-dont-exist', Format.PLAIN, 'question', 'answer')
      } catch (e) {
        expect(e.message).toEqual('No card with id i-dont-exist')
      }
    })

    it('update card throws error for non-existent template', async () => {
      expect.assertions(1)

      const originalCard = loadedCards[0]

      await dao.deleteTemplate(originalCard.templateId)

      try {
        await service.updateCard(originalCard.id, Format.PLAIN, 'question', 'answer')
      } catch (e) {
        expect(e.message).toEqual(`No template with id ${originalCard.templateId}`)
      }
    })

    it('can fetch deck by id', async () => {
      const collection = await service.fetchCollection(TEST_USER_EMAIL)
      const decks = collection.decks
      const idAsString = decks[0].id
      const actual = await service.fetchDeck(idAsString)

      expect(actual.id).toEqual(idAsString)
      expect(actual.name).toEqual(TEST_DECK_NAME)
      expect(actual.cards.length).toEqual(80)
    })

    it('can answer due card, should schedule interval based on answer', async () => {
      const card = await getDueCard(clock, service)

      const originalDue = card.due
      const originalGoodInterval = card.goodInterval

      const answeredCard = await service.answerCard(card.id, clock.epochMilliseconds() - MILLIS_PER_MINUTE, clock.epochMilliseconds(), Answer.GOOD)
      const newDue = answeredCard.due
      const newGoodInterval = answeredCard.goodInterval

      expect(originalDue).toBeGreaterThan(0)
      expect(newDue).toBeGreaterThan(originalDue)
      expect(newGoodInterval).toBeGreaterThan(originalGoodInterval)
    })

    it('can answer due card, should add new review', async () => {
      const card = await getDueCard(clock, service)
      const answer = Answer.HARD
      const currentReviews = await service.fetchReviews(card.id)

      const endTime = clock.epochMilliseconds()
      const startTime = endTime - MILLIS_PER_MINUTE

      await service.answerCard(card.id, startTime, endTime, answer)

      const newReviews = await service.fetchReviews(card.id)
      const reviews = newReviews.reviews

      expect(reviews.length).toEqual(currentReviews.reviews.length + 1)

      const review = reviews[reviews.length - 1]

      expect(review.cardId).toEqual(card.id)
      expect(review.answer).toEqual(answer)
      expect(review.startTime).toEqual(startTime)
      expect(review.endTime).toEqual(endTime)
    })

    it('answer card throws error for non-existent template for card', async () => {
      expect.assertions(1)

      const card = loadedCards[0]
      await dao.deleteTemplate(card.templateId)

      try {
        await service.answerCard(card.id, 1, 5000, Answer.GOOD)
      } catch (e) {
        expect(e.message).toEqual(`Unable to find template for card ${card.id}`)
      }
    })

    it('answer card throws error for non-existent card', async () => {
      expect.assertions(1)

      const card = loadedCards[0]
      await dao.deleteCard(card.id)

      try {
        await service.answerCard(card.id, 1, 5000, Answer.GOOD)
      } catch (e) {
        expect(e.message).toEqual(`Card with id ${card.id} doesn't exist.`)
      }
    })
  })
}
//@flow
import {
  Card,
  Deck,
  DUE_IMMEDIATELY,
  Format,
  newDeck,
  newReview,
  newUser,
  Review,
  Template,
  Templates,
  TEST_USER_EMAIL,
  User
} from '../persist/Dao'
import type { PreLoadedIds } from '../persist/AbstractDao.test'
import { testWithDaoImplementation } from '../persist/AbstractDao.test'
import { fakeCards, InMemoryDao, REVIEW_END_TIME } from './InMemoryDao'
import { Answer, MILLIS_PER_MINUTE, MINUTES_PER_DAY } from '../services/APIDomain'
import { testServiceWithDaoImplementation } from '../services/DataService.test'

describe('InMemoryDao', () => {

  const dao = new InMemoryDao()

  const createDao = () => {
    return dao
  }

  const loadCollectionData = async (): Promise<PreLoadedIds> => {
    const persistedUser = await dao.saveUser(newUser(TEST_USER_EMAIL))
    const persistedDecks = await Promise.all(
      [1, 2, 3, 4].map(i => {
        return dao.saveDeck(newDeck(persistedUser.id, `Deck${i}`))
      }))

    const idsFromZero = Array.from({length: 16}, (v, k) => k + 1)
    const persistedTemplates = await Promise.all(idsFromZero.map(id => {
      const deckId = (id < 5 ? persistedDecks[0].id : id < 9 ? persistedDecks[1].id : id < 13 ? persistedDecks[2].id : persistedDecks[3].id).toString()

      const entity = new Template(id.toString(), deckId, Templates.FRONT_BACK, Format.PLAIN, `Question ${id}?`, `Answer ${id}?`)

      return dao.saveTemplate(entity)
    }))
    const persistedCards = await Promise.all(idsFromZero.map((id, idx) => {
      const deckId = (id < 5 ? persistedDecks[0].id : id < 9 ? persistedDecks[1].id : id < 13 ? persistedDecks[2].id : persistedDecks[3].id).toString()
      const due = id % 4 === 0 ? DUE_IMMEDIATELY : 1508331802

      const card = new Card(id.toString(), persistedTemplates[idx].id, 1, MINUTES_PER_DAY, due)

      return dao.saveCard(card)
    }))
    const startTime = REVIEW_END_TIME - MILLIS_PER_MINUTE
    const persistedReview = await dao.saveReview(newReview(persistedCards[0].id, startTime, REVIEW_END_TIME, Answer.GOOD))

    return {
      users: [persistedUser.id.toString()],
      decks: persistedDecks.map(it => it.id.toString()),
      templates: persistedTemplates.map(it => it.id.toString()),
      cards: persistedCards.map(it => it.id.toString()),
      reviews: [persistedReview.id]
    }
  }

  function getSequelizeUser (id: string): Promise<User | void> {
    return dao.findUser(id)
  }

  function getSequelizeDeck (id: string): Promise<Deck | void> {
    return dao.findDeck(id)
  }

  function getSequelizeTemplate (id: string): Promise<Template | void> {
    return dao.findTemplate(id)
  }

  function getSequelizeCard (id: string): Promise<Card | void> {
    return dao.findCard(id)
  }

  function getSequelizeReview (id: string): Promise<Review | void> {
    return dao.findReview(id)
  }

  testWithDaoImplementation(createDao, loadCollectionData,
    getSequelizeUser, getSequelizeDeck, getSequelizeTemplate, getSequelizeCard, getSequelizeReview)

  testServiceWithDaoImplementation(createDao)

  it('should throw error on trying to add more due and new cards than total specified', () => {
    const totalCount = 10
    const dueCount = 9
    const newCount = 2

    expect(() => fakeCards(1, 'deckId', totalCount, dueCount, newCount, false))
      .toThrowError('Cannot specify more due and new cards than total!')
  })
})
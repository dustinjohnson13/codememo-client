//@flow
import type { Dao } from './Dao'
import {
  Card,
  Deck,
  Format,
  newCard,
  newDeck,
  newReview,
  newTemplate,
  newUser,
  NO_ID,
  Review,
  Template,
  Templates,
  TEST_USER_EMAIL,
  User
} from './Dao'
import { Answer, MILLIS_PER_MINUTE, MINUTES_PER_DAY, MINUTES_PER_TWO_DAYS } from '../services/APIDomain'
import { REVIEW_END_TIME } from '../fakeData/InMemoryDao'

export type PreLoadedIds = {
  +users: Array<string>,
  +decks: Array<string>,
  +templates: Array<string>,
  +cards: Array<string>,
  +reviews: Array<string>
}

describe('Placeholder', () => {
  it('needs this placeholder', () => {
    expect(true).toBeTruthy()
  })
})

export function
testWithDaoImplementation (createDao: () => Dao,
                           loadCollectionData: () => Promise<PreLoadedIds>,
                           getDBUser: (id: string) => Promise<User | void>,
                           getDBDeck: (id: string) => Promise<Deck | void>,
                           getDBTemplate: (id: string) => Promise<Template | void>,
                           getDBCard: (id: string) => Promise<Card | void>,
                           getDBReview: (id: string) => Promise<Review | void>) {

  describe('Dao', () => {

      let dao: Dao

      beforeEach(async () => {
        dao = createDao()
        await dao.init(true)
      })

      it('should be able to create a user', async () => {
        const original = newUser('blah@somewhere.com')

        const user = await dao.saveUser(original)
        expect(original.id).toEqual(NO_ID)
        expect(user.id).not.toEqual(NO_ID)
        expect(user).not.toBe(original)

        const dbUser = await getDBUser(user.id)
        if (!dbUser) {
          throw new Error(`Unable to find user ${user.id} in the DB!`)
        }

        expect(dbUser.id).toBeDefined()
        expect(dbUser.email).toEqual(user.email)
      })

      // it('should not be able to create multiple users with the same email', (done) => {
      //     expect.assertions(2)
      //
      //     const email = "blah@somewhere.com"
      //     const user = new User(undefined, email)
      //
      //     return dao.saveUser(user)
      //         .then((user) => expect(user.id).toBeDefined())
      //         .then(() => dao.saveUser(new User(undefined, email)))
      //         .catch((err) => {
      //             expect(err).toEqual(`User blah@somewhere.com already exists.`)
      //             done()
      //         })
      // })

      it('should be able to create a template', async () => {
        const deckId = '1'
        const entity = newTemplate(deckId, Templates.FRONT_BACK, Format.PLAIN, 'Question 1?', 'Answer 1?')
        const entity2 = newTemplate(deckId, Templates.FRONT_BACK, Format.HTML, 'Question 2?', 'Answer 2?')
        const entities = [entity, entity2]

        const persistedCards = await Promise.all(entities.map(original => dao.saveTemplate(original)))
        expect(persistedCards.length).toEqual(entities.length)

        entities.forEach(original => expect(original.id).toEqual(NO_ID))
        persistedCards.forEach(entity => expect(entity.id).not.toEqual(NO_ID))

        const originalByQuestion = new Map(entities.map(i => [i.field1, i]))

        const dbCards = await Promise.all(persistedCards.map(entity => getDBTemplate(entity.id)))

        dbCards.forEach((dbEntity?: Template) => {
          if (!dbEntity) {
            throw new Error('Unable to find a template in the database!')
          }

          const original = originalByQuestion.get(dbEntity.field1)
          if (!original) {
            throw new Error(`Unable to find the original template with field1 ${dbEntity.field1}!`)
          }

          expect(dbEntity.deckId).toEqual(original.deckId)
          expect(dbEntity.type).toEqual(original.type)
          expect(dbEntity.field1).toEqual(original.field1)
          expect(dbEntity.field2).toEqual(original.field2)

          const expectedFormat = (dbEntity.field1.indexOf('2?') === -1) ? Format.PLAIN : Format.HTML
          expect(dbEntity.format).toEqual(expectedFormat)
        })
      })

      it('should be able to create a card', async () => {
        const templateId = '1'
        const entity = newCard(templateId, 1)
        const entity2 = newCard(templateId, 2)
        const entities = [entity, entity2]

        const persistedCards = await Promise.all(entities.map(original => dao.saveCard(original)))
        expect(persistedCards.length).toEqual(entities.length)

        entities.forEach(original => expect(original.id).toEqual(NO_ID))
        persistedCards.forEach(entity => expect(entity.id).not.toEqual(NO_ID))

        const originalByQuestion = new Map(entities.map(i => [i.cardNumber, i]))

        const dbCards = await Promise.all(persistedCards.map(entity => getDBCard(entity.id)))

        dbCards.forEach((dbCard?: Card) => {
          if (!dbCard) {
            throw new Error('Unable to find a card in the database!')
          }

          const original = originalByQuestion.get(dbCard.cardNumber)
          if (!original) {
            throw new Error(`Unable to find the original card with card number ${dbCard.cardNumber}!`)
          }

          expect(dbCard.templateId).toEqual(original.templateId)
          expect(dbCard.cardNumber).toEqual(original.cardNumber)
          expect(dbCard.goodInterval).toEqual(original.goodInterval)
          expect(dbCard.due).toEqual(original.due)
        })
      })

      it('should be able to create a deck', async () => {

        const userId = '1'
        const original = newDeck(userId, 'Some Name')

        const entity = await dao.saveDeck(original)

        expect(original.id).toEqual(NO_ID)
        expect(entity.id).not.toEqual(NO_ID)
        expect(entity).not.toBe(original)

        const dbDeck = await getDBDeck(entity.id)

        if (!dbDeck) {
          throw new Error(`Unable to find a deck with id ${entity.id} in the database!`)
        }

        expect(dbDeck.name).toEqual(entity.name)
        expect(dbDeck.userId).toEqual(entity.userId)
      })

      it('should be able to delete a user', async () => {

        const preLoadedIds = await loadCollectionData()
        const id = preLoadedIds.users[0]

        await dao.deleteUser(id)

        const result = await getDBUser(id)
        expect(result).toBeUndefined()
      })

      it('should be able to delete a template', async () => {

        const preLoadedIds = await loadCollectionData()
        const id = preLoadedIds.templates[0]

        await dao.deleteTemplate(id)

        const result = await getDBTemplate(id)
        expect(result).toBeUndefined()
      })

      it('should be able to delete a card', async () => {

        const preLoadedIds = await loadCollectionData()
        const id = preLoadedIds.cards[0]

        await dao.deleteCard(id)

        const result = await getDBCard(id)
        expect(result).toBeUndefined()
      })

      it('should be able to delete a deck', async () => {

        const preLoadedIds = await loadCollectionData()
        const id = preLoadedIds.decks[0]

        await dao.deleteDeck(id)

        const result = await getDBDeck(id)
        expect(result).toBeUndefined()
      })

      it('should be able to delete a review', async () => {

        const preLoadedIds = await loadCollectionData()
        const id = preLoadedIds.reviews[0]

        await dao.deleteReview(id)

        const result = await getDBReview(id)
        expect(result).toBeUndefined()
      })

      it('should be able to query for a user', async () => {

        const preLoadedIds = await loadCollectionData()
        const id = preLoadedIds.users[0]

        const user = await dao.findUser(id)
        if (!user) {
          throw new Error(`Unable to find user with id ${id}`)
        }

        expect(user.id).toEqual(id)
        expect(user.email).toEqual('someone@blah.com')
      })

      it('should be able to query for a template', async () => {

        const preLoadedIds = await loadCollectionData()
        const id = preLoadedIds.templates[2]
        const result = await dao.findTemplate(id)

        if (!result) {
          throw new Error(`Unable to find template with id ${id}`)
        }

        expect(result.id).toEqual(id)
        expect(result.deckId).toEqual(preLoadedIds.decks[0])
        expect(result.type).toEqual(Templates.FRONT_BACK)
        expect(result.format).toEqual(Format.PLAIN)
        expect(result.field1).toEqual('Question 3?')
        expect(result.field2).toEqual('Answer 3?')
      })

      it('should be able to query for a card', async () => {

        const preLoadedIds = await loadCollectionData()
        const id = preLoadedIds.cards[2]
        const result = await dao.findCard(id)

        if (!result) {
          throw new Error(`Unable to find card with id ${id}`)
        }

        expect(result.id).toEqual(id)
        expect(result.templateId).toEqual(preLoadedIds.templates[2])
        expect(result.cardNumber).toEqual(1)
        expect(result.goodInterval).toEqual(MINUTES_PER_DAY)
        expect(result.due).toEqual(1508331802)
      })

      it('should be able to query for a deck', async () => {
        const preLoadedIds = await loadCollectionData()
        const id = preLoadedIds.decks[2]
        const result = await dao.findDeck(id)

        if (!result) {
          throw new Error(`Unable to find deck with id ${id}`)
        }

        expect(result.id).toEqual(id)
        expect(result.userId).toEqual(preLoadedIds.users[0])
        expect(result.name).toEqual('Deck3')
      })

      it('should be able to query for a review', async () => {
        const preLoadedIds = await loadCollectionData()
        const id = preLoadedIds.reviews[0]
        const result = await dao.findReview(id)

        if (!result) {
          throw new Error(`Unable to find review with id ${id}`)
        }

        expect(result.id).toEqual(id)
        expect(result.cardId).toEqual(preLoadedIds.cards[0])
        expect(result.startTime).toEqual(REVIEW_END_TIME - MILLIS_PER_MINUTE)
        expect(result.endTime).toEqual(REVIEW_END_TIME)
        expect(result.answer).toEqual(Answer.GOOD)
      })

      it('should return undefined querying for non-existent user', async () => {

        const id = '9999999'

        const result = await dao.findUser(id)
        expect(result).toBeUndefined()
      })

      it('should return undefined querying for non-existent deck', async () => {

        const id = '9999999'

        const result = await dao.findDeck(id)
        expect(result).toBeUndefined()
      })

      it('should return undefined querying for non-existent card', async () => {

        const id = '9999999'

        const result = await dao.findCard(id)
        expect(result).toBeUndefined()
      })

      it('should be able to update a user', async () => {

        const preLoadedIds = await loadCollectionData()
        const id = preLoadedIds.users[0]
        const newEmail = 'yoyoyo@somewhereelse.com'

        const user = await dao.updateUser(new User(id, newEmail))
        const dbUser = await getDBUser(user.id)

        if (!dbUser) {
          throw new Error(`Unable to find db user with id ${id}`)
        }

        expect(dbUser.email).toEqual(newEmail)
      })

      it('should be able to update a template', async () => {

        const preLoadedIds = await loadCollectionData()
        const id = preLoadedIds.templates[2]

        const newDeckId = 'newDeckId'
        const newFormat = Format.HTML
        const newField1 = 'newQuestion?'
        const newField2 = 'newAnswer?'

        await dao.updateTemplate(new Template(id, newDeckId, Templates.FRONT_BACK, newFormat, newField1, newField2))

        const dbEntity = await getDBTemplate(id)

        if (!dbEntity) {
          throw new Error(`Unable to find db template with id ${id}`)
        }

        expect(dbEntity.deckId).toEqual(newDeckId)
        expect(dbEntity.type).toEqual(Templates.FRONT_BACK)
        expect(dbEntity.format).toEqual(newFormat)
        expect(dbEntity.field1).toEqual(newField1)
        expect(dbEntity.field2).toEqual(newField2)
      })

      it('should be able to update a card', async () => {

        const preLoadedIds = await loadCollectionData()
        const id = preLoadedIds.cards[2]

        const newTemplateId = 'newDeckId'
        const newCardNumber = 2
        const newGoodInterval = MINUTES_PER_TWO_DAYS
        const newDue = 12

        await dao.updateCard(new Card(id, newTemplateId, newCardNumber, newGoodInterval, newDue))

        const dbCard = await getDBCard(id)

        if (!dbCard) {
          throw new Error(`Unable to find db card with id ${id}`)
        }

        expect(dbCard.templateId).toEqual(newTemplateId)
        expect(dbCard.cardNumber).toEqual(newCardNumber)
        expect(dbCard.goodInterval).toEqual(newGoodInterval)
        expect(dbCard.due).toEqual(newDue)
      })

      it('should be able to update a deck', async () => {

        const preLoadedIds = await loadCollectionData()
        const id = preLoadedIds.decks[1]

        const newUserId = 'another-user'
        const newName = 'SomeNewName'

        await dao.updateDeck(new Deck(id, newUserId, newName))

        const dbDeck = await getDBDeck(id)

        if (!dbDeck) {
          throw new Error(`Unable to find db card with id ${id}`)
        }

        expect(dbDeck.userId).toEqual(newUserId)
        expect(dbDeck.name).toEqual(newName)
      })

      it('should be able to update a review', async () => {

        const preLoadedIds = await loadCollectionData()
        const id = preLoadedIds.reviews[0]

        const newCardId = '99999'
        const newStartTime = 6666666
        const newEndTime = 7777777
        const newAnswer = Answer.EASY

        await dao.updateReview(new Review(id, newCardId, newStartTime, newEndTime, newAnswer))

        const dbReview = await getDBReview(id)

        if (!dbReview) {
          throw new Error(`Unable to find db review with id ${id}`)
        }

        expect(dbReview.cardId).toEqual(newCardId)
        expect(dbReview.startTime).toEqual(newStartTime)
        expect(dbReview.endTime).toEqual(newEndTime)
        expect(dbReview.answer).toEqual(newAnswer)
      })

      it('should throw exception on updating new user', async () => {
        expect.assertions(1)

        const entity = newUser('yoyoyo@somewhereelse.com')
        try {
          await dao.updateUser(entity)
        } catch (e) {
          expect(e).toEqual(new Error('Unable to update non-persisted user!'))
        }
      })

      it('should throw exception on updating new deck', async () => {
        expect.assertions(1)

        const entity = newDeck('2', 'Some Deck Name')
        try {
          await dao.updateDeck(entity)
        } catch (e) {
          expect(e).toEqual(new Error('Unable to update non-persisted deck!'))
        }
      })

      it('should throw exception on updating new template', async () => {
        expect.assertions(1)

        const entity = newTemplate('2', Templates.FRONT_BACK, Format.PLAIN, 'Some Question', 'Some Answer')
        try {
          await dao.updateTemplate(entity)
        } catch (e) {
          expect(e).toEqual(new Error('Unable to update non-persisted template!'))
        }
      })

      it('should throw exception on updating new card', async () => {
        expect.assertions(1)

        const entity = newCard('2', 1)
        try {
          await dao.updateCard(entity)
        } catch (e) {
          expect(e).toEqual(new Error('Unable to update non-persisted card!'))
        }
      })

      it('should throw exception on updating new review', async () => {
        expect.assertions(1)

        const entity = newReview('2', 88888, 99999, Answer.EASY)
        try {
          await dao.updateReview(entity)
        } catch (e) {
          expect(e).toEqual(new Error('Unable to update non-persisted review!'))
        }
      })

      it('should throw exception on updating non-existent user', async () => {
        expect.assertions(1)

        const id = '9999999'

        const entity = new User(id, 'yoyoyo@somewhereelse.com')
        try {
          await dao.updateUser(entity)
        } catch (e) {
          expect(e).toEqual(new Error('Unable to update non-existent user!'))
        }
      })

      it('should throw exception on updating non-existent deck', async () => {
        expect.assertions(1)

        const id = '9999999'

        const entity = new Deck(id, '1', 'Some Deck Name')
        try {
          await dao.updateDeck(entity)
        } catch (e) {
          expect(e).toEqual(new Error('Unable to update non-existent deck!'))
        }
      })

      it('should throw exception on updating non-existent template', async () => {
        expect.assertions(1)

        const id = '9999999'

        const entity = new Template(id, '1', Templates.FRONT_BACK, Format.PLAIN, 'Some Question', 'Some Answer')
        try {
          await dao.updateTemplate(entity)
        } catch (e) {
          expect(e).toEqual(new Error('Unable to update non-existent template!'))
        }
      })

      it('should throw exception on updating non-existent card', async () => {
        expect.assertions(1)

        const id = '9999999'

        const entity = new Card(id, '1', 1, MINUTES_PER_DAY, 2000)
        try {
          await dao.updateCard(entity)
        } catch (e) {
          expect(e).toEqual(new Error('Unable to update non-existent card!'))
        }
      })

      it('should throw exception on updating non-existent review', async () => {
        expect.assertions(1)

        const id = '9999999'

        const entity = new Review(id, '1', 88888, 99999, Answer.HARD)
        try {
          await dao.updateReview(entity)
        } catch (e) {
          expect(e).toEqual(new Error('Unable to update non-existent review!'))
        }
      })

      it('should be able to find decks by user id', async () => {

        const preLoadedIds = await loadCollectionData()
        const id = preLoadedIds.users[0]
        const decks = await dao.findDecksByUserId(id)

        expect(decks.length).toEqual(4)
        expect(decks.map(it => it.id).sort()).toEqual(preLoadedIds.decks.sort())
        expect(decks.map(it => it.name).sort()).toEqual([
          'Deck1', 'Deck2', 'Deck3', 'Deck4',
        ].sort())
      })

      it('should be able to find cards by deck id', async () => {

        const preLoadedIds = await loadCollectionData()
        const id = preLoadedIds.decks[0]
        const cards = await dao.findCardsByDeckId(id)

        expect(cards.length).toEqual(4)
        expect(cards.map(it => it.id).sort()).toEqual(preLoadedIds.cards.slice(0, 4).sort())
      })

      it('should be able to find user by email', async () => {
        const preLoadedIds = await loadCollectionData()
        const user = await dao.findUserByEmail(TEST_USER_EMAIL)

        if (!user) {
          throw new Error(`Unable to find user with email ${TEST_USER_EMAIL}!`)
        }

        expect(user.email).toEqual(TEST_USER_EMAIL)
      })

      it('should return undefined when unable to find user by email', async () => {
        const user = await dao.findUserByEmail('idontexist@nowhere.com')

        expect(user).toBeUndefined()
      })
    }
  )
}
//@flow
import type {Dao} from "./Dao"
import {Card, Deck, newCard, newDeck, newUser, NO_ID, TEST_USER_EMAIL, User} from "./Dao"
import {TWO_DAYS_IN_SECONDS} from "../services/APIDomain"

export type PreLoadedIds = {
    users: Array<string>,
    decks: Array<string>,
    cards: Array<string>
}

describe('Placeholder', () => {
    it('needs this placeholder', () => {
        expect(true).toBeTruthy()
    })
})

export function
testWithDaoImplementation(createDao: () => Dao,
                          loadCollectionData: () => Promise<PreLoadedIds>,
                          getDBUser: (id: string) => Promise<User | void>,
                          getDBDeck: (id: string) => Promise<Deck | void>,
                          getDBCard: (id: string) => Promise<Card | void>) {

    describe('Dao', () => {

            let dao: Dao

            beforeEach(async () => {
                dao = createDao()
                await dao.init(true)
            })

            it('should be able to create a user', async () => {
                const original = newUser("blah@somewhere.com")

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

            it('should be able to create a card', async () => {
                const deckId = "1"
                const entity = newCard(deckId, "Question 1?", "Answer 1?")
                const entity2 = newCard(deckId, "Question 2?", "Answer 2?")
                const entities = [entity, entity2]

                const persistedCards = await Promise.all(entities.map(original => dao.saveCard(original)))
                expect(persistedCards.length).toEqual(entities.length)

                entities.forEach(original => expect(original.id).toEqual(NO_ID))
                persistedCards.forEach(entity => expect(entity.id).not.toEqual(NO_ID))

                const originalByQuestion = new Map(entities.map(i => [i.question, i]))

                const dbCards = await Promise.all(persistedCards.map(entity => getDBCard(entity.id)))

                dbCards.forEach((dbCard?: Card) => {
                    if (!dbCard) {
                        throw new Error("Unable to find a card in the database!")
                    }

                    const original = originalByQuestion.get(dbCard.question)
                    if (!original) {
                        throw new Error(`Unable to find the original card with question ${dbCard.question}!`)
                    }

                    expect(dbCard.question).toEqual(original.question)
                    expect(dbCard.answer).toEqual(original.answer)
                    expect(dbCard.goodInterval).toEqual(original.goodInterval)
                    expect(dbCard.due).toEqual(original.due)
                    expect(dbCard.deckId).toEqual(original.deckId)
                })
            })

            it('should be able to create a deck', async () => {

                const userId = "1"
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

            it('should be able to query for a user', async () => {

                const preLoadedIds = await loadCollectionData()
                const id = preLoadedIds.users[0]

                const user = await dao.findUser(id)
                if (!user) {
                    throw new Error(`Unable to find user with id ${id}`)
                }

                expect(user.id).toEqual(id)
                expect(user.email).toEqual("someone@blah.com")
            })

            it('should be able to query for a card', async () => {

                const preLoadedIds = await loadCollectionData()
                const id = preLoadedIds.cards[2]
                const result = await dao.findCard(id)

                if (!result) {
                    throw new Error(`Unable to find card with id ${id}`)
                }

                expect(result.id).toEqual(id)
                expect(result.deckId).toEqual(preLoadedIds.decks[0])
                expect(result.question).toEqual("Question 3?")
                expect(result.answer).toEqual("Answer 3?")
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
                expect(result.name).toEqual("Deck3")
            })

            it('should be able to update a user', async () => {

                const preLoadedIds = await loadCollectionData()
                const id = preLoadedIds.users[0]
                const newEmail = "yoyoyo@somewhereelse.com"

                const user = await dao.updateUser(new User(id, newEmail))
                const dbUser = await getDBUser(user.id)

                if (!dbUser) {
                    throw new Error(`Unable to find db user with id ${id}`)
                }

                expect(dbUser.email).toEqual(newEmail)
            })

            it('should be able to update a card', async () => {

                const preLoadedIds = await loadCollectionData()
                const id = preLoadedIds.cards[2]

                const newDeckId = "newDeckId"
                const newQuestion = "newQuestion?"
                const newAnswer = "newAnswer?"
                const newGoodInterval = TWO_DAYS_IN_SECONDS
                const newDue = 12

                await dao.updateCard(new Card(id, newDeckId, newQuestion, newAnswer, TWO_DAYS_IN_SECONDS, newDue))

                const dbCard = await getDBCard(id)

                if (!dbCard) {
                    throw new Error(`Unable to find db card with id ${id}`)
                }

                expect(dbCard.deckId).toEqual(newDeckId)
                expect(dbCard.question).toEqual(newQuestion)
                expect(dbCard.answer).toEqual(newAnswer)
                expect(dbCard.goodInterval).toEqual(newGoodInterval)
                expect(dbCard.due).toEqual(newDue)
            })

            it('should be able to update a deck', async () => {

                const preLoadedIds = await loadCollectionData()
                const id = preLoadedIds.decks[1]

                const newUserId = "another-user"
                const newName = "SomeNewName"

                await dao.updateDeck(new Deck(id, newUserId, newName))

                const dbDeck = await getDBDeck(id)

                if (!dbDeck) {
                    throw new Error(`Unable to find db card with id ${id}`)
                }

                expect(dbDeck.userId).toEqual(newUserId)
                expect(dbDeck.name).toEqual(newName)
            })

            it('should be able to find decks by user id', async () => {

                const preLoadedIds = await loadCollectionData()
                const id = preLoadedIds.users[0]
                const decks = await dao.findDecksByUserId(id)

                expect(decks.length).toEqual(4)
                expect(decks.map(it => it.id).sort()).toEqual(preLoadedIds.decks.sort())
                expect(decks.map(it => it.name).sort()).toEqual([
                    "Deck1", "Deck2", "Deck3", "Deck4",
                ].sort())
            })

            it('should be able to find cards by deck id', async () => {

                const preLoadedIds = await loadCollectionData()
                const id = preLoadedIds.decks[0]
                const cards = await dao.findCardsByDeckId(id)

                expect(cards.length).toEqual(4)
                expect(cards.map(it => it.id)).toEqual(preLoadedIds.cards.slice(0, 4))
                expect(cards.map(it => it.question)).toEqual([
                    "Question 1?", "Question 2?", "Question 3?", "Question 4?",
                ])
            })

            it('should be able to find user by email', async () => {
                const preLoadedIds = await loadCollectionData()
                const user = await dao.findUserByEmail(TEST_USER_EMAIL)

                if (!user) {
                    throw new Error(`Unable to find user with email ${TEST_USER_EMAIL}!`)
                }

                expect(user.email).toEqual(TEST_USER_EMAIL)
            })
        }
    )
}